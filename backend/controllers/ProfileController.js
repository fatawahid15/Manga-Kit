const { User, Profile, Bookmark } = require("../models/index");

class ProfileController {
    static async getOwnProfile(req, res, next){
        try {
            const profile = await Profile.findOne({
                where: {UserId: req.userLoginData.id}
            })

            res.status(200).json({
                profile
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async updateOwnProfile(req, res, next){
        try {
            const {username, bio} = req.body

            await Profile.update(
                {username, bio},
                {where: {UserId: req.userLoginData.id}}
            )

            const profile = await Profile.findOne({
                where: {UserId: req.userLoginData.id}
            })

            res.status(200).json({
                profile
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ProfileController