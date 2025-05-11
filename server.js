let envFilePath = (process.env.NODE_ENV) ? `.env.${process.env.NODE_ENV}` : '.env.development';
require('dotenv').config({ path: envFilePath });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products.js");
const sizeUnitsRoutes = require('./routes/sizeUnits.js');
const fileRoutes = require("./routes/fileRoutes");
const unprotected = require("./routes/unprotected.js");
const clientRoutes = require("./routes/clients.js"); // ✅ Add client route
// const clientAddress = require('./routes/clientAddress');
// const clientContactPersonRoutes = require('./routes/clientContactPersonRoutes');

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());

// ✅ Mount all APIs
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sizeUnits", sizeUnitsRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", unprotected);
app.use("/api/clients", clientRoutes); // ✅ Client route added
// app.use('/api/client-addresses', clientAddress);
// app.use('/api/client-contact-persons', clientContactPersonRoutes);

// ✅ Default health check route
app.all('/', (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "api service is working"
    });
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log("✅ Database synced");
    console.log(`✅ Running on ${envFilePath}`);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
