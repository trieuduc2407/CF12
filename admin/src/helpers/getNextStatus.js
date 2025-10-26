const statusOptions = ['pending', 'preparing', 'served', 'paid', 'cancelled']

const getNextStatus = (currentStatus) => {
    const currentIndex = statusOptions.indexOf(currentStatus)
    if (currentIndex === 3) return null
    const nextIndex = (currentIndex + 1) % statusOptions.length
    return statusOptions[nextIndex]
}

export default getNextStatus
