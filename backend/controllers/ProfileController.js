const { Op } = require("sequelize");
const { User, Profile, Bookmark } = require("../models/index");
const cloudinary = require("cloudinary").v2;

class ProfileController {
  static async getOwnProfile(req, res, next) {
    try {
      const profile = await Profile.findOne({
        where: { UserId: req.userLoginData.id },
      });

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async updateOwnProfile(req, res, next) {
    try {
      const { username, bio } = req.body;

      await Profile.update(
        { username, bio },
        { where: { UserId: req.userLoginData.id } }
      );

      const profile = await Profile.findOne({
        where: { UserId: req.userLoginData.id },
      });

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async deleteBio(req, res, next) {
    try {
      await Profile.update(
        { bio: null },
        { where: { UserId: req.userLoginData.id } }
      );

      const profile = await Profile.findOne({
        where: { UserId: req.userLoginData.id },
      });

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async deleteImg(req, res, next) {
    try {
      await Profile.update(
        { imgUrl: null },
        { where: { UserId: req.userLoginData.id } }
      );

      const profile = await Profile.findOne({
        where: { UserId: req.userLoginData.id },
      });

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async updateProfileImg(req, res, next) {
    try {
      const imageInBase64 = req.file.buffer.toString("base64");

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${imageInBase64}`
      );

      await Profile.update(
        { imgUrl: result.url },
        { where: { UserId: req.userLoginData.id } }
      );

      const profile = await Profile.findOne({
        where: { UserId: req.userLoginData.id },
      });

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async getProfileId(req, res, next) {
    try {
      const { id } = req.params;

      const profile = await Profile.findByPk(id);

      res.status(200).json({
        profile,
      });
    } catch (error) {
      next(error)
    }
  }

  static async getAllProfile(req, res, next) {
    try {
      const { search } = req.query;

      const query = {};

      if (search) {
        query.where = {
          username: {
            [Op.like]: `%${search}%`,
          },
        };
      }

      const profiles = await Profile.findAll(query);

      res.status(200).json({ profiles });
    } catch (error) {
      next(error)
    }
  }

}

module.exports = ProfileController;
