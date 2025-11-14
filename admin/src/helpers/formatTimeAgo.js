export const formatTimeAgo = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) {
        return 'vừa xong'
    } else if (minutes < 60) {
        return `${minutes} phút trước`
    } else if (hours < 24) {
        return `${hours} giờ trước`
    } else {
        return `${days} ngày trước`
    }
}
