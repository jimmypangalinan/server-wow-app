const { product } = require("../../models");

const cloudinary = require('../utils/cloudinary');

// Add New Product
exports.addProduct = async (req, res) => {

  const productExist = await product.findOne({
    where: {
      title: req.body.title,
    },
  });

  if (productExist) {
    return res.status(200).send({
      Status: "failed",
      message: "Title Allready Exist",
    });
  }

  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wow-app',
      use_filename: true,
      unique_filename: false,
    });

    let newProduct = req.body;
    console.log(newProduct);

    let createProduct = await product.create({
      title: req.body.title,
      publicationDate: req.body.publicationDate,
      pages: req.body.pages,
      author: req.body.author,
      isbn: req.body.isbn,
      about: req.body.about,
      // bookFile: req.files.bookFile[0].filename,
      bookFile: "image.jpg",
      cover: req.file.cover.filename,
    });


    let createProducts = JSON.parse(JSON.stringify(createProduct));

    res.status(201).send({
      status: "Success",
      createProducts,
      path: process.env.FILE_PATH
    });

  } catch (error) {
    res.status(400).send({
      status: "Failed",
      message: 'error catch',
      error
    });
    console.log(error);
  }
};

// get products
exports.getProducts = async (req, res) => {
  try {
    const products = await product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.send({
      status: "Success",
      data: {
        books: products,
        path: process.env.FILE_PATH
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// get product by id
exports.getProduct = async (req, res) => {
  try {
    let data = await product.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.send({
      status: "Success",
      book: {
        data,
        path: process.env.FILE_PATH
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// updtae product by id
exports.updateProduct = async (req, res) => {

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'wow-app',
    use_filename: true,
    unique_filename: false,
  });

  try {
    const newData = req.body;
    const updateProduct = await product.update(newData, {
      where: {
        id: req.params.id,
      },
    });

    const productDetails = await product.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "cover"],
      },
    });

    res.send({
      status: "Success",
      data: {
        book: productDetails,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// delete product by id
exports.deleteProduct = async (req, res) => {
  try {
    const productDelete = await product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(201).send({
      status: "Succes",
      message: "Delete Product Success",
      id: req.params.id,
    });
  } catch (error) {
    console.log(error);
  }
};
