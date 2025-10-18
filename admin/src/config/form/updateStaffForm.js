export const updateStaffForm = [
    {
        name: 'name',
        label: 'Họ và tên',
        component: 'input',
        type: 'text',
        placeholder: 'Nhập họ và tên',
        disabled: true,
    },
    {
        name: 'role',
        label: 'Vai trò',
        component: 'select',
        options: [
            { value: 'employee', label: 'Nhân viên' },
            { value: 'staff', label: 'Quản lý' },
            { value: 'admin', label: 'Quản trị viên' },
        ],
    },
]
