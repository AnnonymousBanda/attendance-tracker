'use client'
import { useState } from 'react'

const DaySelector = ({ days }) => {
    const [selectedDay, setSelectedDay] = useState(days[0])

    return (
        <div className="flex w-full bg-[#F3F8FA] gap-[0.2rem]">
            {days.map((day, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedDay(day)}
                    className={`flex flex-col flex-1 items-center justify-center h-[8rem] text-[1.8rem] font-bold transition-all min-w-0
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
                    <span className="text-[1.8rem] font-bold">{day.name}</span>
                    <span
                        className={`text-[1.8rem] font-bold ${
                            selectedDay.name === day.name
                                ? 'text-black'
                                : 'text-white'
                        }`}
                    >
                        {day.date}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default DaySelector
