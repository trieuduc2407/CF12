const requireRoleMiddleware = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.json({
            success: false,
            message: "Không có quyền truy cập"
        })
    }
    next()
}

export { requireRoleMiddleware }