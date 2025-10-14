const jwt = require('jsonwebtoken');
const db = require('../../db_config');

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const result = await db.query('SELECT "Role" FROM public."Users" WHERE "Id" = $1', [req.user.id]);
        if (result.rows[0] && result.rows[0].Role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Yêu cầu quyền admin' });
        }
    } catch (error) {
         res.status(500).json({ message: 'Lỗi xác thực' });
    }
};

module.exports = { protect, isAdmin };