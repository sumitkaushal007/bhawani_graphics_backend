'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First check if indexes exist before creating them
    const indexes = await queryInterface.showIndex('products');
    const indexNames = indexes.map(index => index.name);

    // Add FULLTEXT indexes for products table only if they don't exist
    if (!indexNames.includes('ft_products_name')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE products ADD FULLTEXT INDEX ft_products_name (name)
      `);
    }

    if (!indexNames.includes('ft_products_brand')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE products ADD FULLTEXT INDEX ft_products_brand (brand)
      `);
    }

    if (!indexNames.includes('ft_products_material')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE products ADD FULLTEXT INDEX ft_products_material (material)
      `);
    }

    if (!indexNames.includes('ft_products_description')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE products ADD FULLTEXT INDEX ft_products_description (description)
      `);
    }

    if (!indexNames.includes('ft_products_combined')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE products ADD FULLTEXT INDEX ft_products_combined (name, brand, material, description)
      `);
    }

    // Check client table indexes
    const clientIndexes = await queryInterface.showIndex('clients');
    const clientIndexNames = clientIndexes.map(index => index.name);

    if (!clientIndexNames.includes('ft_clients_name')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE clients ADD FULLTEXT INDEX ft_clients_name (name) 
      `);
    }

    if (!clientIndexNames.includes('idx_clients_mobile')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE clients ADD INDEX idx_clients_mobile (mobile_number)
      `);
    }

    if (!clientIndexNames.includes('idx_clients_gst')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE clients ADD INDEX idx_clients_gst (gst_number)
      `);
    }

    // Check client_addresses indexes
    const addressIndexes = await queryInterface.showIndex('client_addresses');
    const addressIndexNames = addressIndexes.map(index => index.name);

    if (!addressIndexNames.includes('ft_client_addresses_full')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE client_addresses ADD FULLTEXT INDEX ft_client_addresses_full (full_address)
      `);
    }

    if (!addressIndexNames.includes('idx_client_addresses_client_id')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE client_addresses ADD INDEX idx_client_addresses_client_id (client_id)
      `);
    }

    // Check client_contact_persons indexes
    const contactIndexes = await queryInterface.showIndex('client_contact_persons');
    const contactIndexNames = contactIndexes.map(index => index.name);

    if (!contactIndexNames.includes('ft_contact_persons_name')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE client_contact_persons ADD FULLTEXT INDEX ft_contact_persons_name (name)
      `);
    }

    if (!contactIndexNames.includes('idx_contact_persons_mobile')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE client_contact_persons ADD INDEX idx_contact_persons_mobile (mobile)
      `);
    }

    if (!contactIndexNames.includes('idx_contact_persons_client_id')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE client_contact_persons ADD INDEX idx_contact_persons_client_id (client_id)
      `);
    }

    if (!clientIndexNames.includes('ft_clients_combined')) {
      await queryInterface.sequelize.query(`
        ALTER TABLE clients ADD FULLTEXT INDEX ft_clients_combined (name, description)
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    // Keep the existing down migration as is
    // (it already checks for existence with IF EXISTS)
    await queryInterface.sequelize.query(`
      ALTER TABLE products DROP INDEX IF EXISTS ft_products_name
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE products DROP INDEX IF EXISTS ft_products_brand
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE products DROP INDEX IF EXISTS ft_products_material
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE products DROP INDEX IF EXISTS ft_products_description
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE products DROP INDEX IF EXISTS ft_products_combined
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS ft_clients_name
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS ft_clients_combined
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS idx_clients_mobile
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS idx_clients_gst
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses DROP INDEX IF EXISTS ft_client_addresses_full
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses DROP INDEX IF EXISTS idx_client_addresses_client_id
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons DROP INDEX IF EXISTS ft_contact_persons_name
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons DROP INDEX IF EXISTS idx_contact_persons_mobile
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons DROP INDEX IF EXISTS idx_contact_persons_client_id
    `);
  }
};