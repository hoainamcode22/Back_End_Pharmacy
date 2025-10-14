const db = require("../../db_config");

const dbQuery = async (sql, params) => {
  if (db?.query) return db.query(sql, params);
  if (db?.pool?.query) return db.pool.query(sql, params);
  throw new Error("DB connection not found");
};

const getAllMedicines = async (req, res) => {
  try {
    const result = await dbQuery('SELECT * FROM public."Medicines"');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Server error while fetching medicines" });
  }
};

const createMedicine = async (req, res) => {
    const { medicine_name, medicine_price, quantity, medicine_expire_date } = req.body;

    if (!medicine_name || !medicine_price || !quantity || !medicine_expire_date) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        const sql = `
            INSERT INTO public."Medicines" (medicine_name, medicine_price, quantity, medicine_expire_date, medicine_code)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        // Tạo mã thuốc ngẫu nhiên đơn giản
        const medicine_code = 'MED' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const result = await db.query(sql, [medicine_name, medicine_price, quantity, medicine_expire_date, medicine_code]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Lỗi khi tạo thuốc mới:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};


module.exports = {
  getAllMedicines,
  createMedicine, 
};