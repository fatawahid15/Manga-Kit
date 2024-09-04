const express = require("express");
const router = express.Router();
const userEP = require('../routers/User')
const mangaEP = require('../routers/manga');
const profileEP = require('../routers/profile')
const { authentication } = require("../middleware/auth");

router.use('/user', userEP)

router.use(authentication)

router.use('/', mangaEP, profileEP)

module.exports = router
