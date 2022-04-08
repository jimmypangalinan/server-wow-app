const { product } = require("../../models");

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
    
    let newProduct = req.body;

    let createProduct = await product.create({
      ...newProduct,
      bookFile: req.files.bookFile[0].filename,
      cover: req.files.cover[0].filename,
    });

    let createProducts = JSON.parse(JSON.stringify(createProduct));
    console.log(createProduct);

    res.status(201).send({
      status: "Success",
      createProducts,
      // cover: "https://server-window-of-world.herokuapp.com/uploads/cover/" + createProducts.cover,
      // cover: "https://wow-app-server-v1.herokuapp.com/uploads/cover/" + createProducts.cover,
    });

  } catch (error) {
    res.status(400).send({
      status: "Failed",
      message: 'error catch',
      error
    });
  }
};

// get products
exports.getProducts = async (req, res) => {
  try {
    const products = await product.findAll({
      order: [["createdAt", "DESC"]],
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"],
      // },
    });
    res.send({
      status: "Success",
      data: {
        books: products,
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
        // cover: "https://wow-app-server-v1.herokuapp.com/uploads/cover/" + createProducts.cover,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// updtae product by id
exports.updateProduct = async (req, res) => {
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
