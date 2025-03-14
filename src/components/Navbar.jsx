import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Stats, Schedule, Lectures } from '../assets'

const Navbar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path

    return (
        <nav className="w-full bg-primary shadow-[0_-2px_4px_rgba(0,0,0,0.1)] py-[1.5rem]">
            <div className="flex justify-between items-center max-container">
                <Link
                    to="/"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <img
                        src={Home}
                        alt="home"
                        className={`h-[2.5rem] w-[2.5rem] ${
                            isActive('/') ? '' : 'opacity-50'
                        }`}
                    />
                    <p className={`${isActive('/') ? '' : 'opacity-50'}`}>
                        Home
                    </p>
                </Link>
                <Link
                    to="/stats"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <img
                        src={Stats}
                        alt="stats"
                        className={`h-[2.5rem] w-[2.5rem] ${
                            isActive('/stats') ? '' : 'opacity-50'
                        }`}
                    />
                    <p className={`${isActive('/stats') ? '' : 'opacity-50'}`}>
                        Stats
                    </p>
                </Link>
                <Link
                    to="/lectures"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <img
                        src={Lectures}
                        alt="lectures"
                        className={`h-[2.5rem] w-[2.5rem] ${
                            isActive('/lectures') ? '' : 'opacity-50'
                        }`}
                    />
                    <p
                        className={`${
                            isActive('/lectures') ? '' : 'opacity-50'
                        }`}
                    >
                        Lectures
                    </p>
                </Link>
                <Link
                    to="/schedule"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <img
                        src={Schedule}
                        alt="schedule"
                        className={`h-[2.5rem] w-[2.5rem] ${
                            isActive('/schedule') ? '' : 'opacity-50'
                        }`}
                    />
                    <p
                        className={`${
                            isActive('/schedule') ? '' : 'opacity-50'
                        }`}
                    >
                        Schedule
                    </p>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
