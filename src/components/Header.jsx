'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { profilePic } from '../assets/index'
import { ProfileDialog } from './index'
import Image from 'next/image'

const Header = () => {
    const location = usePathname()
    const [isDialogOpen, setisDialogOpen] = useState(false)

    const formatPath = (path) => {
        if (path === '/') return 'Home'

        return path.charAt(1).toUpperCase() + path.slice(2)
    }

    return (
        <>
            <div className="border-b border-gray-100 shadow-sm w-full bg-primary">
                <div className="max-container">
                    <div className="flex justify-between items-center py-[1rem]">
                        <h1>{formatPath(location)}</h1>

                        <Image
                            onClick={() => setisDialogOpen(true)}
                            src={profilePic}
                            alt="User Avatar"
                            className="w-[3rem] h-[3rem] rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            {isDialogOpen && (
                <ProfileDialog setisDialogOpen={setisDialogOpen} />
            )}
        </>
    )
}

export default Header
