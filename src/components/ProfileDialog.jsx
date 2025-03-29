'use client'

import { XMarkIcon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { profilePic } from '@/assets'
import { HiAcademicCap } from 'react-icons/hi2'
import { IoCalendar } from 'react-icons/io5'
import {
    MdBugReport,
    MdLogout,
    MdModeEdit,
    MdOutlineDeveloperMode,
} from 'react-icons/md'
import { BiSolidBookBookmark } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context'
import { useState } from 'react'
import { modifySemester } from '@/firebase/api/firebase.firestore'
import toast from 'react-hot-toast'

export default function ProfileDialog({ setisDialogOpen }) {
    const handleClose = () => {
        setisDialogOpen(false)
    }
    const { user } = useAuth()
    const [edit, setEdit] = useState(false)
    const [semester, setSemester] = useState(user?.semester)
    const [loading, setLoading] = useState(false)

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleCancel = () => {
        setEdit(false)
        setSemester(user?.semester)
    }
    const handleChangeSem = async () => {
        setLoading(true)
        try {
            const res = await modifySemester(user?.userID, semester)
            if (res.status !== 200) throw new Error(res.message)

            console.log(semester)
            setEdit(false)
            setSemester(semester)
            toast.success('Semester updated', { className: 'toast-success' })
            setLoading(false)
        } catch (error) {
            toast.error(error.message, { className: 'toast-error' })
            setLoading(false)
        }
    }

    return (
        <div
            onClick={handleClose}
            className="fixed z-50 inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] flex justify-center items-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="lg:max-w-[35vw] w-full bg-primary h-full p-[2rem] flex flex-col gap-[2rem] overflow-auto max-container"
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
                            src={profilePic}
                            alt="User icon"
                            className="w-[8rem] h-[8rem]"
                        />
                        <div className="flex flex-col gap-[0.5rem] justify-center">
                            <h1 className="text-[1.7rem]">{user?.name}</h1>
                            <h2 className="text-[1.5rem]">{user?.roll}</h2>
                            <h2 className="text-[1.5rem]">{user?.email}</h2>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between h-full gap-[1.2rem] w-full">
                        <div className="flex flex-col w-full justify-center items-center p-[1rem] gap-[1rem]">
                            <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                <BiSolidBookBookmark className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Branch</h3>
                                    <p>{user?.branch}</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                <HiAcademicCap className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Batch</h3>
                                    <p>{user?.batch}</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg relative">
                                <IoCalendar className="w-[3.3rem] h-[4rem]" />
                                <div className="flex flex-col flex-1 w-full justify-center">
                                    <h3 className="font-bold">Semester</h3>
                                    <input
                                        onChange={(e) =>
                                            setSemester(e.target.value)
                                        }
                                        type="number"
                                        defaultValue={semester}
                                        disabled={!edit}
                                        className={`w-[5rem] text-[1rem] md:text-[1.3rem] p-[0.3rem] ${
                                            edit
                                                ? 'bg-white rounded-lg'
                                                : 'border-none'
                                        }`}
                                    />
                                </div>
                                <button
                                    disabled={edit}
                                    onClick={handleEdit}
                                    className={`bg-secondary p-[0.5rem] rounded-lg cursor-pointer transition-colors duration-300 ${
                                        edit
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-black'
                                    }`}
                                >
                                    <MdModeEdit className="w-[2rem] text-primary h-[2rem]" />
                                </button>
                                {edit && (
                                    <div className="flex gap-[0.5rem] justify-center items-center absolute bottom-[-4rem] right-0">
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red p-[0.5rem] rounded-lg cursor-pointer hover:bg-red-600 transition-colors duration-100"
                                        >
                                            <h3 className="uppercase">
                                                cancel
                                            </h3>
                                        </button>
                                        <button
                                            onClick={handleChangeSem}
                                            className={`bg-green p-[0.5rem] rounded-lg cursor-pointer hover:bg-green-600 transition-colors duration-100 ${
                                                loading
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            <h3 className="uppercase">Save</h3>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full bg-[#d7e4ee] justify-center items-center mt-[4rem] p-[1rem] gap-[1rem] rounded-lg">
                            <Link
                                href="https://forms.gle/DjoRKfTt6NNjepzU9"
                                target="#"
                                className=" w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg"
                            >
                                <MdBugReport className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Report a Bug</h3>
                                </div>
                            </Link>
                            <div className=" w-full flex justify-center items-center bg-red-300 p-[1rem] gap-[1rem] rounded-lg">
                                <MdLogout className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold uppercase">
                                        Logout
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
