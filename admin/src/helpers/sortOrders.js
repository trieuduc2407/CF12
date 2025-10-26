const statusPriority = {
    pending: 1,
    preparing: 2,
    ready: 3,
    served: 4,
    paid: 5,
    cancelled: 6,
}

const sortOrders = (orders) => {
    if (!Array.isArray(orders)) return []
    return [...orders].sort((a, b) => {
        const statusA = statusPriority[a.status] || 0
        const statusB = statusPriority[b.status] || 0
        if (statusA !== statusB) return statusA - statusB
        return a.createdAt - b.createdAt
    })
}

export default sortOrders
