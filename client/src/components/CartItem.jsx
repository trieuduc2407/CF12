import { useNavigate, useParams } from 'react-router-dom'

const CartItem = ({ item }) => {
    const navigate = useNavigate()
    const { tableName } = useParams()

    const handleEdit = () => {
        navigate(
            `/tables/${tableName}/product/${item.product._id}/edit/${item.itemId}`
        )
    }

    return (
        <div className="flex rounded-lg bg-white p-2.5">
            <div className="flex flex-1 gap-4">
                <img
                    className="w-20 rounded-lg"
                    src={item.product.imageUrl}
                    alt=""
                />
                <div className="flex flex-col justify-between">
                    <p className="text-sm">
                        <span className="text-primary">{item.quantity} x</span>{' '}
                        {item.product.name}
                    </p>
                    <p className="text-sm">
                        {item.subTotal.toLocaleString()} đ
                    </p>
                </div>
            </div>
            <button className="flex flex-col justify-end" onClick={handleEdit}>
                <p className="text-primary text-sm">Chỉnh sửa</p>
            </button>
        </div>
    )
}

export default CartItem
