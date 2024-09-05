const express = require("express");
const { getManga, AiPrompt } = require("../controllers/PubController");
const router = express.Router();
const NodeCache = require("node-cache");
const imageCache = new NodeCache({ stdTTL: 600 }); 
const axios = require('axios')

router.get("/proxy-image/:mangaId/:coverFilename", async (req, res, next) => {
    const { mangaId, coverFilename } = req.params;
    const cacheKey = `${mangaId}-${coverFilename}`;
    const cachedImage = imageCache.get(cacheKey);
  
    if (cachedImage) {
      console.log("Serving image from cache.");
      res.setHeader("Content-Type", "image/jpeg");
      return res.send(cachedImage);
    }
  
    const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverFilename}.256.jpg`;
  
    try {
      const response = await axios({
        url: imageUrl,
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0", 
        },
      });
  
      const imageData = response.data;
      console.log("Image data fetched:", imageData);
  
      imageCache.set(cacheKey, imageData);
  

      res.setHeader("Content-Type", "image/jpeg");
      res.send(imageData);
    } catch (error) {
      console.error("Error fetching image:", error);
  
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error:", error.response.data);
        next({ name: "UNAUTHORIZED", message: "Unauthorized access to the image." });
      } else if (error.response) {

        console.log("External API error:", error.response.data);
        next({ name: "ExternalAPIError", message: "Error fetching image from external API." });
      } else {
        next(error);
      }
    }
  });

router.post("/chat", AiPrompt);
router.get("/manga", getManga);

module.exports = router;
