import React from 'react'
import { useLocation } from 'react-router-dom'
import { user } from '../assets'

const Header = () => {
    const location = useLocation()

    const formatPath = (path) => {
        if (path === '/') return 'Home'

        return path.charAt(1).toUpperCase() + path.slice(2)
    }

    return (
        <div className="border-b border-gray-100 shadow-sm w-full">
            <div className="max-container">
                <div className="flex justify-between items-center py-[1rem]">
                    <h1>{formatPath(location.pathname)}</h1>

                    <img
                        src={user}
                        alt="User Avatar"
                        className="w-[3rem] h-[3rem] rounded-full cursor-pointer"
                    />
                </div>
            </div>
        </div>
    )
}

export default Header
