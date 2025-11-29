const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const cors = require("cors");

// === KHU VỰC CẦN SỬA: ĐỊNH NGHĨA CÁC URL ĐƯỢC PHÉP TRUY CẬP (CORS) ===
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://fe-three-tau.vercel.app" // <<< THÊM URL FRONTEND ĐÃ DEPLOY VÀO ĐÂY
];
// =====================================================================

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS, // Đã sử dụng mảng URL mới
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Import database (Đảm bảo đã import để kết nối)
const db = require("./src/config/db");
db.connect();

// Import routes
const authRoutes = require("./src/routes/authRoute");
const productRoutes = require("./src/routes/productRoute");
const cartRoutes = require("./src/routes/cartRoute");
const userRoutes = require("./src/routes/userRoute");
const categoryRoutes = require("./src/routes/categoryRoute");
const commentRoutes = require("./src/routes/commentRoute");
const diseaseRoutes = require("./src/routes/diseaseRoute");
const chatRoutes = require("./src/routes/chatRoute");
const dashboardRoutes = require("./src/routes/dashboardRoute");
const uploadRoutes = require("./src/routes/uploadRoute");
const orderRoutes = require("./src/routes/orderRoute");
const paymentRoutes = require("./src/routes/paymentRoute");

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS, // Đã sử dụng mảng URL mới
  credentials: true
}));

// Tăng giới hạn body size để hỗ trợ upload avatar (base64)
// 10MB cho JSON body (đủ cho ảnh base64)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Make io accessible to routes
app.set('io', io);

// Serve static images (so backend can serve product images if needed)
// Place your images under Back_end/public/images/products/
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
// Đánh giá sản phẩm
app.use("/api/comments", commentRoutes);
// Tra cứu bệnh
app.use("/api/diseases", diseaseRoutes);
// chat
app.use("/api/chat", chatRoutes);
// Dashboard admin
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes); // 📸 Cloudinary upload routes
// Payment routes
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);


// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pharmacy API",
      version: "1.0.0",
      description: "API cho website hiệu thuốc trực tuyến",
    },
    // Thay đổi localhost thành URL Public của Render
    servers: [{ url: `https://be-1-kh9g.onrender.com` }], 
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

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📑 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`💬 Socket.IO Chat đã sẵn sàng`);
});