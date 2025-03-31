const db = require("./models");

async function checkAssociations() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Associations are set up correctly!");
  } catch (error) {
    console.error("Error setting up associations:", error);
  }
}

checkAssociations();
