export const addProductForm = [
    {
        name: 'name',
        label: 'Tên sản phẩm',
        placeholder: 'Nhập tên sản phẩm',
        component: 'input',
        type: 'text',
        required: true,
    },
    {
        name: 'category',
        label: 'Danh mục',
        placeholder: 'Chọn danh mục',
        component: 'select',
        options: [
            { value: 'coffee', label: 'Cà phê' },
            { value: 'mixed', label: 'Sinh tố và nước ép' },
            { value: 'milktea', label: 'Trà sữa' },
            { value: 'yogurt', label: 'Sữa chua và thức uống khác' }
        ],
        required: true,
    },
    {
        name: 'basePrice',
        label: 'Giá',
        placeholder: 'Nhập giá sản phẩm',
        component: 'input',
        type: 'number',
        required: true,
    },
    {
        name: 'sizes',
        label: 'Kích thước',
        type: 'dynamicArray',
        fields: [
            {
                name: 'sizeName',
                label: 'Kích thước',
                component: 'input',
                type: 'text',
                placeholder: 'Nhập kích thước',
            },
            {
                name: 'price',
                label: 'Giá',
                placeholder: 'Phụ thu',
                component: 'input',
                type: 'number',
            }
        ],
        required: false,
    },
    {
        name: 'temperature',
        label: 'Nhiệt độ',
        component: 'select',
        options: [
            { value: 'hot', label: 'Nóng' },
            { value: 'ice', label: 'Đá' },
            { value: 'hot_ice', label: 'Nóng và Đá' }
        ],
        required: true,
    },
    {
        name: 'isDefaultTemperature',
        label: 'Nhiệt độ mặc định',
        component: 'select',
        options: [
            { value: 'hot', label: 'Nóng' },
            { value: 'ice', label: 'Đá' }
        ],
        required: false,
    },
    {
        name: 'ingredients',
        label: 'Nguyên liệu',
        type: 'dynamicField',
        fields: [
            {
                name: 'ingredientId',
                label: 'Tên nguyên liệu',
                component: 'select',
                options: []
            },
            {
                name: 'amount',
                label: 'Số lượng',
                placeholder: 'Nhập số lượng',
                component: 'input',
                type: 'number',
            }
        ]
    },
    // {
    //     name: 'available',
    //     label: 'Có sẵn',
    //     component: 'switch',
    //     required: true,
    // }
]