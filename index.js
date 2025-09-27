// index.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// Routes
const authRoutes = require("./Back_end/routes/authRoutes");
app.use("/api/auth", authRoutes);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Pharmacy API", version: "1.0.0", description: "API cho website hiệu thuốc trực tuyến" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "./Back_end/routes/*.js")],
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Default route
app.get("/", (req, res) => res.send("Pharmacy backend is running..."));

// Start server
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}\n📑 Swagger Docs: http://localhost:${PORT}/api-docs`));
