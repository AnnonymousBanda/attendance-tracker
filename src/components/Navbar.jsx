import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Library, Present, Schedule } from '../assets'

const Navbar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path

    return (
        <nav className="w-full bg-primary shadow-[0_-2px_4px_rgba(0,0,0,0.1)] py-[1rem]">
            <div className="flex justify-between items-center max-container">
                <Link to="/">
                    <img
                        src={Home}
                        alt="home"
                        className={`h-[3rem] w-[3rem] ${
                            isActive('/') ? '' : 'opacity-50'
                        }`}
                    />
                </Link>
                <Link to="/stats">
                    <img
                        src={Library}
                        alt="stats"
                        className={`h-[3rem] w-[3rem] ${
                            isActive('/stats') ? '' : 'opacity-50'
                        }`}
                    />
                </Link>
                <Link to="/timetable">
                    <img
                        src={Present}
                        alt="timetable"
                        className={`h-[3rem] w-[3rem] ${
                            isActive('/timetable') ? '' : 'opacity-50'
                        }`}
                    />
                </Link>
                <Link to="/schedule">
                    <img
                        src={Schedule}
                        alt="schedule"
                        className={`h-[3rem] w-[3rem] ${
                            isActive('/schedule') ? '' : 'opacity-50'
                        }`}
                    />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
