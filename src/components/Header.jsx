'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { profilePic } from '../assets/index'
import { ProfileDialog } from './index'
import Image from 'next/image'
import axios from 'axios'

const Header = () => {
    const location = usePathname()
    const [isDialogOpen, setisDialogOpen] = useState(false)
    const [profilePicture, setProfilePic] = useState(profilePic)

    const formatPath = (path) => {
        if (path === '/') return 'Home'

        return path.charAt(1).toUpperCase() + path.slice(2)
    }

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken')

                if (!accessToken) {
                    return
                }

                const res = await axios.get(
                    'https://graph.microsoft.com/v1.0/me/photo/$value',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        responseType: 'blob',
                    }
                )

                if (res.status !== 200) return

                const url = URL.createObjectURL(res.data)
                setProfilePic(url)
            } catch (error) {
                setProfilePic(profilePic)
            }
        }

        fetchProfilePic()
    }, [])

    return (
        <>
            <div className="border-b border-gray-100 shadow-sm w-full bg-primary">
                <div className="max-container">
                    <div className="flex justify-between items-center py-[1rem]">
                        <h1>{formatPath(location)}</h1>

                        <Image
                            onClick={() => setisDialogOpen(true)}
                            src={profilePicture}
                            alt="User Avatar"
                            width={400}
                            height={400}
                            className="w-[3rem] h-[3rem] rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            {isDialogOpen && (
                <ProfileDialog
                    profilePicture={profilePicture}
                    setisDialogOpen={setisDialogOpen}
                />
            )}
        </>
    )
}

export default Header
