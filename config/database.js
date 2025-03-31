const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "mysql",
    logging: false,
    define: {
        underscored: true
    }
});

sequelize.authenticate()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
