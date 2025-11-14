import { orderModel as Order } from '../../models/orderModel.js'

export const getOverview = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayOrders = await Order.find({
        createdAt: { $gte: today, $lt: tomorrow },
        status: { $in: ['preparing', 'ready', 'served', 'paid'] },
    })

    console.log('[statisticsService] Today orders count:', todayOrders.length)

    const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
    )

    const todaySales = todayOrders.reduce(
        (sum, order) =>
            sum + order.items.reduce((s, item) => s + item.quantity, 0),
        0
    )

    console.log(
        '[statisticsService] Today revenue:',
        todayRevenue,
        'Sales:',
        todaySales
    )

    return {
        todayRevenue,
        todaySales,
    }
}

export const getRevenue = async (period = 'day') => {
    const now = new Date()
    let startDate
    let groupBy

    switch (period) {
        case 'day':
            startDate = new Date(now)
            startDate.setHours(0, 0, 0, 0)
            groupBy = {
                hour: { $hour: '$createdAt' },
            }
            break
        case 'week':
            startDate = new Date(now)
            startDate.setDate(startDate.getDate() - 7)
            startDate.setHours(0, 0, 0, 0)
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            }
            break
        case 'month':
            startDate = new Date(now)
            startDate.setDate(startDate.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            }
            break
        case 'year':
            startDate = new Date(now)
            startDate.setMonth(startDate.getMonth() - 12)
            startDate.setHours(0, 0, 0, 0)
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            }
            break
        default:
            startDate = new Date(now)
            startDate.setHours(0, 0, 0, 0)
            groupBy = {
                hour: { $hour: '$createdAt' },
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

    console.log('[statisticsService] Top products:', topProducts)

    return topProducts.map((item) => ({
        name: item._id,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
    }))
}
