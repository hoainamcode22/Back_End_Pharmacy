const db = require('../../db_config');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục (thuoc, vitamin, cham-soc, thiet-bi)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sản phẩm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Build query động
    let whereConditions = ['"IsActive" = true'];
    let queryParams = [];
    let paramIndex = 1;

    // Filter theo category
    if (category) {
      whereConditions.push(`LOWER("Category") = LOWER($${paramIndex})`);
      queryParams.push(category);
      paramIndex++;
    }

    // Search theo tên
    if (search) {
      whereConditions.push(`LOWER("Name") LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Count tổng số sản phẩm
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM "Products" 
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].total);

    // Query danh sách sản phẩm với pagination
    queryParams.push(limit, offset);
    const productsQuery = `
      SELECT 
        "Id", "Name", "Slug", "ShortDesc", 
        "Category", "Brand", "Image", "Price", 
        "Stock", "IsActive", "CreatedAt"
      FROM "Products"
      ${whereClause}
      ORDER BY "CreatedAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await db.query(productsQuery, queryParams);

    // Map image field to a public URL (Image may be stored as filename in DB)
    // Normalize DB columns to JS-friendly/camelCase properties and build absolute image URL
    const mappedRows = result.rows.map(r => {
      const image = r.Image || null;

      // build base url from request (so frontend can use absolute URL and avoid same-origin issues)
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      let imageUrl = `${baseUrl}/images/default.jpg`;
      if (image) {
        if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
          imageUrl = image;
        } else if (typeof image === 'string' && image.startsWith('/')) {
          // relative path on backend; prefix with baseUrl
          imageUrl = `${baseUrl}${image}`;
        } else {
          // assume it's a filename stored in DB
          imageUrl = `${baseUrl}/images/${image}`;
        }
      }

      return {
        // camelCase (preferred)
        id: r.Id,
        name: r.Name,
        slug: r.Slug,
        shortDesc: r.ShortDesc,
        category: r.Category,
        brand: r.Brand,
        image: r.Image || null, // raw DB value (filename or url)
        imageUrl: imageUrl, // absolute URL clients should use
        price: r.Price,
        stock: r.Stock,
        isActive: r.IsActive,
        createdAt: r.CreatedAt,

        // legacy/compat keys (keep for existing frontend code)
        Id: r.Id,
        Name: r.Name,
        Slug: r.Slug,
        ShortDesc: r.ShortDesc,
        Image: r.Image,
        ImageUrl: imageUrl,
        Price: r.Price
      };
    });

    res.json({
      products: mappedRows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems: totalItems,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Lỗi getProducts:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách sản phẩm!' });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        "Id", "Name", "Slug", "ShortDesc", "Description",
        "Category", "Brand", "Image", "Price", "Stock",
        "IsActive", "CreatedAt", "UpdatedAt"
      FROM "Products"
      WHERE "Id" = $1 AND "IsActive" = true
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
    }

    const r = result.rows[0];

    // build base url from request
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const image = r.Image || null;
    let imageUrl = `${baseUrl}/images/default.jpg`;
    if (image) {
      if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
        imageUrl = image;
      } else if (typeof image === 'string' && image.startsWith('/')) {
        // relative path on backend; prefix with baseUrl
        imageUrl = `${baseUrl}${image}`;
      } else {
        imageUrl = `${baseUrl}/images/${image}`;
      }
    }

    const product = {
      id: r.Id,
      name: r.Name,
      slug: r.Slug,
      shortDesc: r.ShortDesc,
      description: r.Description,
      category: r.Category,
      brand: r.Brand,
      image: r.Image || null,
      imageUrl: imageUrl,
      price: r.Price,
      stock: r.Stock,
      isActive: r.IsActive,
      createdAt: r.CreatedAt,
      updatedAt: r.UpdatedAt
    };

    // also include legacy keys for backward compatibility
    product.Id = r.Id;
    product.Name = r.Name;
    product.Slug = r.Slug;
    product.ShortDesc = r.ShortDesc;
    product.Image = r.Image;
    product.ImageUrl = imageUrl;
    product.Price = r.Price;

    res.json(product);

  } catch (error) {
    console.error('Lỗi getProductById:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết sản phẩm!' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
