import React from 'react'
import Header from '../../components/Header/Header'
import { Search } from 'lucide-react'
// import "./Menu.css"

const Menu = () => {
    return (
        <>
            <Header />
            <div className="wrapper">
                <div className="left-box">
                    <div className="title">Thực đơn</div>
                    <div className="menu-bar">
                        <div className="menu-item">abc</div>
                        <div className="menu-item">abc</div>
                        <div className="menu-item">abc</div>
                        <div className="menu-item">abc</div>
                        <div className="menu-item">abc</div>
                        <div className="menu-item">abc</div>
                    </div>
                </div>
                <div className="menu">
                    <div className="desktop-searchbar">
                        <Search />
                        <input type="text" name="search-text" id="" />
                    </div>
                </div>
                <div className="right-box"></div>
            </div>
        </>
    )
}

export default Menu
