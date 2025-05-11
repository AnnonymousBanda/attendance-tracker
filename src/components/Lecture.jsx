import React from 'react'
import { AttendanceButton, CancelClassButton } from '.'

const Lecture = ({ lecture, day, setLectures }) => {
    return (
        <div className="flex flex-row gap-[1rem]">
            <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                <h3 className=" font-bold text-gray-900 w-[4.5rem] text-right">
                    {lecture.from}
                </h3>
                <h3 className="block text-gray-600 w-[4.5rem] text-right">
                    {lecture.to}
                </h3>
            </div>
            <div className="relative border-2 border-gray-200 border-l-black border-l-[0.3rem] bg-primary rounded-xl  px-[2.5rem] py-[3rem] w-full  flex flex-col gap-[2.5rem]">
                <CancelClassButton
                    lecture={lecture}
                    day={day}
                    setLectures={setLectures}
                />
                <h2>
                    {lecture.courseCode}: {lecture.courseName}
                </h2>
                <AttendanceButton
                    lecture={lecture}
                    day={day}
                    setLectures={setLectures}
                />
            </div>
        </div>
    )
}

export default Lecture
