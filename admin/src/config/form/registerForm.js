export const registerForm = [
    {
        name: 'fullName',
        label: 'Họ và tên',
        component: 'input',
        type: 'text',
        placeholder: 'Nhập họ và tên',
        required: true,
    },
    {
        name: 'userName',
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
        label: 'Chức vụ',
        component: 'select',
        placeholder: 'Nhập chức vụ',
        options: [
            { value: 'staff', label: 'Quản lý' },
            { value: 'employee', label: 'Nhân viên' },
        ],
        required: true,
    },
]
