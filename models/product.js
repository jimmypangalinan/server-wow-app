"use strict";
const { Model } = require("sequelize");
const mylist = require("./mylist");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.hasOne(models.myList, {
        as: "myList",
        foreignKey: {
          name: "idBook",
        },
      });
    }
  }
  product.init(
    {
      title: DataTypes.STRING,
      publicationDate: DataTypes.STRING,
      pages: DataTypes.INTEGER,
      author: DataTypes.STRING,
      isbn: DataTypes.INTEGER,
      about: DataTypes.TEXT,
      bookFile: DataTypes.STRING,
      cover: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
