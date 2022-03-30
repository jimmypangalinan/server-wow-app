const { user, profile } = require("../../models");

// get users
exports.getUsers = async (req, res) => {
  try {
    const dataUser = await user.findAll({
      attributes: {
        exclude: ["password", "role", "status", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Succes",
      message: "Get Data User Succces",
      user: dataUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// get user
exports.getUser = async (req, res) => {
  try {
    const userExist = await user.findOne({
      where: {
        id: req.user.id,
      },

      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      res.send({
        status: "Data No Exist",
      });
    } else {
      dataUser = JSON.parse(JSON.stringify(userExist));
      res.status(200).send({
        status: "Succes",
        dataUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
    });
  }
};

// update user by id
exports.updateUser = async (req, res) => {
  try {
    const newUpdate = req.body;
    const updateUser = await user.update(newUpdate, {
      where: {
        id: req.params.id,
      },
    });

    if (!dataUser) {
      res.send({
        status: "Data not found",
      });
    } else {
      res.send({
        status: "Success",
        message: "Update Data Success",
        details: updateUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// delete user by id
exports.deleteUser = async (req, res) => {
  try {
    const dataUser = await user.destroy({
      where: {
        id: req.params.id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["idUser", "createdAt", "updatedAt"],
        },
      },
    });

    if (!dataUser) {
      res.send({
        status: "Data not found",
      });
    } else {
      res.send({
        status: "Success",
        data: {
          id: req.params.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
