const express = require('express')
const { getOwnProfile, updateOwnProfile, deleteBio, deleteImg, updateProfileImg, getProfileId, getAllProfile, AiPrompt } = require('../controllers/ProfileController')
const router = express.Router()
const upload = require('../helpers/multer')

router.get('/profile', getAllProfile)
router.get('/profile/me', getOwnProfile)
router.put('/profile/me', updateOwnProfile)
router.delete('/profile/me/bio' , deleteBio)
router.delete('/profile/me/img' , deleteImg)
router.patch('/profile/me/img' , upload.single('file'), updateProfileImg)
router.get('/profile/:id', getProfileId)

module.exports = router