import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = () => {
    const location = useLocation()

    const getHearderContent = () => {
        switch (location.pathname) {
            case '/schedule':
                return (
                    <div className="flex justify-between items-center py-4 px-8">
                        <h1 className="text-4xl font-medium font-[Plus Jakarta Sans]">Schedule</h1>
                        <img
                            src="/images/user-avatar.png"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                )
            case '/timetable':
                return (
                    <div className="flex justify-between items-center py-4 px-8">
                        <h1 className="text-4xl font-medium font-[Plus Jakarta Sans]">Timetable</h1>

                        <img
                            src="/images/user-avatar.png"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="border-b border-gray-100 shadow-sm">
            {getHearderContent()}
        </div>
    )
}

export default Header
