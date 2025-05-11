'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ClientContactPerson extends Model {
        static associate(models) {
            this.belongsTo(models.Client, {
                foreignKey: 'client_id',
                as: 'client'
            });
        }
    }

    ClientContactPerson.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        designation: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        client_id: {
            type: DataTypes.INTEGER,
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
        }
    }, {
        sequelize,
        modelName: 'ClientContactPerson',
        tableName: 'client_contact_persons',
        timestamps: false
    });

    return ClientContactPerson;
};
