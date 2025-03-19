import React from 'react'
import { MdClose } from 'react-icons/md'

const Lecture = ({ fro, to, courseCode, courseName, status }) => {
    return (
        <div className="flex flex-row gap-[1rem]">
            <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                <p className=" font-bold text-gray-900">{fro}</p>
                <p className="block text-gray-600">{to}</p>
            </div>
            <div className="relative border-l-5 bg-primary rounded-xl  px-[2.5rem] py-[3rem] shadow-md w-full  flex flex-col gap-[2.5rem]">
                <div className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors text-xl font-semibold ">
                    <MdClose size={24} />
                </div>
                <h2>
                    {courseCode}: {courseName}
                </h2>
                <div className="flex gap-[1rem]">
                    <button
                        className={`bg-green-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'present' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>present</p>
                    </button>
                    <button
                        className={`bg-red-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'absent' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>absent</p>
                    </button>
                    <button
                        className={`bg-yellow-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'sick' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>sick</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Lecture
