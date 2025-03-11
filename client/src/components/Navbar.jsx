import React from 'react'

import { Home, Library, Present, Schedule } from '../assets'

const Navbar = () => {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t py-2">
            <div className="flex justify-around items-center">
                <button className="text-gray-600 hover:text-black">
                    <img src={Home} alt="home" />
                </button>
                <button className="text-gray-600 hover:text-black">
                    <img src={Library} alt="library" />
                </button>
                <button className="text-gray-600 hover:text-black">
                    <img src={Present} alt="present" />
                </button>
                <button className="text-gray-600 hover:text-black">
                    <img src={Schedule} alt="schedule" />
                </button>
            </div>
        </nav>
    )
}

export default Navbar
