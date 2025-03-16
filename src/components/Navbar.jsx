'use client'
import Image from 'next/image'
import { Home, Lectures, Schedule, Stats } from '../assets'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const location = usePathname()
    const isActive = (path) => location === path

    return (
        <nav className="w-full bg-primary shadow-[0_-2px_4px_rgba(0,0,0,0.1)] py-[1.5rem]">
            <div className="flex justify-between items-center max-container">
                <Link
                    href="/"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <Image
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
                    href="/stats"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <Image
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
                    href="/lectures"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <Image
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
                    href="/schedule"
                    className="flex flex-col justify-center items-center gap-[0.1rem]"
                >
                    <Image
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
