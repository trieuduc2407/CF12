const applyFilters = (state) => {
    let filtered = [...state.orders]

    if (state.filters.status && state.filters.status !== 'all') {
        filtered = filtered.filter(
            (order) => order.status === state.filters.status
        )
    }

    if (state.filters.date) {
        const filterDate = new Date(state.filters.date)
        filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt)
            return orderDate.toDateString() === filterDate.toDateString()
        })
    }

    state.filteredOrders = filtered
}

export default applyFilters
