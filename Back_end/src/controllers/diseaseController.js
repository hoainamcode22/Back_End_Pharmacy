/*
 * File: Back_End/src/controllers/diseaseController.js
 * (ĐÃ SỬA LỖI SQL)
 */
const db = require('../../db_config');

/**
 * @swagger
 * /api/diseases:
 *   get:
 *     summary: Tìm kiếm bệnh
 *     tags: [Diseases]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên bệnh, triệu chứng, tổng quan)
 *     responses:
 *       200:
 *         description: Danh sách bệnh
 */
const searchDiseases = async (req, res) => {
  try {
    const { q } = req.query;
    
    let query;
    let params = [];
    
    if (q && q.trim()) {
      // Tìm kiếm theo từ khóa
      
      // SỬA LỖI: Chuyển searchTerm sang chữ thường ngay tại đây
      const searchTerm = `%${q.trim().toLowerCase()}%`; 
      
      query = `
        SELECT "Id", "Name", "Slug", "Overview", "Symptoms", "Category", "ImageUrl", "CreatedAt"
        FROM public."Diseases"
        WHERE 
          LOWER("Name") LIKE $1 OR
          LOWER("Symptoms") LIKE $1 OR
          LOWER("Overview") LIKE $1
        ORDER BY "CreatedAt" DESC
        LIMIT 50
      `;
      // SỬA LỖI: Chỉ dùng $1
      params = [searchTerm];

    } else {
      // Không có từ khóa, trả về 40 bệnh mới nhất
      query = `
        SELECT "Id", "Name", "Slug", "Overview", "Symptoms", "Category", "ImageUrl", "CreatedAt"
        FROM public."Diseases"
        ORDER BY "CreatedAt" DESC
        LIMIT 40
      `;
    }
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      total: result.rows.length,
      diseases: result.rows
    });
    
  } catch (error) {
    console.error('❌ Lỗi searchDiseases:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi tìm kiếm bệnh!' 
    });
  }
};

/**
 * @swagger
 * /api/diseases/slug/{slug}:
 *   get:
 *     summary: Lấy chi tiết bệnh theo slug
 *     tags: [Diseases]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của bệnh
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bệnh
 *       404:
 *         description: Không tìm thấy bệnh
 */
const getDiseaseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ 
        success: false,
        error: 'Thiếu slug của bệnh!' 
      });
    }
    
    const query = `
      SELECT 
        "Id", "Name", "Slug", "Overview", "Symptoms", 
        "Causes", "Treatment", "Prevention", "Category", 
        "ImageUrl", "CreatedAt", "UpdatedAt"
      FROM public."Diseases"
      WHERE "Slug" = $1
    `;
    
    const result = await db.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Không tìm thấy thông tin bệnh!' 
      });
    }
    
    res.json({
      success: true,
      disease: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Lỗi getDiseaseBySlug:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi lấy thông tin bệnh!' 
    });
  }
};

module.exports = {
  searchDiseases,
  getDiseaseBySlug,
  updateDiseaseImage
};

/**
 * @swagger
 * /api/diseases/{id}/image:
 *   patch:
 *     summary: Cập nhật ảnh bệnh (admin only)
 *     tags: [Diseases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
const updateDiseaseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    if (!id || !imageUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'Thiếu ID bệnh hoặc URL ảnh!' 
      });
    }
    
    const query = `
      UPDATE public."Diseases"
      SET "ImageUrl" = $1, "UpdatedAt" = NOW()
      WHERE "Id" = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [imageUrl, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Không tìm thấy bệnh!' 
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật ảnh thành công!',
      disease: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Lỗi updateDiseaseImage:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi cập nhật ảnh!' 
    });
  }
};