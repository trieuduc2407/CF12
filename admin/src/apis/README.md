# API Services Documentation

Folder này chứa tất cả API service functions để tương tác với backend.

## 📁 Structure

```
apis/
├── index.js          # Central export point
├── authApi.js        # Authentication APIs
├── orderApi.js       # Order management APIs
├── sessionApi.js     # Session & payment APIs
├── productApi.js     # Product management APIs
├── storageApi.js     # Ingredient/storage APIs
├── staffApi.js       # Staff management APIs
└── tableApi.js       # Table management APIs
```

## 🎯 Usage

### Option 1: Import từ index (Recommended)
```javascript
import { fetchSessions, loginStaff, fetchAllProducts } from '@/apis'

// Sử dụng trong component hoặc Redux thunk
const sessions = await fetchSessions('active')
```

### Option 2: Import trực tiếp từ file
```javascript
import { fetchSessions } from '@/apis/sessionApi'
import { loginStaff } from '@/apis/authApi'
```

## 📝 API Functions

### Auth APIs (`authApi.js`)
- `loginStaff(credentials)` - Đăng nhập
- `logoutStaff()` - Đăng xuất
- `getMe()` - Lấy thông tin staff hiện tại
- `changePassword(passwordData)` - Đổi mật khẩu

### Session APIs (`sessionApi.js`)
- `fetchSessions(status)` - Lấy danh sách phiên (filter theo status)
- `fetchSessionById(sessionId)` - Lấy chi tiết 1 phiên
- `getSessionPaymentPreview(sessionId, phone, pointsToUse)` - Preview thanh toán
- `checkoutSession(sessionId, paymentData)` - Thanh toán phiên

### Order APIs (`orderApi.js`)
- `fetchAllOrders()` - Lấy tất cả đơn hàng
- `updateOrderStatus(orderId, status)` - Cập nhật trạng thái đơn
- ~~`getPaymentPreview()`~~ - DEPRECATED, dùng session payment
- ~~`processPayment()`~~ - DEPRECATED, dùng session payment

### Product APIs (`productApi.js`)
- `fetchAllProducts()` - Lấy tất cả sản phẩm
- `fetchProductById(id)` - Lấy chi tiết sản phẩm
- `createProduct(formData)` - Tạo sản phẩm mới (multipart/form-data)
- `updateProduct({ id, formData })` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `searchProducts(query)` - Tìm kiếm sản phẩm
- `toggleProductSignature(productId)` - Toggle signature status

### Storage APIs (`storageApi.js`)
- `fetchAllIngredients()` - Lấy tất cả nguyên liệu
- `fetchIngredientById(id)` - Lấy chi tiết nguyên liệu
- `createIngredient(data)` - Tạo nguyên liệu mới
- `updateIngredient({ id, formData })` - Cập nhật nguyên liệu
- `deleteIngredient(id)` - Xóa nguyên liệu
- `searchIngredients(query)` - Tìm kiếm nguyên liệu

### Staff APIs (`staffApi.js`)
- `fetchAllStaff()` - Lấy tất cả nhân viên
- `fetchStaffById(id)` - Lấy chi tiết nhân viên
- `createStaff(data)` - Tạo nhân viên mới
- `updateStaff({ id, formData })` - Cập nhật nhân viên
- `deleteStaff(id)` - Xóa nhân viên

### Table APIs (`tableApi.js`)
- `fetchAllTables()` - Lấy tất cả bàn
- `fetchTableById(id)` - Lấy chi tiết bàn
- `createTable(data)` - Tạo bàn mới
- `updateTable({ id, formData })` - Cập nhật bàn
- `deleteTable(id)` - Xóa bàn

## 🔧 Usage trong Redux Thunks

### Before (inline axios):
```javascript
export const getAllOrders = createAsyncThunk(
    'adminOrder/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/orders`, {
                withCredentials: true,
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)
```

### After (using API service):
```javascript
import { fetchAllOrders } from '@/apis'

export const getAllOrders = createAsyncThunk(
    'adminOrder/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllOrders()
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)
```

## 🎨 Usage trong Components

```javascript
import { fetchSessions } from '@/apis'

const Sessions = () => {
    const [sessions, setSessions] = useState([])
    
    const loadSessions = async () => {
        try {
            const data = await fetchSessions('active')
            setSessions(data)
        } catch (error) {
            console.error(error.message)
        }
    }
    
    useEffect(() => {
        loadSessions()
    }, [])
    
    return (
        // ... JSX
    )
}
```

## ✅ Benefits

1. **Separation of concerns:** API logic tách biệt khỏi UI và state management
2. **Reusability:** Dùng lại API functions ở nhiều nơi
3. **Maintainability:** Dễ update endpoint, error handling tập trung
4. **Testability:** Test API logic độc lập
5. **Type safety ready:** Dễ thêm TypeScript sau này

## 📚 Error Handling

Tất cả API functions đều throw Error với message rõ ràng:

```javascript
try {
    const data = await fetchSessions('active')
} catch (error) {
    // error.message chứa thông báo lỗi từ backend hoặc generic error
    console.error(error.message)
    alert(error.message)
}
```

## 🔐 Authentication

Tất cả API calls đều gửi `withCredentials: true` để include cookies (JWT token).

## 🚀 Next Steps

- [ ] Thêm TypeScript definitions
- [ ] Thêm request/response interceptors
- [ ] Thêm retry logic cho failed requests
- [ ] Thêm caching layer (React Query hoặc SWR)
