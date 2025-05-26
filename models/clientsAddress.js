    'use strict';
    const { Model } = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
        class ClientAddress extends Model {
            static associate(models) {
                this.belongsTo(models.Client, {
                    foreignKey: 'client_id',
                    as: 'client'
                });
            }
        }

        ClientAddress.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            full_address: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            country: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            zip_code: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            state: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            client_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'clients',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }
        }, {
            sequelize,
            modelName: 'ClientAddress',
            tableName: 'client_addresses',
            timestamps: false,
            underscored: true // keeps snake_case naming
        });

        return ClientAddress;
    };
