"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class myList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      myList.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      myList.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "idBook",
        },
      });
    }
  }
  myList.init(
    {
      idBook: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "myList",
    }
  );
  return myList;
};
