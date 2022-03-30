const { myList, product } = require("../../models");

// Create & Delete My List MyList
exports.addMyList = async (req, res) => {
  const { id } = req.params;
  try {
    let data = await myList.findOne({
      where: {
        idUser: req.user.id,
        idBook: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    console.log(req.body.idBook);

    if (data) {
      await myList.destroy({
        where: {
          idUser: req.user.id,
          idBook: id,
        },
      });
      res.send({
        status: "Delete",
        message: "Buku Berhasil di Hapus dari My List",
      });
    } else {
      await myList.create({
        idUser: req.user.id,
        idBook: id,
      });

      res.send({
        status: "Create",
        message: "Berhasil di Tambahkan",
      });
    }

    res.send({
      status: "Success",
      book: {
        ...data,
        cover: process.env.FILE_PATH + data.cover,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Get MyList By Id User
exports.getMyList = async (req, res) => {
  try {
    const myListExist = await myList.findAll({
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: product,
        as: "product",
        attributes: {
          exclude: [
            "publicationDate",
            "pages",
            "isbn",
            "about",
            "bookFile",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!myListExist) {
      res.send({
        status: "MyList No Exist",
      });
    } else {
      myListExis = JSON.parse(JSON.stringify(myListExist));
      res.status(200).send({
        status: "Success",
        myListExis,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
    });
  }
};
