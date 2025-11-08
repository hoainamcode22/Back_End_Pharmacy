const express = require("express");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images (so backend can serve product images if needed)
// Place your images under Back_end/public/images/products/
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Routes
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const diseaseRoutes = require("./src/routes/diseaseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/diseases", diseaseRoutes);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pharmacy API",
      version: "1.0.0",
      description: "API cho website hiệu thuốc trực tuyến",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [
    path.join(__dirname, "./src/routes/*.js"),
    path.join(__dirname, "./src/controllers/*.js")
  ],
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Default route
app.get("/", (req, res) => res.send("Pharmacy backend is running..."));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📑 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
