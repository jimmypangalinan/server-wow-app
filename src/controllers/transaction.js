const { transaction, user } = require("../../models");

const cloudinary = require('../utils/cloudinary');

// add new transaction
exports.addTransaction = async (req, res) => {

  const detailTrans = await transaction.findOne({
    where: {
      idUser: req.user.id,
    },
  });

  if (detailTrans) {
    return res.status(201).send({
      Status: "failed",
      message: "you still have an unfinished transaction, please wait !!",
    });
  }
  console.log(req.user.id);
  console.log(req.body.accountNumber);

  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wow-app',
      use_filename: true,
      unique_filename: false,
    });

    console.log(req.body);
    const createTransaction = await transaction.create({
      idUser: req.user.id,
      transferProof: req.file.filename,
      accountNumber: req.body.accountNumber,
      remainingActive: 0,
      startDate: "2022-03-10",
      endDate: "2022-04-10",
      userStatus: "Not Active",
      paymentStatus: "Pending",
    });

    res.send({
      status: "Success",
      data: {
        transaction: {
          createTransaction,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
      message: "Catch Errorr . . . . ",
      error
    });
  }
};

// get transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactionExist = await transaction.findAll({
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: [
            "role",
            "email",
            "status",
            "password",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    if (!transactionExist) {
      res.send({
        status: "Transaction No Exist",
      });
    } else {
      res.status(200).send({
        status: "Success",

        data: {
          transactionExist,

        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
    });
  }
};

// get transaction by id
exports.getTransaction = async (req, res) => {
  try {
    const transactionExist = await transaction.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: [
            "role",
            "email",
            "status",
            "password",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    if (!transactionExist) {
      res.send({
        status: "Transaction No Exist",
      });
    } else {
      res.status(200).send({
        status: "Success",
        data: {
          transaction: transactionExist,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
    });
  }
};

// update transaction by id
exports.updateTransaction = async (req, res) => {
  // for get month in number
  var months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  // get start date
  var date = new Date();
  let Tanggal = new Date().getDate();
  var month = date.getMonth();
  let Tahun = new Date().getFullYear();
  var setStartDate = Tahun + "-" + months[month] + "-" + Tanggal;

  // get due date
  var month2 = new Date().getMonth() + 1;
  let Tanggal2 = new Date().getDate();
  let Tahun2 = new Date().getFullYear();
  var setDueDate = Tahun2 + "-" + months[month2] + "-" + Tanggal2;

  // make it one in variabel
  const date22 = new Date(setStartDate);
  const date23 = new Date(setDueDate);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date23.getTime() - date22.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  try {
    const newUpdate = req.body;
    if (req.body.paymentStatus == "Approved") {
      await transaction.update(
        {
          ...newUpdate,
          startDate: setStartDate,
          endDate: setDueDate,
          remainingActive: diffInDays - 1,
        },
        {
          where: {
            id: req.params.id,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }
      );
    } else {
      await transaction.update(
        {
          ...newUpdate,
          startDate: new Date(),
          endDate: new Date(),
          remainingActive: 0,
        },
        {
          where: {
            id: req.params.id,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }
      );
    }


    // update status user if transaction approve and cancel
    const dataUpdate = await transaction.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (dataUpdate.paymentStatus == "Approved") {
      await user.update(
        {
          status: "Subscribe",
        },
        {
          where: {
            id: dataUpdate.idUser,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }
      );
    } else {
      await user.update(
        {
          status: "Not subscribe",
        },
        {
          where: {
            id: dataUpdate.idUser,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }
      );
    }
    res.status(200).send({
      status: "Success",
      data: {
        dataUpdate,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
    });
  }
};

// Delete transaction by id
exports.deleteTransaction = async (req, res) => {
  try {
    const deleteTransaction = await transaction.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteTransaction) {
      res.send({
        status: "Transaction not found",
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
    res.status(400).send({
      status: "Bad Request",
    });
  }
};
