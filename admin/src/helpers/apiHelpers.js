import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Axios interceptor để tự động thêm token vào tất cả requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Helper function để tạo axios request với error handling
 */
export const apiRequest = async (method, url, data = null, config = {}) => {
    try {
        const response = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            ...config,
        })
        return response?.data
    } catch (error) {
        console.error(`API Error [${method}] ${url}:`, error)
        throw error
    }
}

/**
 * CRUD helpers - sử dụng cho createAsyncThunk
 */
export const crudHelpers = {
    getAll: (endpoint) => async () => {
        return await apiRequest('GET', `${endpoint}/all`)
    },

    getById: (endpoint) => async (id) => {
        return await apiRequest('GET', `${endpoint}/get/${id}`)
    },

    create:
        (endpoint, contentType = 'application/json') =>
        async (formData) => {
            return await apiRequest('POST', `${endpoint}/add`, formData, {
                headers: { 'Content-Type': contentType },
            })
        },

    update:
        (endpoint, contentType = 'application/json') =>
        async ({ id, formData }) => {
            return await apiRequest(
                'PUT',
                `${endpoint}/update/${id}`,
                formData,
                {
                    headers: { 'Content-Type': contentType },
                }
            )
        },

    delete: (endpoint) => async (id) => {
        return await apiRequest('DELETE', `${endpoint}/delete/${id}`)
    },

    search: (endpoint) => async (query) => {
        return await apiRequest('GET', `${endpoint}/search?query=${query}`)
    },
}

/**
 * Standard reducer cases cho loading states
 */
export const createLoadingReducers = (builder, thunk, dataKey = 'items') => {
    builder
        .addCase(thunk.pending, (state) => {
            state.isLoading = true
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.isLoading = false
            state[dataKey] = action.payload?.data || action.payload || []
        })
        .addCase(thunk.rejected, (state) => {
            state.isLoading = false
            state[dataKey] = []
        })
}
