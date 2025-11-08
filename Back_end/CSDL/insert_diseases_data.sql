-- =============================================
-- 14. BỔ SUNG THÊM 40 BỆNH MẪU
-- =============================================

INSERT INTO public."Diseases" 
("Name", "Slug", "Overview", "Symptoms", "Causes", "Treatment", "Prevention", "Category") 
VALUES

-- === BỆNH HÔ HẤP (5) ===
(
    'Viêm phế quản', 
    'viem-phe-quan', 
    'Viêm phế quản là tình trạng viêm lớp niêm mạc của các ống phế quản, đường dẫn khí đến phổi.',
    'Ho (thường có đờm)
Khó thở, thở khò khè
Mệt mỏi
Sốt nhẹ và ớn lạnh
Tức ngực',
    'Chủ yếu do virus (cùng loại gây cảm lạnh, cúm).
Hút thuốc lá.
Tiếp xúc với khói bụi, ô nhiễm.',
    'Nghỉ ngơi
Uống nhiều nước
Thuốc long đờm, giảm ho
Kháng sinh (nếu do vi khuẩn)',
    'Tránh hút thuốc lá
Rửa tay thường xuyên
Tiêm phòng cúm hàng năm',
    'Bệnh hô hấp'
),
(
    'Hen suyễn (Hen phế quản)', 
    'hen-suyen', 
    'Hen suyễn là một bệnh mạn tính làm viêm và thu hẹp đường thở, gây khó thở.',
    'Khó thở, thở khò khè
Ho (đặc biệt là ban đêm hoặc sáng sớm)
Nặng ngực',
    'Yếu tố di truyền.
Dị ứng (phấn hoa, lông động vật, bụi nhà)
Nhiễm trùng hô hấp
Không khí lạnh, vận động mạnh',
    'Sử dụng thuốc hít (cắt cơn và dự phòng)
Tránh các yếu tố kích phát cơn hen',
    'Kiểm soát dị ứng
Tránh xa khói thuốc
Theo dõi chức năng hô hấp',
    'Bệnh hô hấp'
),
(
    'Viêm phổi', 
    'viem-phoi', 
    'Viêm phổi là tình trạng nhiễm trùng làm viêm các túi khí (phế nang) ở một hoặc cả hai phổi.',
    'Sốt cao, ớn lạnh, run rẩy
Ho (có đờm màu xanh, vàng hoặc có máu)
Khó thở, thở nhanh, nông
Đau ngực khi ho hoặc hít thở sâu',
    'Vi khuẩn (Streptococcus pneumoniae)
Virus (cúm, COVID-19)
Nấm (hiếm gặp)',
    'Kháng sinh (nếu do vi khuẩn)
Thuốc kháng virus (nếu do virus)
Hạ sốt, giảm đau
Nghỉ ngơi, bù nước',
    'Tiêm phòng phế cầu, cúm
Giữ vệ sinh tốt
Không hút thuốc lá',
    'Bệnh hô hấp'
),
(
    'Bệnh phổi tắc nghẽn mạn tính (COPD)', 
    'copd', 
    'COPD là một bệnh phổi mạn tính gây cản trở luồng khí thở ra khỏi phổi, thường do hút thuốc lá.',
    'Khó thở (tăng dần theo thời gian)
Ho mạn tính (ho của người hút thuốc)
Khạc đờm thường xuyên
Thở khò khè',
    'Hút thuốc lá (nguyên nhân hàng đầu)
Tiếp xúc lâu dài với khói, bụi, hóa chất công nghiệp
Di truyền (hiếm gặp)',
    'Ngừng hút thuốc lá (quan trọng nhất)
Thuốc giãn phế quản (dạng hít)
Liệu pháp oxy',
    'Không bao giờ hút thuốc
Tránh ô nhiễm không khí',
    'Bệnh hô hấp'
),
(
    'Viêm xoang', 
    'viem-xoang', 
    'Viêm xoang là tình trạng viêm hoặc sưng lớp niêm mạc của các xoang cạnh mũi.',
    'Đau, nhức, nặng ở mặt (trán, má, quanh mắt)
Nghẹt mũi, chảy nước mũi (màu vàng hoặc xanh)
Giảm khứu giác
Ho, đau họng',
    'Virus (cảm lạnh)
Dị ứng
Lệch vách ngăn mũi, polyp mũi
Nhiễm khuẩn',
    'Rửa mũi bằng nước muối sinh lý
Thuốc xịt mũi (thông mũi, steroid)
Thuốc giảm đau
Kháng sinh (nếu do vi khuẩn)',
    'Tránh tác nhân gây dị ứng
Điều trị tốt cảm lạnh
Giữ độ ẩm không khí',
    'Bệnh hô hấp'
),

-- === BỆNH TIÊU HÓA (5) ===
(
    'Trào ngược dạ dày thực quản (GERD)', 
    'trao-nguoc-da-day-thuc-quan-gerd', 
    'GERD là tình trạng acid từ dạ dày thường xuyên trào ngược lên thực quản.',
    'Ợ nóng (cảm giác nóng rát ở ngực)
Ợ chua (trớ ra thức ăn hoặc dịch vị chua)
Đau ngực
Khó nuốt
Ho khan mạn tính, viêm họng',
    'Cơ thắt thực quản dưới yếu
Thoát vị hoành
Béo phì
Hút thuốc lá, ăn uống không khoa học',
    'Thay đổi lối sống (giảm cân, tránh ăn khuya)
Thuốc kháng acid
Thuốc ức chế bơm proton (PPI)',
    'Duy trì cân nặng hợp lý
Tránh thức ăn cay nóng, béo, caffeine, rượu bia
Không nằm ngay sau khi ăn',
    'Bệnh tiêu hóa'
),
(
    'Hội chứng ruột kích thích (IBS)', 
    'hoi-chung-ruot-kich-thich-ibs', 
    'IBS là một rối loạn phổ biến ảnh hưởng đến ruột già, gây ra các triệu chứng khó chịu nhưng không làm tổn thương ruột.',
    'Đau quặn bụng (thường giảm sau khi đi tiêu)
Thay đổi thói quen đại tiện (tiêu chảy hoặc táo bón, hoặc cả hai)
Đầy hơi, chướng bụng',
    'Nguyên nhân không rõ ràng.
Co thắt cơ ruột bất thường
Rối loạn tín hiệu thần kinh não-ruột
Stress, lo âu',
    'Thay đổi chế độ ăn (tránh thực phẩm gây kích thích, thử chế độ ăn FODMAP thấp)
Quản lý stress
Thuốc (chống co thắt, chống tiêu chảy, nhuận tràng)',
    'Ghi nhật ký thực phẩm để tìm tác nhân
Tập thể dục đều đặn
Ngủ đủ giấc',
    'Bệnh tiêu hóa'
),
(
    'Bệnh Crohn', 
    'benh-crohn', 
    'Bệnh Crohn là một loại bệnh viêm ruột (IBD) mạn tính, gây viêm loét lớp lót của đường tiêu hóa.',
    'Tiêu chảy kéo dài
Đau bụng và co thắt
Phân có máu
Sụt cân không rõ nguyên nhân
Mệt mỏi, sốt',
    'Nguyên nhân chính xác không rõ, nghi ngờ liên quan đến rối loạn hệ miễn dịch và di truyền.',
    'Không thể chữa khỏi hoàn toàn.
Thuốc chống viêm (steroid, 5-ASA)
Thuốc ức chế miễn dịch
Thuốc sinh học
Phẫu thuật (cắt bỏ phần ruột bị ảnh hưởng)',
    'Không có cách phòng ngừa cụ thể
Không hút thuốc lá (làm bệnh nặng hơn)',
    'Bệnh tiêu hóa'
),
(
    'Sỏi mật', 
    'soi-mat', 
    'Sỏi mật là những viên sỏi cứng hình thành trong túi mật, thường do cholesterol hoặc bilirubin kết tủa.',
    'Hầu hết không có triệu chứng.
Đau đột ngột và dữ dội ở vùng bụng trên bên phải (cơn đau quặn mật), thường sau bữa ăn nhiều dầu mỡ
Đau lan ra vai phải hoặc lưng
Buồn nôn, nôn',
    'Nồng độ cholesterol cao trong dịch mật
Túi mật không làm rỗng đúng cách
Béo phì, nữ giới, tuổi cao',
    'Thuốc tan sỏi (ít hiệu quả)
Phẫu thuật cắt bỏ túi mật (phổ biến nhất)',
    'Duy trì cân nặng hợp lý
Chế độ ăn cân bằng, ít chất béo bão hòa
Tránh giảm cân quá nhanh',
    'Bệnh tiêu hóa'
),
(
    'Viêm tụy cấp', 
    'viem-tuy-cap', 
    'Viêm tụy cấp là tình trạng viêm đột ngột của tuyến tụy, có thể gây đau đớn và nguy hiểm.',
    'Đau bụng dữ dội vùng thượng vị, thường lan ra sau lưng
Đau tăng lên sau khi ăn
Buồn nôn, nôn mửa
Sốt, nhịp tim nhanh',
    'Sỏi mật (kẹt ở ống tụy)
Nghiện rượu nặng
Nồng độ triglyceride trong máu cao',
    'Nhập viện
Nhịn ăn (để tụy nghỉ ngơi)
Truyền dịch tĩnh mạch
Thuốc giảm đau
Điều trị nguyên nhân (lấy sỏi mật, cai rượu)',
    'Giảm uống rượu bia
Điều trị sỏi mật
Duy trì lối sống lành mạnh',
    'Bệnh tiêu hóa'
),

-- === BỆNH TIM MẠCH (5) ===
(
    'Tăng huyết áp (Cao huyết áp)', 
    'tang-huyet-ap', 
    'Tăng huyết áp là tình trạng áp lực của máu lên thành động mạch cao hơn mức bình thường, là "kẻ giết người thầm lặng".',
    'Thường không có triệu chứng.
Nặng: Đau đầu, chóng mặt, ù tai, khó thở, chảy máu cam',
    'Không rõ nguyên nhân (vô căn) ở 90% trường hợp.
Tuổi tác, di truyền
Lối sống: ăn mặn, béo phì, lười vận động, stress, hút thuốc, uống rượu bia',
    'Thay đổi lối sống (ăn nhạt, giảm cân, tập thể dục)
Thuốc hạ huyết áp (lợi tiểu, chẹn beta, ức chế men chuyển...)',
    'Chế độ ăn DASH (nhiều rau quả, ít muối)
Tập thể dục 30 phút/ngày
Giữ cân nặng lý tưởng',
    'Bệnh tim mạch'
),
(
    'Bệnh mạch vành', 
    'benh-mach-vanh', 
    'Bệnh mạch vành xảy ra khi các mảng xơ vữa tích tụ trong động mạch vành (nuôi tim), gây hẹp và cứng động mạch.',
    'Đau thắt ngực (cảm giác đè nén, siết chặt ở ngực khi gắng sức)
Khó thở
Mệt mỏi
Nhồi máu cơ tim (cơn đau tim)',
    'Mảng xơ vữa (cholesterol, chất béo)
Tăng huyết áp, mỡ máu cao, tiểu đường
Hút thuốc lá',
    'Thay đổi lối sống
Thuốc (Statin giảm mỡ máu, Aspirin chống đông, thuốc hạ áp)
Nong mạch vành, đặt stent
Phẫu thuật bắc cầu mạch vành (CABG)',
    'Kiểm soát tốt huyết áp, mỡ máu, đường huyết
Không hút thuốc lá
Chế độ ăn tốt cho tim mạch',
    'Bệnh tim mạch'
),
(
    'Suy tim', 
    'suy-tim', 
    'Suy tim là tình trạng tim không thể bơm máu đủ hiệu quả để đáp ứng nhu cầu của cơ thể.',
    'Khó thở (khi gắng sức, khi nằm, hoặc đột ngột về đêm)
Mệt mỏi, yếu sức
Sưng (phù) ở chân, mắt cá chân, bàn chân
Ho dai dẳng (có thể có đờm hồng)',
    'Do các tổn thương tim trước đó: bệnh mạch vành, nhồi máu cơ tim, tăng huyết áp lâu ngày, bệnh van tim.',
    'Điều trị nguyên nhân
Thuốc (ức chế men chuyển, chẹn beta, lợi tiểu)
Thay đổi lối sống (ăn nhạt, hạn chế dịch)
Cấy máy tạo nhịp, phẫu thuật',
    'Kiểm soát các yếu tố nguy cơ (tăng huyết áp, bệnh mạch vành)
Lối sống lành mạnh',
    'Bệnh tim mạch'
),
(
    'Rối loạn nhịp tim', 
    'roi-loan-nhip-tim', 
    'Rối loạn nhịp tim là tình trạng nhịp tim đập không đều: quá nhanh (nhịp nhanh), quá chậm (nhịp chậm), hoặc lúc nhanh lúc chậm.',
    'Hồi hộp, đánh trống ngực (tim đập "thình thịch" hoặc "hẫng")
Choáng váng, chóng mặt
Ngất xỉu (Syncope)
Khó thở, đau ngực',
    'Tổn thương tim (bệnh mạch vành, suy tim)
Tăng huyết áp
Rối loạn điện giải
Caffeine, rượu, stress',
    'Thuốc chống loạn nhịp
Sốc điện (cardioversion)
Cấy máy tạo nhịp (pacemaker)
Đốt điện (ablation)',
    'Giảm caffeine, rượu bia
Quản lý stress
Điều trị các bệnh tim nền',
    'Bệnh tim mạch'
),
(
    'Đột quỵ (Tai biến mạch máu não)', 
    'dot-quy', 
    'Đột quỵ xảy ra khi nguồn cung cấp máu cho một phần não bị gián đoạn (nhồi máu não) hoặc khi một mạch máu trong não bị vỡ (xuất huyết não).',
    'Dấu hiệu F.A.S.T:
Face (Mặt): Méo miệng, lệch mặt
Arm (Tay): Yếu hoặc liệt một bên tay
Speech (Lời nói): Nói ngọng, nói khó, không nói được
Time (Thời gian): Gọi cấp cứu 115 ngay lập tức',
    'Nhồi máu não (tắc mạch máu do cục máu đông hoặc mảng xơ vữa)
Xuất huyết não (vỡ mạch máu do tăng huyết áp, phình mạch)',
    'Cấp cứu y tế khẩn cấp.
Nhồi máu não: Thuốc tiêu sợi huyết (trong "giờ vàng"), can thiệp lấy huyết khối.
Xuất huyết não: Kiểm soát huyết áp, phẫu thuật.',
    'Kiểm soát huyết áp, tiểu đường, mỡ máu
Không hút thuốc
Không lạm dụng rượu bia',
    'Bệnh tim mạch'
),

-- === BỆNH DA LIỄU (5) ===
(
    'Bệnh vẩy nến', 
    'benh-vay-nen', 
    'Vẩy nến là một bệnh da mạn tính tự miễn, làm các tế bào da tăng sinh quá nhanh, tích tụ thành các mảng vảy bạc.',
    'Các mảng da đỏ, dày, có vảy trắng bạc
Da khô, nứt nẻ, có thể chảy máu
Ngứa, rát
Ảnh hưởng đến móng tay, khớp',
    'Rối loạn hệ thống miễn dịch
Yếu tố di truyền
Kích hoạt bởi: stress, nhiễm trùng, chấn thương da',
    'Không chữa khỏi, chỉ kiểm soát.
Kem bôi (steroid, vitamin D)
Liệu pháp ánh sáng (Quang trị liệu)
Thuốc uống hoặc tiêm (ức chế miễn dịch, sinh học)',
    'Giữ ẩm da
Quản lý stress
Tránh làm tổn thương da',
    'Bệnh da liễu'
),
(
    'Bệnh chàm (Eczema)', 
    'benh-cham-eczema', 
    'Eczema (viêm da cơ địa) là tình trạng da bị viêm, ngứa, đỏ, khô và nứt nẻ.',
    'Ngứa dữ dội (đặc biệt là ban đêm)
Các mảng da đỏ đến nâu xám
Da khô, đóng vảy, dày lên
Các nốt sần nhỏ, có thể rỉ dịch khi gãi',
    'Di truyền (cơ địa dị ứng)
Hàng rào bảo vệ da yếu
Tác nhân kích thích: xà phòng, chất tẩy rửa, dị nguyên (bụi, phấn hoa)',
    'Kem dưỡng ẩm (quan trọng nhất)
Kem bôi Steroid để giảm viêm, ngứa
Thuốc kháng Histamin (giảm ngứa)',
    'Dưỡng ẩm da hàng ngày
Tránh tắm nước quá nóng
Sử dụng xà phòng dịu nhẹ',
    'Bệnh da liễu'
),
(
    'Nấm da (Hắc lào, Lang ben)', 
    'nam-da', 
    'Nấm da là bệnh nhiễm trùng da do vi nấm gây ra, phổ biến ở các vùng da ẩm ướt, kín.',
    'Hắc lào: Mảng da đỏ, hình tròn, có viền, ngứa.
Lang ben: Các đốm da đổi màu (trắng, hồng, nâu), ít ngứa.
Nấm kẽ chân: Da bong tróc, nứt nẻ, ngứa ở kẽ ngón chân.',
    'Vi nấm (Dermatophytes, Malassezia)
Môi trường nóng ẩm, ra nhiều mồ hôi
Vệ sinh cá nhân kém, mặc quần áo bó sát',
    'Thuốc kháng nấm dạng kem bôi (Clotrimazole, Miconazole, Ketoconazole)
Thuốc uống (nếu bị nặng hoặc lan rộng)',
    'Giữ da khô ráo, sạch sẽ
Mặc quần áo thoáng mát
Không dùng chung khăn tắm, quần áo',
    'Bệnh da liễu'
),
(
    'Mề đay (Mày đay)', 
    'me-day', 
    'Mề đay là một phản ứng của da, gây ra các nốt sẩn phù (vết lằn) ngứa, màu đỏ hoặc trắng, giống như vết muỗi đốt.',
    'Các nốt sẩn ngứa, nổi gồ trên da
Có thể xuất hiện ở bất cứ đâu
Thường biến mất sau vài giờ và xuất hiện ở chỗ khác',
    'Dị ứng (thực phẩm, thuốc, côn trùng đốt)
Phản ứng với nhiệt độ (nóng, lạnh)
Nhiễm trùng
Stress',
    'Thuốc kháng Histamin (H1) để giảm ngứa và sẩn phù
Tránh các tác nhân gây dị ứng đã biết',
    'Xác định và tránh tác nhân gây bệnh
Quản lý stress',
    'Bệnh da liễu'
),
(
    'Bạch biến', 
    'bach-bien', 
    'Bạch biến là bệnh tự miễn làm mất các tế bào sản xuất sắc tố (melanocytes), gây ra các mảng da mất màu (màu trắng sữa).',
    'Các đốm, mảng da màu trắng sữa
Thường xuất hiện ở mặt, bàn tay, vùng da hở
Lông, tóc ở vùng da bị bệnh cũng có thể chuyển sang màu trắng',
    'Hệ miễn dịch tấn công và phá hủy tế bào melanocytes
Yếu tố di truyền
Stress, cháy nắng nặng',
    'Không chữa khỏi, mục tiêu là cải thiện thẩm mỹ.
Kem bôi (steroid, ức chế calcineurin)
Liệu pháp ánh sáng (PUVA, UVB dải hẹp)
Trang điểm che khuyết điểm',
    'Sử dụng kem chống nắng (vùng da trắng rất dễ bị cháy nắng)
Bảo vệ da khỏi tổn thương',
    'Bệnh da liễu'
),

-- === BỆNH TRUYỀN NHIỄM (5) ===
(
    'Cúm mùa', 
    'cum-mua', 
    'Cúm là một bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm (Influenza) gây ra.',
    'Sốt cao đột ngột
Đau đầu, đau mỏi cơ bắp dữ dội
Mệt mỏi, kiệt sức
Ho khan, đau họng, sổ mũi',
    'Virus cúm (Type A, B, C)
Lây qua giọt bắn đường hô hấp (ho, hắt hơi)',
    'Nghỉ ngơi nhiều, bù nước
Hạ sốt (Paracetamol)
Thuốc kháng virus (Oseltamivir - Tamiflu) có thể được chỉ định sớm',
    'Tiêm vắc-xin phòng cúm hàng năm (quan trọng nhất)
Rửa tay thường xuyên
Che miệng khi ho, hắt hơi',
    'Bệnh truyền nhiễm'
),
(
    'Thủy đậu (Trái rạ)', 
    'thuy-dau', 
    'Thủy đậu là bệnh truyền nhiễm cấp tính do virus Varicella-Zoster gây ra, rất dễ lây.',
    'Sốt nhẹ, mệt mỏi
Phát ban: bắt đầu là nốt đỏ, tiến triển thành mụn nước, sau đó đóng vảy
Ngứa dữ dội
Ban mọc rải rác toàn thân',
    'Virus Varicella-Zoster (VZV)
Lây qua đường hô hấp hoặc tiếp xúc trực tiếp với dịch mụn nước',
    'Điều trị triệu chứng: hạ sốt, thuốc kháng Histamin giảm ngứa
Dung dịch sát khuẩn (xanh methylen) bôi lên nốt phỏng
Thuốc kháng virus (Acyclovir) cho ca nặng',
    'Tiêm vắc-xin phòng thủy đậu
Cách ly người bệnh để tránh lây lan',
    'Bệnh truyền nhiễm'
),
(
    'Bệnh Sởi', 
    'benh-soi', 
    'Sởi là bệnh truyền nhiễm cấp tính do virus sởi gây ra, đặc trưng bởi sốt, phát ban và viêm long đường hô hấp.',
    'Sốt cao
Viêm long (chảy nước mũi, ho, mắt đỏ)
Nội ban (các hạt Koplik trong miệng)
Phát ban dạng sẩn, mọc từ sau tai, mặt, lan dần xuống thân và chân tay',
    'Virus sởi
Lây qua đường hô hấp (cực kỳ dễ lây)',
    'Không có điều trị đặc hiệu
Nghỉ ngơi, hạ sốt, bù nước
Bổ sung Vitamin A (theo chỉ định)',
    'Tiêm vắc-xin Sởi (thường trong vắc-xin MMR: Sởi - Quai bị - Rubella)',
    'Bệnh truyền nhiễm'
),
(
    'Quai bị', 
    'quai-bi', 
    'Quai bị là bệnh truyền nhiễm do virus quai bị gây ra, đặc trưng bởi sưng đau tuyến nước bọt mang tai.',
    'Sốt, đau đầu, mệt mỏi
Sưng và đau một hoặc cả hai bên tuyến nước bọt mang tai (góc hàm)
Đau khi nhai, nuốt, nói',
    'Virus quai bị (Mumps virus)
Lây qua đường hô hấp',
    'Điều trị triệu chứng: nghỉ ngơi, hạ sốt, giảm đau
Chườm mát hoặc ấm vùng sưng
Ăn thức ăn lỏng, mềm',
    'Tiêm vắc-xin MMR (Sởi - Quai bị - Rubella)',
    'Bệnh truyền nhiễm'
),
(
    'Sốt rét (Malaria)', 
    'sot-ret', 
    'Sốt rét là bệnh truyền nhiễm do ký sinh trùng Plasmodium gây ra, lây truyền qua vết đốt của muỗi Anopheles.',
    'Các cơn sốt rét điển hình (rét run - sốt cao - vã mồ hôi)
Chu kỳ sốt lặp lại (cách ngày hoặc hàng ngày)
Thiếu máu, da xanh, lách to',
    'Ký sinh trùng Plasmodium (P. falciparum, P. vivax...)
Lây qua muỗi Anopheles cái',
    'Thuốc kháng sốt rét (Chloroquine, Artemisinin...)
Điều trị theo phác đồ của Bộ Y tế',
    'Ngủ trong màn (mùng) có tẩm hóa chất diệt muỗi
Diệt bọ gậy, phun hóa chất diệt muỗi
Uống thuốc dự phòng khi vào vùng dịch',
    'Bệnh truyền nhiễm'
),

-- === BỆNH NỘI TIẾT (5) ===
(
    'Tiểu đường tuýp 1 (Đái tháo đường tuýp 1)', 
    'tieu-duong-tuyp-1', 
    'Tiểu đường tuýp 1 là bệnh tự miễn, trong đó hệ miễn dịch tấn công và phá hủy các tế bào beta trong tuyến tụy, khiến cơ thể không sản xuất được insulin.',
    'Ăn nhiều, uống nhiều, tiểu nhiều, gầy nhiều (4 nhiều)
Mệt mỏi, nhìn mờ
Dễ bị nhiễm trùng',
    'Tự miễn dịch
Yếu tố di truyền và môi trường',
    'Tiêm insulin suốt đời
Theo dõi đường huyết chặt chẽ
Chế độ ăn kiêng và tập luyện nghiêm ngặt',
    'Không có cách phòng ngừa hiệu quả',
    'Bệnh nội tiết'
),
(
    'Tiểu đường tuýp 2 (Đái tháo đường tuýp 2)', 
    'tieu-duong-tuyp-2', 
    'Tiểu đường tuýp 2 là tình trạng cơ thể kháng insulin (sử dụng insulin không hiệu quả) hoặc không sản xuất đủ insulin.',
    'Triệu chứng thường âm thầm:
Khát nước, đi tiểu nhiều
Đói thường xuyên
Nhìn mờ, mệt mỏi
Vết thương lâu lành, nhiễm trùng lặp đi lặp lại',
    'Béo phì, thừa cân
Lối sống ít vận động
Di truyền, tuổi tác
Tiền sử gia đình',
    'Thay đổi lối sống (giảm cân, tập thể dục, ăn kiêng)
Thuốc uống (Metformin...)
Tiêm insulin (nếu thuốc uống không hiệu quả)',
    'Duy trì cân nặng lý tưởng
Chế độ ăn lành mạnh
Tập thể dục đều đặn',
    'Bệnh nội tiết'
),
(
    'Bệnh Basedow (Cường giáp)', 
    'benh-basedow-cuong-giap', 
    'Bệnh Basedow (Graves'' disease) là bệnh tự miễn gây cường giáp, tình trạng tuyến giáp sản xuất quá nhiều hormone.',
    'Căng thẳng, lo lắng, run tay
Tim đập nhanh, hồi hộp
Sụt cân dù ăn nhiều
Ra mồ hôi nhiều, sợ nóng
Lồi mắt (dấu hiệu đặc trưng)',
    'Hệ miễn dịch sản xuất kháng thể (TRAb) kích thích tuyến giáp hoạt động quá mức.',
    'Thuốc kháng giáp (PTU, Methimazole)
I-ốt phóng xạ (I-131)
Phẫu thuật cắt tuyến giáp',
    'Không có cách phòng ngừa cụ thể
Quản lý stress, không hút thuốc',
    'Bệnh nội tiết'
),
(
    'Suy giáp', 
    'suy-giap', 
    'Suy giáp là tình trạng tuyến giáp không sản xuất đủ hormone, làm chậm quá trình trao đổi chất của cơ thể.',
    'Mệt mỏi, uể oải, buồn ngủ
Tăng cân không rõ nguyên nhân
Sợ lạnh, da khô, tóc rụng
Táo bón
Trí nhớ giảm sút, trầm cảm',
    'Viêm tuyến giáp Hashimoto (tự miễn)
Sau phẫu thuật hoặc xạ trị tuyến giáp
Thiếu i-ốt (hiếm ở các nước phát triển)',
    'Bổ sung hormone tuyến giáp (Levothyroxine) hàng ngày, suốt đời.',
    'Đảm bảo đủ i-ốt trong chế độ ăn (muối i-ốt)',
    'Bệnh nội tiết'
),
(
    'Hội chứng Cushing', 
    'hoi-chung-cushing', 
    'Hội chứng Cushing xảy ra do cơ thể tiếp xúc với nồng độ hormone cortisol quá cao trong thời gian dài.',
    'Tăng cân, béo phì ở trung tâm (mặt tròn như mặt trăng, bướu mỡ sau gáy)
Da mỏng, dễ bầm tím, rạn da màu tím đỏ
Mặt đỏ, mụn trứng cá
Yếu cơ, huyết áp cao, đường huyết cao',
    'Sử dụng thuốc corticosteroid liều cao, kéo dài (phổ biến nhất)
U tuyến yên, u tuyến thượng thận sản xuất quá nhiều cortisol',
    'Giảm liều hoặc ngưng thuốc steroid (nếu có thể)
Phẫu thuật, xạ trị (nếu do khối u)',
    'Sử dụng thuốc steroid theo đúng chỉ định của bác sĩ',
    'Bệnh nội tiết'
),

-- === BỆNH THẦN KINH (5) ===
(
    'Đau nửa đầu Migraine', 
    'dau-nua-dau-migraine', 
    'Migraine là một chứng đau đầu mạn tính, gây ra các cơn đau dữ dội, nhói theo nhịp mạch, thường ở một bên đầu.',
    'Đau đầu dữ dội (thường 1 bên)
Nhạy cảm với ánh sáng, âm thanh, mùi
Buồn nôn, nôn mửa
Có thể có "tiền triệu" (aura) như thấy vệt sáng, chớp lòe',
    'Nguyên nhân phức tạp, liên quan đến di truyền, hoạt động bất thường của não.',
    'Điều trị cắt cơn: Thuốc giảm đau (Paracetamol, NSAIDs), thuốc triptan.
Điều trị dự phòng: (nếu cơn thường xuyên)',
    'Tránh các yếu tố kích phát (stress, mất ngủ, một số loại thức ăn)
Ngủ đủ giấc, tập thể dục',
    'Bệnh thần kinh'
),
(
    'Bệnh Alzheimer', 
    'benh-alzheimer', 
    'Alzheimer là bệnh thoái hóa thần kinh phổ biến nhất, gây suy giảm trí nhớ, nhận thức và hành vi, dẫn đến sa sút trí tuệ.',
    'Suy giảm trí nhớ ngắn hạn (quên sự kiện, cuộc trò chuyện gần đây)
Khó khăn trong việc lên kế hoạch, giải quyết vấn đề
Lú lẫn về thời gian, địa điểm
Thay đổi tính cách, tâm trạng',
    'Sự tích tụ của các mảng amyloid và đám rối tau trong não, làm chết tế bào thần kinh. Tuổi tác là yếu tố nguy cơ lớn nhất.',
    'Không chữa khỏi.
Thuốc ức chế cholinesterase (Donepezil) để làm chậm triệu chứng
Chăm sóc hỗ trợ, duy trì môi trường sống an toàn',
    'Lối sống lành mạnh (tập thể dục, ăn uống, hoạt động xã hội)
Kích thích trí não (đọc sách, học cái mới)',
    'Bệnh thần kinh'
),
(
    'Bệnh Parkinson', 
    'benh-parkinson', 
    'Parkinson là bệnh thoái hóa thần kinh mạn tính, ảnh hưởng đến cử động, gây ra bởi sự thiếu hụt dopamine trong não.',
    'Run (thường ở tay, khi nghỉ ngơi)
Cử động chậm chạp (bradykinesia)
Cứng cơ (rigidity)
Mất thăng bằng, dáng đi không ổn định',
    'Sự chết của các tế bào não sản xuất dopamine. Nguyên nhân không rõ, liên quan đến tuổi tác và di truyền.',
    'Thuốc (Levodopa) để bổ sung dopamine
Vật lý trị liệu
Phẫu thuật kích thích não sâu (DBS)',
    'Không có cách phòng ngừa rõ ràng. Một số nghiên cứu cho thấy tập thể dục, caffeine có thể giảm nguy cơ.',
    'Bệnh thần kinh'
),
(
    'Động kinh (Co giật)', 
    'dong-kinh', 
    'Động kinh là một rối loạn thần kinh mạn tính, đặc trưng bởi các cơn co giật tái phát do sự phóng điện bất thường, đột ngột của các tế bào thần kinh.',
    'Nhiều loại cơn:
Cơn co cứng co giật toàn thể (mất ý thức, co giật mạnh)
Cơn vắng ý thức (nhìn chằm chằm, mất nhận thức tạm thời)
Cơn cục bộ (co giật một phần cơ thể, có thể kèm rối loạn cảm giác)',
    'Không rõ nguyên nhân (vô căn)
Tổn thương não (chấn thương, đột quỵ, u não)
Di truyền',
    'Thuốc chống động kinh (hầu hết các trường hợp)
Phẫu thuật (nếu thuốc không hiệu quả)
Chế độ ăn Ketogenic',
    'Tránh các yếu tố gây co giật (mất ngủ, bỏ thuốc, ánh sáng nhấp nháy)',
    'Bệnh thần kinh'
),
(
    'Đa xơ cứng (MS)', 
    'da-xo-cung', 
    'Đa xơ cứng là bệnh tự miễn mạn tính, trong đó hệ miễn dịch tấn công lớp vỏ myelin (bảo vệ sợi thần kinh), gây tổn thương não và tủy sống.',
    'Triệu chứng đa dạng, tùy vùng bị ảnh hưởng:
Nhìn mờ, nhìn đôi (viêm dây thần kinh thị)
Yếu cơ, tê bì chân tay
Mất thăng bằng, chóng mặt
Mệt mỏi, vấn đề về trí nhớ',
    'Tự miễn dịch. Yếu tố môi trường (ít tiếp xúc ánh nắng - thiếu Vitamin D) và di truyền.',
    'Không chữa khỏi.
Thuốc điều hòa miễn dịch (DMTs) để giảm tần suất và mức độ các đợt tấn công.
Corticosteroid (khi có đợt cấp)
Vật lý trị liệu',
    'Không có cách phòng ngừa cụ thể',
    'Bệnh thần kinh'
),

-- === BỆNH CƠ XƯƠNG KHỚP (5) ===
(
    'Viêm khớp dạng thấp (RA)', 
    'viem-khop-dang-thap', 
    'RA là bệnh tự miễn mạn tính, gây viêm đối xứng ở nhiều khớp, đặc biệt là các khớp nhỏ ở bàn tay, cổ tay.',
    'Đau, sưng, nóng, đỏ ở nhiều khớp
Cứng khớp buổi sáng (kéo dài > 1 giờ)
Mệt mỏi, sốt nhẹ
Biến dạng khớp (nếu không điều trị)',
    'Hệ miễn dịch tấn công màng hoạt dịch của khớp. Yếu tố di truyền, hút thuốc lá.',
    'Thuốc DMARDs (Methotrexate) để làm chậm bệnh
Thuốc sinh học (nếu DMARDs không hiệu quả)
Thuốc giảm đau (NSAIDs), Corticoid (ngắn hạn)',
    'Không hút thuốc lá',
    'Bệnh cơ xương khớp'
),
(
    'Thoái hóa khớp (OA)', 
    'thoai-hoa-khop', 
    'Thoái hóa khớp là bệnh lý mạn tính do sự mài mòn, tổn thương sụn khớp và xương dưới sụn, phổ biến ở người lớn tuổi.',
    'Đau khớp (tăng khi vận động, giảm khi nghỉ ngơi)
Cứng khớp buổi sáng (ngắn, < 30 phút)
Lạo xạo, lục khục khi cử động khớp
Giới hạn vận động, sưng khớp',
    'Tuổi tác (phổ biến nhất)
Béo phì (gây áp lực lên khớp gối, háng)
Chấn thương khớp trước đó
Di truyền',
    'Giảm đau (Paracetamol, NSAIDs)
Vật lý trị liệu, tập thể dục (tăng sức mạnh cơ)
Giảm cân
Tiêm nội khớp (Corticoid, Hyaluronic acid)
Phẫu thuật thay khớp (nếu nặng)',
    'Duy trì cân nặng hợp lý
Tập thể dục đều đặn, vừa sức
Tránh chấn thương khớp',
    'Bệnh cơ xương khớp'
),
(
    'Bệnh Gout (Gút)', 
    'benh-gout', 
    'Gout là một dạng viêm khớp do sự tích tụ của các tinh thể acid uric trong khớp, gây ra các cơn đau dữ dội.',
    'Cơn đau khớp cấp tính, dữ dội (thường ở ngón chân cái)
Khớp sưng, nóng, đỏ, cực kỳ nhạy cảm
Cơn đau thường xảy ra đột ngột về đêm',
    'Nồng độ acid uric trong máu cao (do cơ thể sản xuất quá nhiều hoặc thận thải không hết).
Chế độ ăn nhiều purine (thịt đỏ, hải sản, nội tạng, rượu bia)',
    'Điều trị cơn cấp: Thuốc kháng viêm (NSAIDs, Colchicine, Corticoid)
Điều trị dự phòng: Thuốc hạ acid uric máu (Allopurinol)',
    'Hạn chế thực phẩm giàu purine
Hạn chế rượu bia
Uống nhiều nước',
    'Bệnh cơ xương khớp'
),
(
    'Loãng xương', 
    'loang-xuong', 
    'Loãng xương là tình trạng xương trở nên giòn, xốp và yếu, dễ bị gãy dù chỉ với chấn thương nhẹ.',
    'Thường không có triệu chứng cho đến khi bị gãy xương.
Đau lưng mạn tính
Giảm chiều cao (do xẹp đốt sống)
Gù lưng',
    'Mất cân bằng giữa quá trình tạo xương và hủy xương.
Tuổi tác (phổ biến ở phụ nữ sau mãn kinh do thiếu hụt estrogen)
Ít vận động, thiếu canxi, vitamin D',
    'Bổ sung Canxi và Vitamin D
Thuốc chống hủy xương (Bisphosphonates)
Tập thể dục chịu trọng lượng (đi bộ, nâng tạ nhẹ)',
    'Chế độ ăn giàu canxi, vitamin D
Tập thể dục thường xuyên
Không hút thuốc, hạn chế rượu bia',
    'Bệnh cơ xương khớp'
),
(
    'Đau lưng dưới cấp tính', 
    'dau-lung-duoi-cap', 
    'Đau lưng dưới cấp tính là tình trạng đau đột ngột ở vùng thắt lưng, thường do căng cơ hoặc bong gân dây chằng.',
    'Đau nhói hoặc âm ỉ ở thắt lưng
Đau tăng khi cử động, cúi, nâng vật nặng
Co cứng cơ lưng',
    'Hoạt động sai tư thế (nâng vật nặng không đúng cách)
Cử động đột ngột, vặn xoắn lưng
Chấn thương thể thao',
    'Nghỉ ngơi (ngắn hạn, 1-2 ngày)
Chườm lạnh (trong 48h đầu) sau đó chườm ấm
Thuốc giảm đau, giãn cơ (NSAIDs)
Vật lý trị liệu, bài tập nhẹ nhàng',
    'Tập các bài tập tăng cường sức mạnh cơ lưng, cơ bụng
Nâng vật nặng đúng tư thế (dùng chân, giữ lưng thẳng)',
    'Bệnh cơ xương khớp'
);
