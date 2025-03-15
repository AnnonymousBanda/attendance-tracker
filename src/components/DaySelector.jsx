import React from 'react'
import { useState } from 'react'

const DaySelector = ({ days }) => {
    const [selectedDay, setSelectedDay] = useState(days[0])

    return (
        <div className="max-container px-[0.2rem]">
            <div className="flex w-full bg-white gap-[0.2rem]">
                {days.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 flex items-center justify-center h-[8rem] text-[1.8rem] font-bold transition-all min-w-0
                ${
                    selectedDay === day
                        ? 'bg-[#6F8DBD] text-white'
                        : 'bg-[#A0B8D9] text-black'
                }
                ${
                    index === 0
                        ? 'rounded-[1rem] rounded-br-none'
                        : index === days.length - 1
                        ? 'rounded-[1rem] rounded-bl-none'
                        : 'rounded-[1rem]'
                } 
                shadow-md`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default DaySelector
