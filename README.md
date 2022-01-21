# Trang web tin tức tiếng Việt
## Giới thiệu
Đây là trang web tin tức tiếng Việt, nơi mọi người có thể tìm đọc những bản tin mới nhất từ nhiều chủ đề khác nhau.

Bài tập lớn môn Công nghệ Web và dịch vụ trực tuyển do thầy Đào Trung Kiên hướng dẫn.

## Các tính năng chính
- Trang web có 2 level người dùng
    - Admin
    - User: có thể đọc báo, đánh giá và comment
- Trang web responsive với 2 mức 800 và 1200px
- Trang web có header và footer chung cho các page
- Giao diện đẹp, tổ chức mã nguồn rõ ràng, mạch lạc

### Với admin
- Bạn nên dăng nhập với tài khoản admin mặc định (check vào Bạn là admin? ở trang đăng nhập) và thêm tài khoản admin của riêng bạn
- Một admin có thể thêm admin khác, thêm sửa xóa bài viết do admin đó đăng và theo dõi các thông tin về trang web như số lượt truy cập, số bài báo của admin đó, số người dùng

### Với user
- Bạn có thể đăng ký tài khoản người dùng mới rồi dùng tài khoản đó hoặc chọn Tôi là khách để truy cập với vai trò khách
- Một user có thể xem danh sách bài báo mới nhất (tại trang chủ), danh sách bài báo theo chủ đề, tìm kiếm bài báo theo từ khóa
- Ngoài ra, user còn có thể xem nội dung chi tiết, những comment và đánh giá của những user khác về bài báo, user cũng có thê tự mình đánh giá và comment với 2 chế độ ẩn danh hoặc công khai

## Phân chia công việc
- Trần Thế Anh: Thiết kế giao diện (HTML, CSS) và xử lý responsive, lập trình trang user home và trang đăng nhập, đăng ký người dùng
- Phạm Xuân Lộc: Lập trình trang admin home và trang đăng nhập admin
- Nguyễn Quang Hưng: Lập trình trang bản tin chi tiết 
- Nguyễn Huy Hiếu: Lập trình trang tìm kiếm và trang tin theo chủ đề

## Hướng dẫn cài đặt trên localhost
- Bước 1: Clone project về một folder trên máy tính
- Bước 2: Chuẩn bị cơ sở dữ liệu
    - Mở file database.sql và thay đổi nội dung tại dòng 58 (phần Thay đổi tài khoản root) thông tin về username và password mà bạn sử dụng trong mysql của bạn
    - Chạy file database.sql trên MySql để khởi tạo cơ sở dữ liệu và tiến hành các cài đặt cần thiết
    - Chạy file data.sql trên MySql để thêm dữ liệu vào CSDL
- Bước 3: Cấu hình lại chương trình
    - Trong project, mở file config.json, trong mục DBInfo, thay đổi host, username và password tương ứng trong MySql
- Bước 4: Chạy chương trình bằng lệnh: npm start
- Bước 5: Truy cập vào localhost cổng 8888 bằng Web Browser sử dụng web một cách bình thường
    - Tài khoản admin mặc định: admin admin
    - Tài khoản user mặc định: guest guest (có thể dùng nút Tôi là khách trên giao diện Đăng nhập)