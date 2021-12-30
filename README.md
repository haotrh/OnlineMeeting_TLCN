## Tiểu luận chuyên ngành (CLC)
### Đề tài: Xây Dựng Website Online Meeting
### Thành Viên Nhóm:
+ Trần Hữu Hào - 18110103
+ Bùi Phúc Lâm - 18110141

--------------------------------------------------
## HƯỚNG DẪN CÀI ĐẶT

### Yêu cầu: 
- PostgreSQL
- NodeJS v16.x trở lên

Clone project tại Github: https://github.com/haotran2000pt/OnlineMeeting_TLCN

### Cài đặt và sử dụng trên localhost:
*	Thay đổi thông tin tài khoản PostgreSQL tại file "/BE/OnlineMeeting/config/db.config.js”. Các thông tin bao gồm: USER, PASSWORD, DB
#### Đối với frontend:
- Đổi tên file ".env.local.example" thành ".env.local"
- Cài đặt bằng cách vào folder "FE", bật cmd và nhập (chỉ cần cài đặt 1 lần):
```bash
npm install
```
- Chạy chương trình bằng cách vào folder "FE", bật cmd và nhập:
```bash
npm run dev
```
#### Đối với backend:
* Để cài đặt mediasoup, vào trang bên dưới để xem các requirements cho từng hệ điều hành:
```bash
https://mediasoup.org/documentation/v3/mediasoup/installation/
```
* Để cài đặt thì truy cập "/BE/OnlineMeeting", bật cmd và nhập lệnh:
```bash
npm install
```
* Để chạy máy chủ, truy cập "/BE/OnlineMeeting", bật cmd và nhập lệnh:
```bash
npm run dev
```
*	Khi chạy máy chủ lần đầu chạy trên localhost: Truy cập “/BE/OnlineMeeting/app.js” và bỏ “//” (uncomment) tại dòng thứ 44 để khởi tạo database và comment lại hoặc xóa dòng đó đi cho các lần chạy tiếp theo nếu không muốn reset database mỗi lần chạy server:
```bash
//await runSequelize();
thành
await runSequelize();
```
*	Sau khi khởi chạy frontend và backend, truy cập đường dẫn http://localhost:3000/ để sử dụng

### Sử dụng trực tiếp tại website: https://online-meeting-tlcn-nine.vercel.app/

