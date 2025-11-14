import { orderModel as Order } from '../../models/orderModel.js'

const VN_TIMEZONE_OFFSET = 7 * 60 * 60 * 1000

export const getOverview = async () => {
    const nowVN = new Date(Date.now() + VN_TIMEZONE_OFFSET)
    const todayVN = new Date(nowVN)
    todayVN.setHours(0, 0, 0, 0)

    const todayUTC = new Date(todayVN.getTime() - VN_TIMEZONE_OFFSET)
    const tomorrowUTC = new Date(todayUTC)
    tomorrowUTC.setDate(tomorrowUTC.getDate() + 1)

    const todayOrders = await Order.find({
        createdAt: { $gte: todayUTC, $lt: tomorrowUTC },
        status: { $in: ['preparing', 'ready', 'served', 'paid'] },
    })

    const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
    )

    const todaySales = todayOrders.reduce(
        (sum, order) =>
            sum + order.items.reduce((s, item) => s + item.quantity, 0),
        0
    )

    return {
        todayRevenue,
        todaySales,
    }
}

export const getRevenue = async (period = 'day') => {
    const nowVN = new Date(Date.now() + VN_TIMEZONE_OFFSET)
    let startDate
    let groupBy

    switch (period) {
        case 'day':
            const todayVN = new Date(nowVN)
            todayVN.setHours(0, 0, 0, 0)
            startDate = new Date(todayVN.getTime() - VN_TIMEZONE_OFFSET)
            groupBy = {
                hour: { $hour: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
            }
            break
        case 'week':
            const weekStartVN = new Date(nowVN)
            weekStartVN.setDate(weekStartVN.getDate() - 7)
            weekStartVN.setHours(0, 0, 0, 0)
            startDate = new Date(weekStartVN.getTime() - VN_TIMEZONE_OFFSET)
            groupBy = {
                year: { $year: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
                month: { $month: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
                day: {
                    $dayOfMonth: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] },
                },
            }
            break
        case 'month':
            const monthStartVN = new Date(nowVN)
            monthStartVN.setDate(monthStartVN.getDate() - 30)
            monthStartVN.setHours(0, 0, 0, 0)
            startDate = new Date(monthStartVN.getTime() - VN_TIMEZONE_OFFSET)
            groupBy = {
                year: { $year: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
                month: { $month: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
                day: {
                    $dayOfMonth: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] },
                },
            }
            break
        case 'year':
            const yearStartVN = new Date(nowVN)
            yearStartVN.setMonth(yearStartVN.getMonth() - 12)
            yearStartVN.setHours(0, 0, 0, 0)
            startDate = new Date(yearStartVN.getTime() - VN_TIMEZONE_OFFSET)
            groupBy = {
                year: { $year: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
                month: { $month: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
            }
            break
        default:
            const defaultStartVN = new Date(nowVN)
            defaultStartVN.setHours(0, 0, 0, 0)
            startDate = new Date(defaultStartVN.getTime() - VN_TIMEZONE_OFFSET)
            groupBy = {
                hour: { $hour: { $add: ['$createdAt', VN_TIMEZONE_OFFSET] } },
            }
    }

    const revenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                status: { $in: ['preparing', 'ready', 'served', 'paid'] },
            },
        },
        {
            $group: {
                _id: groupBy,
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1,
                '_id.hour': 1,
            },
        },
    ])

    return revenue.map((item) => {
        let label
        if (period === 'day') {
            label = `${item._id.hour}:00`
        } else if (period === 'year') {
            label = `T${item._id.month}/${item._id.year}`
        } else {
            label = `${item._id.day}/${item._id.month}`
        }

        return {
            label,
            revenue: item.revenue,
            orders: item.orders,
        }
    })
}

export const getTopProducts = async (limit = 10) => {
    const topProducts = await Order.aggregate([
        {
            $match: {
                status: { $in: ['preparing', 'ready', 'served', 'paid'] },
            },
        },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.productName',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: '$items.subTotal' },
            },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit },
    ])

    return topProducts.map((item) => ({
        name: item._id,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
    }))
}
