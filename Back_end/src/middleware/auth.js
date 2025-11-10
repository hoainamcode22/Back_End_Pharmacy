const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    // Normalize: token có thể là { id, role } (lowercase) -> chuyển thành { Id, Role } để controllers dùng
    req.user = {
      Id: decoded.id || decoded.Id,
      Role: decoded.role || decoded.Role
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// --- BỔ SUNG MIDDLEWARE KIỂM TRA ADMIN ---
const isAdmin = (req, res, next) => {
  // Middleware này phải chạy SAU authenticateToken
  if (req.user && req.user.Role === 'admin') {
    // Nếu đúng là admin, cho đi tiếp
    next();
  } else {
    // Nếu không phải admin (hoặc req.user không tồn tại)
    console.log('ADMIN CHECK FAILED: User is not admin', req.user);
    return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập!' });
  }
};
// --- HẾT PHẦN BỔ SUNG ---

module.exports = {
  authenticateToken,
  isAdmin // <-- Bổ sung export
};