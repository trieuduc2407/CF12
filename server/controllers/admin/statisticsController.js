import * as statisticsService from '../../services/admin/statisticsService.js'

export const getOverview = async (req, res) => {
    try {
        const overview = await statisticsService.getOverview()
        res.status(200).json({ success: true, data: overview })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getRevenue = async (req, res) => {
    try {
        const { period = 'day' } = req.query
        const revenue = await statisticsService.getRevenue(period)
        res.status(200).json({ success: true, data: revenue })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        const topProducts = await statisticsService.getTopProducts(
            parseInt(limit)
        )
        res.status(200).json({ success: true, data: topProducts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}
