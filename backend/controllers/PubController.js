const axios = require("axios");
const baseUrl = "https://api.mangadex.org";
const coverBaseUrl = "https://uploads.mangadex.org/covers";
const groq = require("groq-sdk");

class PubController {
  static async getManga(req, res, next) {
    try {
      const searchQuery = req.query.search || "";
      const limit = parseInt(req.query.limit) || 10;
      let page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const response = await axios.get(`${baseUrl}/manga`, {
        params: {
          title: searchQuery,
          limit,
          offset,
          contentRating: ["safe"],
          includes: ["cover_art"],
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const mangaList = response.data.data.map((manga) => {
        const coverArt = manga.relationships.find(
          (rel) => rel.type === "cover_art"
        );
        const coverFilename = coverArt ? coverArt.attributes.fileName : null;
        const coverUrl = coverFilename
          ? `${coverBaseUrl}/${manga.id}/${coverFilename}`
          : null;

        return {
          id: manga.id,
          title: manga.attributes.title.en || "Title not available",
          description:
            manga.attributes.description.en || "No description available.",
          coverUrl: coverUrl,
        };
      });

      const totalResults = response.data.total;
      const totalPages = Math.ceil(totalResults / limit);

      res.status(200).json({
        mangas: mangaList,
        pagination: {
          totalResults,
          currentPage: page,
          totalPages,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async AiPrompt(req, res, next) {
    try {
      const { question } = req.body;

      const groqClient = new groq({ apiKey: process.env.GROQ_API });

      const chatCompletion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        model: "llama3-8b-8192",
      });

      const answer =
        chatCompletion.choices[0]?.message.content || "No response from AI";

      res.status(200).json({ answer });
    } catch (error) {
      console.error("Error in AI prompt:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PubController;
