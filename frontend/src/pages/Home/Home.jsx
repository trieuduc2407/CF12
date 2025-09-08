import React from 'react'
import Header from '../../components/Header/Header'

const Home = () => {
    return (
        <>
            <Header />
            <div className="card bg-red-300 rounded-box grid h-20 grow place-items-center">
                    Nhập số điện thoại để tích điểm
                </div>
            <div className="flex w-full">
                <div className="card bg-base-300 rounded-box grid h-20 grow place-items-center">
                    content
                </div>
                <div className="divider divider-horizontal">OR</div>
                <div className="card bg-blue-500 bg-opacity-50 rounded-box grid h-20 grow place-items-center">
                    content
                </div>
            </div>
        </>
    )
}

export default Home
