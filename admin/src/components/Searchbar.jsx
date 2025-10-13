import { Search } from 'lucide-react'

const Searchbar = ({ searchName, onChange }) => {
    return (
        <div className="mb-5 flex justify-center rounded-lg bg-white py-2.5">
            <label className="input w-[95%] rounded-lg bg-gray-100">
                <Search className="text-gray-400" />
                <input
                    id="menu-search"
                    type="search"
                    className="grow"
                    placeholder={`Bạn đang cần tìm ${searchName} gì ?`}
                    onChange={onChange}
                />
            </label>
        </div>
    )
}

export default Searchbar
