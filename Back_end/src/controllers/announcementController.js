// Mock announcements - có thể kết nối database sau
const announcements = [
  {
    id: 1,
    title: "Chào mừng đến hiệu thuốc trực tuyến",
    date: new Date().toISOString(),
    url: null
  },
  {
    id: 2,
    title: "Khuyến mại đặc biệt tuần này: Giảm 20% cho Vitamin C",
    date: new Date(Date.now() - 86400000).toISOString(),
    url: null
  }
];

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 */
const getAnnouncements = (req, res) => {
  try {
    res.json(announcements);
  } catch (error) {
    console.error('Lỗi getAnnouncements:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy thông báo!' });
  }
};

module.exports = {
  getAnnouncements
};
