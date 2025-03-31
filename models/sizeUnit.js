'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SizeUnits extends Model {
        static associate(models) { }
    }
    SizeUnits.init({
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING(50),
            allowNull: false
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
        modelName: 'SizeUnits',
        tableName: "size_units",
        timestamps: false
    });
    return SizeUnits;
};