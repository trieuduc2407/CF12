import { useDispatch } from 'react-redux'
import { logoutStaff } from '../store/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return () => {
        dispatch(logoutStaff()).then((data) => {
            if (data?.payload?.success) {
                navigate('/admin/login', { replace: true })
            }
        })
    }
}
