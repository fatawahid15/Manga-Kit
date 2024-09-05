const express = require("express");
const router = express.Router();
const userEP = require('../routers/User')
const mangaEP = require('../routers/manga');
const profileEP = require('../routers/profile')
const pubEP = require('../routers/public')
const { authentication } = require("../middleware/auth");
const errorHandler = require("../middleware/errorHandler");

router.use('/pub' , pubEP)
router.use('/user', userEP)

router.use(authentication)

router.use('/', mangaEP, profileEP)

router.use(errorHandler)

module.exports = router
