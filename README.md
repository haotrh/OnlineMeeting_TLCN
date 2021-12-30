Tiểu luận chuyên ngành (CLC)
<br/>Đề tài: Xây Dựng Website Online Meeting
<br/>Thành Viên Nhóm:
+ Trần Hữu Hào - 18110103
+ Bùi Phúc Lâm - 18110141

--------------------------------------------------
HƯỚNG DẪN CÀI ĐẶT

Yêu cầu: Đã cài đặt PostgreSQL

Clone project tại Github: https://github.com/haotran2000pt/OnlineMeeting_TLCN

Cài đặt và sử dụng tại localhost:
-	Thay đổi thông tin tài khoản PostgreSQL tại “../BE/OnlineMeeting/config/db.config.js”. Các thông tin bao gồm: USER, PASSWORD, DB
-	Đối với lần đầu chạy tại localhost: Truy cập “../BE/OnlineMeeting/app.js” và bỏ “//” (uncomment) tại dòng thứ 44 (“//await runSequelize();” thành “await runSequelize();”
-	Đối với frontend: Truy cập đường dẫn “../FE/” rồi sử dụng lệnh “npm run dev” 
-	Đối với backend: Truy cập đường dẫn “../BE/OnlineMeeting/” rồi sử dụng lệnh “npm run dev”
-	Sau khi khởi chạy frontend và backend, truy cập đường dẫn http://localhost:3000/ để sử dụng

Sử dụng trực tiếp tại website: https://online-meeting-tlcn-nine.vercel.app/

