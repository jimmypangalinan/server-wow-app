const { user, profile, transaction } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// add new user
exports.register = async (req, res) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Bad Request",
      message: error.details[0].message,
    });
  }

  const userExist = await user.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (userExist) {
    return res.status(200).send({
      Status: "failed",
      message: "Email Allready Exist",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newData = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashPassword,
      role: "user",
      status: "Not subscribe",
    });

    await profile.create({
      gender: "",
      address: "",
      phone: "",
      image: "",
      idUser: newData.id,
    });

    const dataToken = {
      id: newData.id,
    };

    const SECRECT_KEY = process.env.TOKEN_KEY;

    const token = jwt.sign(dataToken, SECRECT_KEY);

    res.status(201).send({
      status: "Success",
      data: {
        email: newData.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      status: "Bad Request",
    });
  }
};

// get user login
exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: "Bad Request",
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    console.log(isValid);
    if (!isValid) {
      return res.status(200).send({
        status: "Email or Password Wrong",
      });
    }

    const dataToken = {
      id: userExist.id,
    };

    const SECRECT_KEY = process.env.TOKEN_KEY;
    const token = jwt.sign(dataToken, SECRECT_KEY);

    res.status(200).send({
      status: "Success",
      data: {
        email: userExist.email,
        role: userExist.role,
        token,
        userExist,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
      message: "User not Found !!!!",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.send({
      status: "Success",
      data: {
        // dataUser,
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          role: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
