import React from 'react'
import { AttendanceButton, CancelClassButton } from '.'

const Lecture = ({ fro, to, courseCode, courseName, status }) => {
    return (
        <div className="flex flex-row gap-[1rem]">
            <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                <h3 className=" font-bold text-gray-900 w-[4.5rem] text-right">
                    {fro}
                </h3>
                <h3 className="block text-gray-600 w-[4.5rem] text-right">
                    {to}
                </h3>
            </div>
            <div className="relative border-2 border-gray-200 border-l-black border-l-[0.3rem] bg-primary rounded-xl  px-[2.5rem] py-[3rem] w-full  flex flex-col gap-[2.5rem]">
                <CancelClassButton />
                <h2>
                    {courseCode}: {courseName}
                </h2>
                <AttendanceButton
                    lecture={{ courseCode, courseName, fro, to, status }}
                />
            </div>
        </div>
    )
}

export default Lecture
