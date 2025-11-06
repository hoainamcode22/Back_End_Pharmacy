const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NULL');

  if (!token) {
    console.log('ERROR: No token provided');
    return res.status(401).json({ error: 'Chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    console.log('Token decoded:', decoded);
    
    // Normalize: token có thể là { id, role } (lowercase) -> chuyển thành { Id, Role } để controllers dùng
    req.user = {
      Id: decoded.id || decoded.Id,
      Role: decoded.role || decoded.Role
    };
    
    console.log('req.user set to:', req.user);
    console.log('=== AUTH SUCCESS ===');
    next();
  } catch (error) {
    console.log('=== AUTH ERROR ===');
    console.log('Token verify error:', error.message);
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

module.exports = {
  authenticateToken
};
