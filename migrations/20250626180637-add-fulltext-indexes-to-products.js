'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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

    // Clean up old indexes if they exist
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS clients_name_ft_idx
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS clients_mobile_number_idx
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE clients DROP INDEX IF EXISTS clients_gst_number_idx
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses DROP INDEX IF EXISTS client_addresses_full_address_ft_idx
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons DROP INDEX IF EXISTS client_contact_persons_name_ft_idx
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE client_contact_persons DROP INDEX IF EXISTS client_contact_persons_mobile_idx
    `);
  }
};