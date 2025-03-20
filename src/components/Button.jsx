'use client'
import { useState } from 'react'
import { MdOutlineSick, MdSick } from 'react-icons/md'
import { PiHandPalmBold, PiHandPalmDuotone } from 'react-icons/pi'
import { RxCrossCircled } from 'react-icons/rx'

function Button({ lecture }) {
    const [status, setStatus] = useState(lecture.status)
    const handleClick = (status) => {
        setStatus(status)
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
                        stroke="#d6f6f6"
                        fill="#d6f6f6"
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
                        stroke="#d6f6f6"
                        color="#d6f6f6"
                        fill="#d6f6f6"
                        className="w-[2rem] h-[2rem]"
                    />
                </div>
            </button>
            <button
                onClick={() => handleClick('medical')}
                className={`bg-yellow text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    status === 'medical' ? 'hover:cursor-default opacity-40' : ''
                }`}
            >
                <div className="flex  p-[0.3rem] justify-center items-center">
                    <MdOutlineSick
                        strokeWidth={0.01}
                        stroke="#d6f6f6"
                        color="#d6f6f6"
                        className="w-[2rem] h-[2rem]"
                    />
                </div>
            </button>
        </div>
    )
}

export default Button
