// ===== IMPORTS =====
import { Outlet } from 'react-router-dom'

// ===== COMPONENT =====
const BaseLayout = ({ children }) => {
    return (
        <div className="m-auto max-w-7xl">
            {children}
            <Outlet />
        </div>
    )
}

// ===== EXPORTS =====
export default BaseLayout
