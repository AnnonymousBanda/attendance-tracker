import React, { useState, useEffect } from 'react'
import Calender from '../components/Calender'
import Lecture from '../components/Lecture'

const daysData = [
    { name: 'Mon', date: '7' },
    { name: 'Tue', date: '8' },
    { name: 'Wed', date: '9' },
    { name: 'Thu', date: '10' },
    { name: 'Fri', date: '11' },
    { name: 'Sat', date: '12' },
]

const sampleLectures = {
    Mon: [
        { fro: '08:00', to: '09:00', sub_name: 'Structural Mechanics' },
        { fro: '09:00', to: '10:00', sub_name: 'Fluid Mechanics' },
        { fro: '10:00', to: '11:00', sub_name: 'Engineering Mathematics' },
        { fro: '11:00', to: '12:00', sub_name: 'Water Resources' },
        { fro: '14:00', to: '15:00', sub_name: 'Numerical Methods' },
        { fro: '15:00', to: '16:00', sub_name: 'Materials' },
    ],
}

const Timetable = () => {
    const [selectedDay, setSelectedDay] = useState('Mon')
    const [lectures, setLectures] = useState(sampleLectures['Mon'])

    useEffect(() => {
        setLectures(sampleLectures[selectedDay] || [])
    }, [selectedDay])

    return (
        <div className=" bg-white flex flex-col">
            <div className="px-[1rem] py-[1.2rem]">
                <Calender
                    days={daysData}
                    setSelectedDay={setSelectedDay}
                    selectedDay={selectedDay}
                />
            </div>

            <div className="flex flex-col pl-[7rem] gap-[2rem]  pt-[1rem] ">
                {lectures.length > 0 ? (
                    lectures.map((lecture, index) => (
                        <Lecture key={index} {...lecture} />
                    ))
                ) : (
                    <p className="text-gray-500 text-lg">
                        No lectures scheduled for {selectedDay}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Timetable
