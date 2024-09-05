const express = require('express')
const { getManga, AiPrompt } = require('../controllers/PubController')
const router = express.Router()

router.post('/chat' , AiPrompt)
router.get('/manga' , getManga)

module.exports = router
