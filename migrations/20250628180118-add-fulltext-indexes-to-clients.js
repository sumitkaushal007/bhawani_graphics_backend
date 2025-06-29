'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add FULLTEXT indexes for products table (missing from your current setup)
    await queryInterface.sequelize.query(`
      ALTER TABLE products ADD FULLTEXT INDEX ft_products_name (name)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE products ADD FULLTEXT INDEX ft_products_brand (brand)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE products ADD FULLTEXT INDEX ft_products_material (material)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE products ADD FULLTEXT INDEX ft_products_description (description)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE products ADD FULLTEXT INDEX ft_products_combined (name, brand, material, description)
    `);

    // Client-related FULLTEXT indexes (these should already exist from your previous migration)
    // Adding them here for completeness in case they don't exist
    await queryInterface.sequelize.query(`
      ALTER TABLE clients ADD FULLTEXT INDEX ft_clients_name (name) 
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE clients ADD INDEX idx_clients_mobile (mobile_number)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE clients ADD INDEX idx_clients_gst (gst_number)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses ADD FULLTEXT INDEX ft_client_addresses_full (full_address)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses ADD INDEX idx_client_addresses_client_id (client_id)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons ADD FULLTEXT INDEX ft_contact_persons_name (name)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons ADD INDEX idx_contact_persons_mobile (mobile)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons ADD INDEX idx_contact_persons_client_id (client_id)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE clients ADD FULLTEXT INDEX ft_clients_combined (name, description)
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop product indexes
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

    // Drop client indexes
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