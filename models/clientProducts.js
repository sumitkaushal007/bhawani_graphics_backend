'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ClientProduct extends Model {
        static associate(models) {
            // Define association with Client
            this.belongsTo(models.Client, {
                foreignKey: 'client_id',
                as: 'client'
            });
        }
    }

    ClientProduct.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'clients',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        product_type: {
            type: DataTypes.ENUM('punch', 'window', 'butterfly', 'other'),
            allowNull: false
        },
        product_specification: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                notEmptyIfOther(value) {
                    if (this.product_type === 'other' && !value) {
                        throw new Error('Product specification is required when product type is "other"');
                    }
                }
            }
        },
        size: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
                isCorrectTotal(value) {
                    if (this.quantity && this.price &&
                        Math.abs(value - (this.quantity * this.price)) > 0.01) {
                        throw new Error('Total price should equal quantity × price');
                    }
                }
            }
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
        modelName: 'ClientProduct',
        tableName: 'client_products',
        timestamps: false,
        underscored: true
    });

    return ClientProduct;
};
