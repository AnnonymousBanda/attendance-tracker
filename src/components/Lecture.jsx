import React from 'react'
import { MdClose } from 'react-icons/md'
import { Button } from '.'

const Lecture = ({ fro, to, courseCode, courseName, status }) => {
    return (
        <div className="flex flex-row gap-[1rem]">
            <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                <h3 className=" font-bold text-gray-900 w-[4.5rem] text-right">{fro}</h3>
                <h3 className="block text-gray-600 w-[4.5rem] text-right">{to}</h3>
            </div>
            <div className="relative border-2 border-gray-200 border-l-black border-l-[0.3rem] bg-primary rounded-xl  px-[2.5rem] py-[3rem] w-full  flex flex-col gap-[2.5rem]">
                <div className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors text-xl font-semibold ">
                    <MdClose size={24} />
                </div>
                <h2>
                    {courseCode}: {courseName}
                </h2>
                <Button lecture={{courseCode, courseName, fro, to, status}} />
            </div>
        </div>
    )
}

export default Lecture
