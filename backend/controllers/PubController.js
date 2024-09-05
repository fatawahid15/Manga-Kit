const axios = require("axios");
const baseUrl = "https://api.mangadex.org";
const groq = require("groq-sdk");

class PubController {
  // Get Manga Method
  static async getManga(req, res, next) {
    try {
      const searchQuery = req.query.search || "";
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
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
        const coverArt = manga.relationships.find((rel) => rel.type === "cover_art");
        const coverFilename = coverArt ? coverArt.attributes.fileName : null;

        // Proxy URL for cover image
        const coverUrl = coverFilename
          ? `${req.protocol}://${req.get('host')}/proxy-image/${manga.id}/${coverFilename}`
          : null;
  
        const title = manga.attributes.title.en ||
          Object.values(manga.attributes.title)[0] ||
          "Title not available";
  
        const description = manga.attributes.description.en ||
          Object.values(manga.attributes.description)[0] ||
          "No description available.";
  
        return {
          id: manga.id,
          title,
          description,
          coverUrl, 
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
      console.error("Error fetching manga:", error.message);
      res.status(500).json({ message: "Internal server error" });
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

      const answer = chatCompletion.choices[0]?.message.content || "No response from AI";
      res.status(200).json({ answer });
    } catch (error) {
      console.error("Error in AI prompt:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PubController;
