const requireRoleMiddleware =
    (...roles) =>
    (req, res, next) => {
        const allowedRoles = roles.flat()
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.json({
                success: false,
                message: 'Không có quyền truy cập',
            })
        }
        next()
    }

export { requireRoleMiddleware }
