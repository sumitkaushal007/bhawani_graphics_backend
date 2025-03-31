"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("size_units", [
      { name: "Mili Meter", code: "mm", alias: "mm", created_at: new Date(), updated_at: new Date() },
      { name: "Centi Meter", code: "cm", alias: "cm", created_at: new Date(), updated_at: new Date() },
      { name: "Deci Meter", code: "dm", alias: "dm", created_at: new Date(), updated_at: new Date() },
      { name: "Inches", code: "in", alias: "inch", created_at: new Date(), updated_at: new Date() },
      { name: "Feet", code: "ft", alias: "feet", created_at: new Date(), updated_at: new Date() },
      { name: "Meter", code: "m", alias: "meter", created_at: new Date(), updated_at: new Date() },

      { name: "Square Mili Meter", code: "sq. mm", alias: "sq. mm", created_at: new Date(), updated_at: new Date() },
      { name: "Square Centi Meter", code: "sq. cm", alias: "sq. cm", created_at: new Date(), updated_at: new Date() },
      { name: "Square Deci Meter", code: "sq. dm", alias: "sq. dm", created_at: new Date(), updated_at: new Date() },
      { name: "Square Inches", code: "sq. in", alias: "sq. in", created_at: new Date(), updated_at: new Date() },
      { name: "Square Feet", code: "sq. ft", alias: "sq. ft", created_at: new Date(), updated_at: new Date() },
      { name: "Square Meter", code: "sq. m", alias: "sq. m", created_at: new Date(), updated_at: new Date() },
      
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("size_units", null, {});
  },
};
