'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First check which indexes already exist
    const productIndexes = await queryInterface.showIndex('products');
    const existingProductIndexNames = productIndexes.map(idx => idx.name);
    
    const clientIndexes = await queryInterface.showIndex('clients');
    const existingClientIndexNames = clientIndexes.map(idx => idx.name);

    // Only create indexes that don't exist
    if (!existingProductIndexNames.includes('products_name')) {
      await queryInterface.addIndex('products', ['name'], {
        name: 'products_name'
      });
    }

    if (!existingClientIndexNames.includes('clients_name')) {
      await queryInterface.addIndex('clients', ['name'], {
        name: 'clients_name'
      });
    }
    },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', 'products_name');
    await queryInterface.removeIndex('clients', 'clients_name');
  }
};