const { profile, user } = require("../../models");

const cloudinary = require('../utils/cloudinary');

//  get data profile user by userId
exports.getProfile = async (req, res) => {
  try {
    const dataProfile = await profile.findOne({
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!dataProfile) {
      res.send({
        status: "Profile Masih Kosong nih",
      });

    } else {

      dataProfiles = JSON.parse(JSON.stringify(dataProfile));
      res.status(200).send({
        status: "Success",
        dataProfiles,
        path: process.env.FILE_PATH
      });

    }

  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
    });
  }
};

// updtae profile by id
exports.updateProfile = async (req, res) => {
  try {
    const newData = req.body;

    console.log(req.file.filename);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wow-app',
      use_filename: true,
      unique_filename: false,
    });

    const updateProfile = await profile.update({
      ...newData,
      image: req.file.filename,
    }, {
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }
    );

    const profileDetails = await profile.findOne({
      where: {
        idUser: req.user.id,
      },

      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!profileDetails) {
      res.send({
        status: "Profile Masih Kosong nih",
      });

    } else {

      dataProfiles = JSON.parse(JSON.stringify(profileDetails));

      res.status(200).send({
        status: "Success",
        message: "Success Update Profile",
        dataProfiles,
        path: process.env.FILE_PATH
      });

    }
  } catch (error) {

    console.log(error);

  }
};
