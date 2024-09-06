const { compare } = require("bcryptjs");
const { User, Profile, Bookmark } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { hash } = require("../helpers/bcrypt");
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: "UNAUTHENTICATED" };
      }

      await User.create({
        email,
        password: hash(password),
      });

      const user = await User.findOne({
        where: { email },
      });

      await Profile.create({
        UserId: user.id,
        username: user.email.split("@")[0],
      });

      res.status(200).json({
        message: "success create new user",
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_API);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_API, // Your Google Client ID
      });

      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          password: "password_google", // You can store a random password here or a hash
        },
        hooks: false,
      });

      // Find or create profile
      let profile = await Profile.findOne({ where: { UserId: user.id } });

      if (!profile) {
        profile = await Profile.create({
          UserId: user.id,
          username: user.email.split("@")[0],
        });
      }

      // Sign the token with user info
      const access_token = signToken({
        id: user.id,
        email: user.email,
      });

      // Return the access token to the client
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      next(error); // Ensure the error is passed to an error handler middleware
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
      next(error);
    }
  }
}

module.exports = AuthController;
