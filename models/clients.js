'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        static associate(models) {
            this.hasOne(models.ClientAddress, {
                foreignKey: 'client_id',
                as: 'address'
            });
            this.hasMany(models.ClientContactPerson, {
                foreignKey: 'client_id',
                as: 'contactPersons'
            });
        }
    }

    Client.init({
        client_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mobile_number: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        gst_number: {
            type: DataTypes.STRING(20),
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
        }
    }, {
        sequelize,
        modelName: 'Client',
        tableName: 'clients',
        timestamps: false
    });

    return Client;
};
