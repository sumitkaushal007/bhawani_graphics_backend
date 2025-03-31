"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Files extends Model {
    static associate(models) {
      // this.belongsToMany(models.Products, {
      //   through: "PropertyImages",
      //   foreignKey: "file_id",
      //   as: "properties"
      // });
    }
  }

  Files.init(
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
    },
    {
      sequelize,
      modelName: "Files",
      tableName: "files",
      timestamps: false
    }
  );

  return Files;
};
