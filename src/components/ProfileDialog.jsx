import { XMarkIcon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { user } from '../assets'
import { FaBookBookmark } from 'react-icons/fa6'
import { HiAcademicCap } from 'react-icons/hi2'
import { IoCalendar } from 'react-icons/io5'
import { MdBugReport, MdLogout, MdOutlineDeveloperMode } from 'react-icons/md'
import { BiSolidBookBookmark } from "react-icons/bi";
import Image from 'next/image'

export default function ProfileDialog({ setisDialogOpen, profile }) {
    const handleClose = () => {
        setisDialogOpen(false)
    }

    return (
        <div
            onClick={handleClose}
            className="fixed inset-0 z-[99999] bg-[rgba(0,0,0,0.5)] flex justify-center items-center backdrop-blur-[7px]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="md:w-[35%] w-[95%] max-h-[95%] bg-white p-[2rem] rounded-lg shadow-lg flex flex-col gap-[2rem] overflow-auto"
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
                <div className="flex flex-col justify-center items-center gap-[3rem]">
                    <div className="flex justify-center items-center gap-[2rem] w-fit">
                        <Image
                            src={user}
                            alt="User icon"
                            className="w-[8rem] h-[8rem]"
                        />
                        <div className="flex flex-col gap-[0.5rem] w-full justify-center">
                            <h2 className="font-bold text-[1.7rem]">John Doe</h2>
                            <h2 className="text-[1.5rem]">2301CS01</h2>
                            <h2 className="text-[1.5rem]">
                                john_2301cs01@iitp.ac.in
                            </h2>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1.2rem] w-full">
                        <div className="flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                            <BiSolidBookBookmark className="w-[3.3rem] h-[4rem]" />
                            <div className="flex flex-col w-full justify-center">
                                <p className="font-bold">Branch</p>
                                <p>Computer Science and Engineering</p>
                            </div>
                        </div>
                        <div className="flex justify-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                            <HiAcademicCap className="w-[3.3rem] h-[4rem]" />
                            <div className="flex flex-col w-full justify-center">
                                <p className="font-bold">Batch</p>
                                <p>2023</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                            <IoCalendar className="w-[3.3rem] h-[4rem]" />
                            <div className="flex flex-col w-full justify-center">
                                <p className="font-bold">Semester</p>
                                <p>4</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full bg-tertiary justify-center items-center mt-[4rem] p-[1rem] gap-[1rem] rounded-lg">
                            <div className="w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                                <MdOutlineDeveloperMode className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <p className="font-bold">Developers</p>
                                </div>
                            </div>
                            <div className=" w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg">
                                <MdBugReport className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <p className="font-bold">Report a Bug</p>
                                </div>
                            </div>
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
