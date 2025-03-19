'use client'

import React, { useState, useEffect } from 'react'
import Lecture from './../../../components/Lecture'
import { IoAdd } from 'react-icons/io5'

const sampleLectures = {
    Mon: [
        {
            fro: '08:00',
            to: '09:00',
            courseName: 'Structural Mechanics',
            courseCode: 'CE2201',
            status: 'present',
        },
        {
            fro: '09:00',
            to: '10:00',
            courseName: 'Fluid Mechanics',
            courseCode: 'CE2202',
            status: 'absent',
        },
        {
            fro: '10:00',
            to: '11:00',
            courseName: 'Engineering Mathematics',
            courseCode: 'MA2201',
            status: 'sick',
        },
        {
            fro: '11:00',
            to: '12:00',
            courseName: 'Water Resources',
            courseCode: 'CE2203',
            status: 'present',
        },
        {
            fro: '13:00',
            to: '14:00',
            courseName: 'Numerical Methods',
            courseCode: 'CE2204',
            status: 'present',
        },
        {
            fro: '14:00',
            to: '15:00',
            courseName: 'Materials',
            courseCode: 'CE2205',
            status: 'present',
        },
    ],
}

const Timetable = () => {
    const [daysData, setDaysData] = useState([
        { name: 'Mon', date: '7' },
        { name: 'Tue', date: '8' },
        { name: 'Wed', date: '9' },
        { name: 'Thu', date: '10' },
        { name: 'Fri', date: '11' },
        { name: 'Sat', date: '12' },
    ])
    useEffect(() => {
        setDaysData([
            { name: 'Mon', date: '7' },
            { name: 'Tue', date: '8' },
            { name: 'Wed', date: '9' },
            { name: 'Thu', date: '10' },
            { name: 'Fri', date: '11' },
            { name: 'Sat', date: '12' },
        ])
    }, [])

    const [selectedDay, setSelectedDay] = useState('Mon')
    const [lectures, setLectures] = useState(sampleLectures['Mon'])

    useEffect(() => {
        setLectures(sampleLectures[selectedDay] || [])
    }, [selectedDay])

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
                        <span className="text-[1.8rem] font-bold">
                            {day.name}
                        </span>
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

    return (
        <div className=" bg-primary flex flex-col h-full p-[1rem] relative">
            <div className="mb-[1rem]">
                <DaySelector
                    days={daysData}
                    setSelectedDay={setSelectedDay}
                    selectedDay={selectedDay}
                />
            </div>

            <div className="p-[1rem] flex-1 overflow-auto">
                <div className="flex flex-col gap-[2rem] h-auto">
                    {lectures.length > 0 ? (
                        lectures.map((lecture, index) => (
                            <Lecture key={index} {...lecture} />
                        ))
                    ) : (
                        <div className="bg-white p-[2rem] h-full rounded-xl border-gray-100 flex justify-center items-center flex-col gap-[1rem]">
                            <div className="text-gray-400 mb-2">
                                <svg
                                    className="w-[4rem] h-[4rem] mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-gray-500 font-medium  mb-1">
                                No lectures for today
                            </h3>
                        </div>
                    )}
                </div>
            </div>
            <button className="absolute bottom-[1rem] right-[1rem] cursor-pointer bg-[#6F8DBD] rounded-full border-[0.2rem]">
                <IoAdd size={45} />
            </button>
        </div>
    )
}

export default Timetable
