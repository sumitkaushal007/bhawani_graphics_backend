"use strict";
const bcrypt = require("bcryptjs");
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("process.env:: ", JSON.stringify(process.env));
    
    // Default Admin user credentials
    const adminEmail = process.env.ADMIN_EMAIL || "admin@bg";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminBG@123#";

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert Admin User
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        provider: "local",
        roleId: 1
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: process.env.ADMIN_EMAIL || "admin@bg" });
  },
};
