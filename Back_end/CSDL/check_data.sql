-- Kiểm tra dữ liệu
SELECT 'Products' as table_name, COUNT(*) as total FROM public."Products"
UNION ALL
SELECT 'Diseases' as table_name, COUNT(*) as total FROM public."Diseases"
UNION ALL
SELECT 'Announcements' as table_name, COUNT(*) as total FROM public."Announcements";

-- Kiểm tra một số sản phẩm mẫu
SELECT "Id", "Name", "Category", "Price" FROM public."Products" LIMIT 5;

-- Kiểm tra một số bệnh mẫu
SELECT "Id", "Name", "Category" FROM public."Diseases" LIMIT 5;