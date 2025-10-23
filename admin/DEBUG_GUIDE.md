# 🐛 Hướng dẫn Debug iOS Login Issue

## 📱 Cách simulate iOS trên Windows 11:

### 1. **Chrome DevTools (Khuyến nghị)**

1. Mở Chrome và truy cập trang login
2. Nhấn `F12` hoặc `Ctrl+Shift+I` để mở DevTools
3. Nhấn `Ctrl+Shift+M` để bật Device Mode
4. Chọn device: **iPhone 12 Pro** hoặc **iPhone 14 Pro**
5. Refresh trang và test login

### 2. **Firefox Responsive Design Mode**

1. Mở Firefox và truy cập trang login
2. Nhấn `F12` để mở DevTools
3. Nhấn `Ctrl+Shift+M` để bật Responsive Design Mode
4. Chọn device: **iPhone 12/13/14**
5. Test login

### 3. **Edge DevTools**

1. Mở Edge và truy cập trang login
2. Nhấn `F12` để mở DevTools
3. Nhấn `Ctrl+Shift+M` để bật Device Mode
4. Chọn device: **iPhone 12 Pro**
5. Test login

## 🔍 Cách kiểm tra Debug Info:

### 1. **Debug Panel trên màn hình**

- Khi chạy `npm run dev`, debug panel sẽ hiển thị ở góc trái màn hình
- Hiển thị: iOS detection, last action, errors

### 2. **Console Logs**

Mở DevTools Console và tìm:

```
=== LOGIN DEBUG INFO ===
User Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)...
Is iOS device: true
Form data: {username: "...", password: "..."}
Current URL: http://localhost:5173/admin/login
========================
```

### 3. **Network Tab**

- Kiểm tra request đến `/api/admin/auth/login`
- Xem response status và data

## 🚨 Các vấn đề thường gặp:

### 1. **iOS Detection không đúng**

- User Agent không chứa "iPhone" hoặc "iPad"
- Giải pháp: Kiểm tra regex pattern

### 2. **Axios request thất bại**

- CORS issues
- Network timeout
- Giải pháp: Kiểm tra Network tab

### 3. **Redirect không hoạt động**

- `navigate()` bị block
- `window.location.href` không chạy
- Giải pháp: Kiểm tra console errors

## 📋 Checklist Debug:

- [ ] Debug panel hiển thị "iOS: ✅ Yes"
- [ ] Console hiển thị "Using direct axios for iOS"
- [ ] Network request thành công (200 status)
- [ ] Response có `success: true`
- [ ] Console hiển thị "iOS Login successful, redirecting..."
- [ ] Redirect hoạt động hoặc có error message

## 🔧 Cách test thực tế:

### 1. **Sử dụng ngrok (Khuyến nghị)**

```bash
# Cài đặt ngrok
npm install -g ngrok

# Chạy ngrok
ngrok http 5173

# Sử dụng URL ngrok để test trên iPhone thật
```

### 2. **Sử dụng Vercel Preview**

- Deploy lên Vercel
- Sử dụng preview URL để test trên iPhone

### 3. **Remote Debugging**

- Kết nối iPhone với Mac qua USB
- Sử dụng Safari Web Inspector
- Hoặc sử dụng Chrome Remote Debugging

## 📞 Khi cần hỗ trợ:

Gửi thông tin sau:

1. Screenshot debug panel
2. Console logs đầy đủ
3. Network request/response
4. User Agent string
5. Mô tả hành vi cụ thể
