'use client'

import React, { useState } from 'react'
import DaySelector from './../../../components/DaySelector'

const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const sampleLectures = {
    Mon: [
        { fro: '09:00', to: '10:00', sub_name: 'CE2201' },
        { fro: '10:00', to: '11:00', sub_name: 'CE2201' },
        { fro: '11:00', to: '12:00', sub_name: 'CE2201' },
        { fro: '12:00', to: '13:00', sub_name: 'CE2201' },
        { fro: '14:00', to: '15:00', sub_name: 'CE2201' },
        { fro: '15:00', to: '16:00', sub_name: 'CE2201' },
        { fro: '16:00', to: '17:00', sub_name: 'CE2201' },
    ],
}

const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState(daysList[0])

    return (
        <div className="h-auto flex flex-col bg-primary px-[1rem] py-[1rem]">
            <DaySelector
                days={daysList}
                setSelectedDay={setSelectedDay}
                selectedDay={selectedDay}
            />

            <div className="mt-[2rem]">
                <h2 className="text-[2rem] font-bold">{selectedDay}day</h2>
                <p className="text-gray-500 text-[1.4rem]">07/03/2025</p>
            </div>

            <div className="flex flex-col mt-[2rem] gap-[2rem]">
                {sampleLectures[selectedDay].map((lecture, index) => (
                    <div key={index} className="flex flex-col items-start">
                        <div className="text-[1.6rem] font-semibold pl-[6rem]">
                            {lecture.sub_name}
                        </div>

                        <div className="flex items-center w-full">
                            <div className="text-gray-800 text-[1.4rem] font-medium w-[6rem] text-right pr-[1.5rem]">
                                <p>{lecture.fro}</p>
                                <p className="text-gray-300">{lecture.to}</p>
                            </div>

                            <div className="flex-1 h-[0.1rem] bg-gray-400 "></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Schedule
