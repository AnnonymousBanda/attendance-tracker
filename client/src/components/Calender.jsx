import React, { useState } from 'react'

const Calender = ({ days }) => {
    const [selectedDay, setSelectedDay] = useState(days[0])

    return (
        <div className="flex w-full bg-[#A0B8D9] p-[0.8rem] rounded-[0.5rem] mx-auto justify-between">
            {days.map((day, index) => (
                <div
                    key={index}
                    className={`flex-1 flex flex-col items-center relative ${
                        index !== days.length - 1
                            ? 'border-r-[0.15rem] border-white'
                            : ''
                    }`}
                >
                    <button
                        onClick={() => setSelectedDay(day)}
                        className={`flex flex-col items-center w-full h-[5rem] justify-center rounded-[0.3rem] transition-all ${
                            selectedDay.name === day.name
                                ? 'bg-white text-[#2E5D94] font-bold'
                                : 'bg-[#A0B8D9] text-black'
                        }`}
                    >
                        <span className="text-[1.8rem] font-bold">
                            {day.name}
                        </span>
                        <span
                            className={`text-[1.8rem] font-bold ${
                                selectedDay.name === day.name
                                    ? 'text-[#2E5D94]'
                                    : 'text-white'
                            }`}
                        >
                            {day.date}
                        </span>
                    </button>
                </div>
            ))}
        </div>
    )
}
export default Calender
