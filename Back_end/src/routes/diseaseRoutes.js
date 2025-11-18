const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

/**
 * @swagger
 * tags:
 *   name: Diseases
 *   description: API tra cứu bách khoa toàn thư bệnh
 */

/**
 * @swagger
 * /api/diseases:
 *   get:
 *     summary: Tìm kiếm bệnh theo từ khóa
 *     tags: [Diseases]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách bệnh tìm được
 */
router.get('/', diseaseController.searchDiseases);

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
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bệnh
 *       404:
 *         description: Không tìm thấy
 */
router.get('/slug/:slug', diseaseController.getDiseaseBySlug);

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
router.patch('/:id/image', diseaseController.updateDiseaseImage);

module.exports = router;
