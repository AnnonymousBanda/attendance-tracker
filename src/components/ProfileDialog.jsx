import { XMarkIcon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { user } from '../assets'
import { FaBookBookmark } from 'react-icons/fa6'
import { HiAcademicCap } from 'react-icons/hi2'
import { IoCalendar } from 'react-icons/io5'
import { MdBugReport, MdLogout, MdOutlineDeveloperMode } from 'react-icons/md'
import { BiSolidBookBookmark } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileDialog({ setisDialogOpen, profile }) {
    const handleClose = () => {
        setisDialogOpen(false)
    }

    return (
        <div onClick={handleClose} className="fixed z-50 inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] flex justify-center items-center">
            <div
                onClick={(e) => e.stopPropagation()}
                className="lg:max-w-[35vw] w-full bg-primary lg:h-[95%] h-full p-[2rem] flex flex-col gap-[2rem] overflow-auto max-container"
            >
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center gap-[0.5rem]">
                        <UserCircleIcon className="w-[2.5rem] h-[2.5rem]" />
                        <h2 className="font-[900] uppercase tracking-wide">
                            Profile
                        </h2>
                    </div>
                    <button onClick={handleClose}>
                        <XMarkIcon className="w-[2.8rem] h-[2.8rem] cursor-pointer" />
                    </button>
                </div>
                <div className="flex flex-col h-full justify-center items-center">
                    <div className="flex justify-center items-center gap-[2rem] w-full p-[1rem] rounded-lg">
                        <Image
                            src={user}
                            alt="User icon"
                            className="w-[8rem] h-[8rem]"
                        />
                        <div className="flex flex-col gap-[0.5rem] justify-center">
                            <h1 className="text-[1.7rem]">
                                John Doe
                            </h1>
                            <h2 className="text-[1.5rem]">2301CS01</h2>
                            <h2 className="text-[1.5rem]">
                                john_2301cs01@iitp.ac.in
                            </h2>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between h-full gap-[1.2rem] w-full">
                        <div className='flex flex-col w-full justify-center items-center p-[1rem] gap-[1rem]'>
                            <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                <BiSolidBookBookmark className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Branch</h3>
                                    <p>Computer Science and Engineering</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                <HiAcademicCap className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Batch</h3>
                                    <p>2023</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                <IoCalendar className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Semester</h3>
                                    <p>4</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full bg-[#d7e4ee] justify-center items-center mt-[4rem] p-[1rem] gap-[1rem] rounded-lg">
                            <div className="w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                                <MdOutlineDeveloperMode className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <p className="font-bold">Developers</p>
                                </div>
                            </div>
                            <Link href='https://forms.gle/DjoRKfTt6NNjepzU9' target='#' className=" w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                                <MdBugReport className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <p className="font-bold">Report a Bug</p>
                                </div>
                            </Link>
                            <div className=" w-full flex justify-center items-center bg-[#fca5a5] p-[1rem] gap-[1rem] rounded-lg">
                                <MdLogout className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <p className="font-bold">Logout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
