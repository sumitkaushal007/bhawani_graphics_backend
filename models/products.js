'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Products extends Model {
        static associate(models) {
            // define association here
            // this.belongsToMany(models.Files, {
            //     through: "PropertyImages",
            //     foreignKey: "property_id",
            //     as: "images"
            // });
        }
    }
    Products.init({
        product_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        size: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        size_unit: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        brand: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        material: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        standard_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
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
    }, {
        sequelize,
        modelName: 'Products',
        tableName: "products",
        timestamps: false
    });
    return Products;
};