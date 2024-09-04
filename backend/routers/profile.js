const express = require('express')
const { getOwnProfile, updateOwnProfile } = require('../controllers/ProfileController')
const router = express.Router()

router.get('/profile/me', getOwnProfile)
router.put('/profile/me', updateOwnProfile)

module.exports = router