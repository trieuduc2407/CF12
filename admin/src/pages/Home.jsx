import React, { useState } from 'react'
import { ListCollapse } from 'lucide-react'
import Navbar from '../components/Navbar'

const Home = () => {
    const [isPinned, setIsPinned] = useState(false)
    const toggleNavbar = () => {
        setIsPinned(!isPinned)
    }

    return (
        <div className="flex flex-row">
            <div
                className={
                    isPinned ? 'w-64 transition-all' : 'w-20 transition-all'
                }
            >
                <Navbar isPinned={isPinned} />
            </div>
            <div
                className={
                    isPinned ? 'flex-1 transition-all' : 'flex-1 transition-all'
                }
            >
                <button className="text-black" onClick={toggleNavbar}>
                    <ListCollapse size={36} />
                </button>
            </div>
        </div>
    )
}

export default Home
