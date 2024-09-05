const { convertToken } = require("../helpers/jwt");
const {User} = require('../models/index')

exports.authentication = async (req, res, next) => {
    try {
        const {authorization} = req.headers;

        if(!authorization){
      throw { name: "UNAUTHORIZED" };
    }

    const token = authorization.split(' ')[1]

    if(!token){
      throw { name: "UNAUTHENTICATED" };
    }

    const payload = convertToken(token)

    const fUser = await User.findByPk(payload.id)

    if(!fUser){
      throw { name: "UNAUTHENTICATED" };
    }
   
    req.userLoginData = {
        id: payload.id
    }

    next()
    } catch (error) {
        next(error)
    }
}