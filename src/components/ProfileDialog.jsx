import { XMarkIcon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { user } from '../assets'

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
                className="md:w-[40vw] w-[95%] max-h-[95%] bg-white p-[2rem] rounded-lg shadow-lg flex flex-col gap-[2rem]"
            >
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center gap-[0.5rem]">
                        <UserCircleIcon className="w-[2.5rem] h-[2.5rem]" />
                        <h2 className="font-bold uppercase tracking-wide">
                            Profile
                        </h2>
                    </div>
                    <button onClick={handleClose}>
                        <XMarkIcon className="w-[2.8rem] h-[2.8rem] cursor-pointer" />
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center gap-[4rem]">
                    <img
                        src={user}
                        alt="User icon"
                        className="w-[12rem] h-[12rem]"
                    />
                    <div className="flex flex-col gap-[1.2rem] w-full">
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Name
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p>John Doe</p>
                        </div>
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Roll Number
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p>2301CS01</p>
                        </div>
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Branch
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p>Computer Science and Engineering</p>
                        </div>
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Email
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p className="break-all">
                                john_2301cs01@iitp.ac.in
                            </p>
                        </div>
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Semester
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p className="break-all">4</p>
                        </div>
                        <div className="flex w-full items-center">
                            <p className="font-bold w-[10rem] flex-shrink-0">
                                Batch
                            </p>{' '}
                            <p className="font-bold mr-4">:</p>
                            <p>2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
