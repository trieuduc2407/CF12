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
            { value: 'milktea', label: 'Trà sữa và trà hoa quả' },
            { value: 'yogurt', label: 'Sữa chua và thức uống khác' },
        ],
        required: true,
    },
    {
        name: 'basePrice',
        label: 'Giá',
        placeholder: 'Nhập giá sản phẩm',
        component: 'input',
        type: 'number',
        useSeparator: true,
        required: true,
    },
    {
        name: 'sizeOption',
        label: 'Tùy chọn kích thước',
        component: 'select',
        options: [
            { value: 'single', label: 'Không up size' },
            { value: 'upsize', label: 'Có upsize' },
        ],
        required: true,
    },
    {
        name: 'upsizePrice',
        label: 'Phụ thu upsize lên L',
        placeholder: 'Nhập phụ thu upsize',
        component: 'input',
        type: 'number',
        useSeparator: true,
        required: false,
    },
    {
        name: 'temperature',
        label: 'Nhiệt độ',
        component: 'select',
        options: [
            { value: 'hot', label: 'Nóng' },
            { value: 'ice', label: 'Đá' },
            { value: 'hot_ice', label: 'Nóng và Đá' },
        ],
        required: true,
    },
    {
        name: 'isDefaultTemperature',
        label: 'Nhiệt độ mặc định',
        component: 'select',
        options: [
            { value: 'hot', label: 'Nóng' },
            { value: 'ice', label: 'Đá' },
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
                options: [],
            },
            {
                name: 'amount',
                label: 'Số lượng',
                placeholder: 'Nhập số lượng',
                component: 'input',
                type: 'number',
                useSeparator: true,
            },
        ],
    },
    // {
    //     name: 'available',
    //     label: 'Có sẵn',
    //     component: 'switch',
    //     required: true,
    // }
]
