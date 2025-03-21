'use client'
import { modifyAttendance } from '@/firebase/api'
import { useEffect, useState } from 'react'
import { MdOutlineSick, MdSick } from 'react-icons/md'
import { PiHandPalmDuotone } from 'react-icons/pi'
import { RxCrossCircled } from 'react-icons/rx'

function AttendanceButton({ lecture, date, setLecture }) {
    const [status, setStatus] = useState(lecture.status)

    useEffect(() => {
        setStatus(lecture.status)
    }, [lecture])

    const handleClick = async (status) => {
        try {
            const res = await modifyAttendance(
                '1',
                '4',
                lecture.to,
                lecture.from,
                date,
                lecture.courseCode,
                status
            )

            if (!res) throw new Error('Failed to cancel class')

            if (res.status !== 200) throw new Error(res.message)

            setStatus(status)
            setLecture(res.data)

            console.log(res)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="flex gap-[1.5rem]">
            <button
                onClick={() => handleClick('present')}
                className={`bg-green text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    status === 'present'
                        ? 'hover:cursor-default opacity-40'
                        : ''
                }`}
            >
                <div className="flex p-[0.3rem] justify-center items-center">
                    <PiHandPalmDuotone
                        strokeWidth={5}
                        stroke="#000"
                        fill="#000"
                        className="w-[2rem] h-[2rem]"
                    />
                </div>
            </button>
            <button
                onClick={() => handleClick('absent')}
                className={`bg-red text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    status === 'absent' ? 'hover:cursor-default opacity-40' : ''
                }`}
            >
                <div className="flex  p-[0.3rem] justify-center items-center">
                    <RxCrossCircled
                        strokeWidth={0.8}
                        stroke="#000"
                        color="#000"
                        fill="#000"
                        className="w-[2rem] h-[2rem]"
                    />
                </div>
            </button>
            <button
                onClick={() => handleClick('medical')}
                className={`bg-yellow text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    status === 'medical'
                        ? 'hover:cursor-default opacity-40'
                        : ''
                }`}
            >
                <div className="flex  p-[0.3rem] justify-center items-center">
                    <MdOutlineSick
                        strokeWidth={0.01}
                        stroke="#000"
                        color="#000"
                        className="w-[2rem] h-[2rem]"
                    />
                </div>
            </button>
        </div>
    )
}

export default AttendanceButton
