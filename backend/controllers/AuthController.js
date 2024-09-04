const { compare } = require("bcryptjs");
const { User, Profile, Bookmark } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { hash } = require("../helpers/bcrypt");

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      await User.create({
        email,
        password: hash(password),
      });

      const user = await User.findOne({
        where: { email },
      });

      await Profile.create({
        UserId: user.id,
        username: user.email.split('@')[0]
      });

      res.status(200).json({
        message: "success create new user",
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "UNAUTHENTICATED" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      console.log(user);

      if (!user) {
        throw { name: "UNAUTHENTICATED" };
      }

      if (!compare(password, user.password)) {
        throw { name: "UNAUTHENTICATED" };
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AuthController;
