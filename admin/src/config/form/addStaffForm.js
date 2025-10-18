export const addStaffForm = [
    {
        name: 'name',
        label: 'Họ và tên',
        component: 'input',
        type: 'text',
        placeholder: 'Nhập họ và tên',
        required: true,
    },
    {
        name: 'username',
        label: 'Tên đăng nhập',
        component: 'input',
        type: 'text',
        placeholder: 'Nhập tên đăng nhập',
        required: true,
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        component: 'input',
        type: 'password',
        placeholder: 'Nhập mật khẩu',
        required: true,
    },
    {
        name: 'role',
        label: 'Vai trò',
        component: 'select',
        placeholder: 'Chọn vai trò',
        options: [
            { value: 'employee', label: 'Nhân viên' },
            { value: 'staff', label: 'Quản lý' },
            { value: 'admin', label: 'Quản trị viên' },
        ],
        required: true,
    },
]
