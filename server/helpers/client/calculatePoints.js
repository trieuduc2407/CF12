/**
 * Helper functions để tính toán điểm và giá khi thanh toán
 * Quy đổi: 1 điểm = 1,000 VNĐ giảm giá
 * Tích lũy: 1 điểm cho mỗi 10,000 VNĐ (sau khi trừ điểm)
 */

export const POINT_TO_VND = 1000 // 1 điểm = 1,000 VNĐ giảm
export const VND_TO_POINT = 10000 // 10,000 VNĐ = 1 điểm tích lũy

/**
 * Tính toán payment preview khi dùng điểm
 * @param {Number} totalPrice - Tổng tiền order
 * @param {Number} userPoints - Số điểm hiện có của user
 * @param {Number} pointsToUse - Số điểm muốn sử dụng
 * @returns {Object} Payment preview
 */
export const calculatePaymentPreview = (totalPrice, userPoints, pointsToUse) => {
    // Validate
    if (pointsToUse < 0) {
        throw new Error('Số điểm sử dụng không hợp lệ')
    }

    if (pointsToUse > userPoints) {
        throw new Error(
            `Bạn chỉ có ${userPoints} điểm, không thể sử dụng ${pointsToUse} điểm`
        )
    }

    // Tính giảm giá từ điểm
    const pointsDiscount = pointsToUse * POINT_TO_VND

    // Đảm bảo giảm giá không vượt quá tổng tiền
    const actualDiscount = Math.min(pointsDiscount, totalPrice)
    const actualPointsUsed = Math.floor(actualDiscount / POINT_TO_VND)

    // Tính final price sau khi trừ điểm
    const finalPrice = totalPrice - actualDiscount

    // Tính điểm tích lũy dựa trên final price
    const pointsEarned = Math.floor(finalPrice / VND_TO_POINT)

    // Tính thay đổi điểm: trừ điểm dùng, cộng điểm tích lũy
    const pointsChange = pointsEarned - actualPointsUsed
    const totalPoints = userPoints + pointsChange

    return {
        totalPrice,
        pointsUsed: actualPointsUsed,
        pointsDiscount: actualDiscount,
        finalPrice,
        pointsEarned,
        totalPoints,
        pointsChange,
    }
}

/**
 * Tính số điểm tối đa có thể dùng cho order
 * @param {Number} totalPrice - Tổng tiền order
 * @param {Number} userPoints - Số điểm hiện có
 * @returns {Number} Số điểm tối đa có thể dùng
 */
export const getMaxUsablePoints = (totalPrice, userPoints) => {
    // Số điểm cần để giảm hết totalPrice
    const pointsNeeded = Math.ceil(totalPrice / POINT_TO_VND)
    // Lấy min giữa điểm cần và điểm có
    return Math.min(pointsNeeded, userPoints)
}

/**
 * Tính số điểm cần dùng để được giá tròn
 * Ví dụ: 25000 → dùng 5 điểm còn 20000
 * @param {Number} totalPrice - Tổng tiền order
 * @param {Number} userPoints - Số điểm hiện có
 * @returns {Number} Số điểm cần dùng để tròn (hoặc 0 nếu không cần/không đủ)
 */
export const getPointsForRoundPrice = (totalPrice, userPoints) => {
    // Tìm phần dư khi chia cho 10,000
    const remainder = totalPrice % 10000

    if (remainder === 0) {
        return 0 // Đã tròn rồi
    }

    // Số điểm cần để làm tròn xuống
    const pointsNeeded = Math.ceil(remainder / POINT_TO_VND)

    // Kiểm tra có đủ điểm không
    if (pointsNeeded > userPoints) {
        return 0 // Không đủ điểm
    }

    return pointsNeeded
}
