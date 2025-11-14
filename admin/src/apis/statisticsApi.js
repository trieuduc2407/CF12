import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const getOverview = async () => {
    const response = await axios.get(
        `${API_URL}/api/admin/statistics/overview`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export const getRevenue = async (period = 'day') => {
    const response = await axios.get(
        `${API_URL}/api/admin/statistics/revenue`,
        {
            params: { period },
            withCredentials: true,
        }
    )
    return response.data
}

export const getTopProducts = async (limit = 10) => {
    const response = await axios.get(
        `${API_URL}/api/admin/statistics/top-products`,
        {
            params: { limit },
            withCredentials: true,
        }
    )
    return response.data
}
