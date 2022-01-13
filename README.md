# Trang web tin tức tiếng Việt
## Giới thiệu
Đây là trang web tin tức tiếng Việt, nơi mọi người có thể tìm đọc những bản tin mới nhất từ nhiều chủ đề khác nhau.

Bài tập lớn môn Công nghệ Web và dịch vụ trực tuyển do thầy Đào Trung Kiên hướng dẫn.

## Các tính năng chính
- Trang web có 2 level người dùng
    - Admin: có thể thêm admin khác, thêm sửa xóa bài báo do admin đó đăng
    - User: có thể đọc báo, đánh giá và comment
- Trang web responsive với 2 mức 800 và 1200px
- Trang web có header và footer chung cho các page
- Giao diện đẹp, tổ chức mã nguồn rõ ràng, mạch lạc

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
- Bước 3: Cấu hình lại chương trình
    - Trong project, mở file config.json, trong mục DBInfo, thay đổi host, username và password tương ứng trong MySql
- Bước 4: Chạy chương trình bằng lệnh: npm start
- Bước 5: Truy cập vào localhost cổng 3000 bằng Web Browser và đăng nhập dưới quyền admin vào tài khoản admin mặc định: Tài khoản là admin và mật khẩu là admin
- Bước 6: Sử dụng tài khoản admin mặc định để thêm tài khoản admin mới hoặc đăng bài báo mới (Nên đăng một số bài báo trước khi đăng nhập bằng user)
- Bước 7: Đăng nhập dưới quyền user (có thể chọn khách hoặc tạo tài khoản mới), sau đó có thể sử dụng một cách bình thường dưới quyền user
