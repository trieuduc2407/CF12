export const addTableForm = [
    {
        name: 'tableName',
        label: 'Tên bàn',
        component: 'input',
        type: 'text',
        placeholder: 'Nhập tên bàn',
        required: true,
    },
    {
        name: 'status',
        label: 'Trạng thái',
        component: 'select',
        options: [
            { value: 'available', label: 'Có sẵn' },
            { value: 'occupied', label: 'Đang sử dụng' },
            { value: 'closed', label: 'Không sử dụng' },
        ],
        required: true,
    },
]
