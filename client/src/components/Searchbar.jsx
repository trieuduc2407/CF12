// ===== IMPORTS =====
import { Search, X } from 'lucide-react'

// ===== COMPONENT =====
const Searchbar = ({ searchName, onChange, value, onBlur, onClose }) => {
    // ===== RENDER =====
    return (
        <div className="md:w-xl mb-5 flex justify-center rounded-lg bg-white py-4 xl:w-full">
            <label className="input flex w-[95%] items-center justify-around rounded-lg bg-transparent focus-within:border-transparent focus-within:outline-none focus-within:ring-0">
                <div className="flex w-full items-center rounded-lg bg-gray-100 p-2.5 focus:outline-0">
                    <Search className="text-gray-400" />
                    <input
                        id="menu-search"
                        type="search"
                        className="grow bg-gray-100 outline-none focus:outline-none focus:ring-0"
                        placeholder={`Bạn đang cần tìm ${searchName} gì ?`}
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                        autoComplete="off"
                    />
                </div>
                {onClose && (
                    <button
                        type="button"
                        className="btn btn-sm btn-circle ml-2 border-0 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-0"
                        onClick={onClose}
                        onMouseDown={(e) => e.preventDefault()}
                        tabIndex={0}
                        aria-label="Đóng tìm kiếm"
                    >
                        <X size={18} />
                    </button>
                )}
            </label>
        </div>
    )
}

// ===== EXPORTS =====
export default Searchbar
