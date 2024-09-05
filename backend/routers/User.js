const express = require('express')
const { register, login, googleLogin } = require('../controllers/AuthController')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google-login' , googleLogin)

module.exports = router