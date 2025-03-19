'use client'

import { Lecture } from '@/components'
import React, { useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5'

const Timetable = () => {
    const [selectedDay, setSelectedtDay] = useState(() => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        const today = new Date()
        const todayIndex = today.getDay() === 0 ? 0 : today.getDay() - 1

        return {
            day: days[todayIndex],
            date: new Date(),
        }
    })

    const [daysDate] = useState(() => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

        const monday = new Date()
        monday.setDate(today.getDate() - daysToMonday)

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        return days.map((day, index) => {
            const dateObj = new Date(monday)
            dateObj.setDate(monday.getDate() + index)

            return {
                day,
                date: dateObj,
            }
        })
    })

    const lectures = {
        mon: [
            {
                fro: '8:00',
                to: '9:00',
                courseCode: 'CS101',
                courseName: 'Introduction to Computer Science',
                status: 'present',
            },
            {
                fro: '9:00',
                to: '10:00',
                courseCode: 'CS102',
                courseName: 'Data Structures and Algorithms',
                status: 'absent',
            },
            {
                fro: '10:00',
                to: '11:00',
                courseCode: 'CS103',
                courseName: 'Web Development',
                status: 'sick',
            },
            {
                fro: '11:00',
                to: '12:00',
                courseCode: 'CS104',
                courseName: 'Operating Systems',
                status: 'present',
            },
            {
                fro: '14:00',
                to: '15:00',
                courseCode: 'CS105',
                courseName: 'Computer Networks',
                status: 'absent',
            },
            {
                fro: '15:00',
                to: '16:00',
                courseCode: 'CS106',
                courseName: 'Database Management Systems',
                status: 'present',
            },
        ],
        tue: [
            {
                fro: '8:00',
                to: '9:00',
                courseCode: 'CS201',
                courseName: 'Software Engineering',
                status: 'present',
            },
            {
                fro: '9:00',
                to: '10:00',
                courseCode: 'CS202',
                courseName: 'Cybersecurity',
                status: 'absent',
            },
            {
                fro: '10:00',
                to: '11:00',
                courseCode: 'CS203',
                courseName: 'Machine Learning',
                status: 'sick',
            },
            {
                fro: '11:00',
                to: '12:00',
                courseCode: 'CS204',
                courseName: 'Artificial Intelligence',
                status: 'present',
            },
            {
                fro: '14:00',
                to: '15:00',
                courseCode: 'CS205',
                courseName: 'Cloud Computing',
                status: 'absent',
            },
            {
                fro: '15:00',
                to: '16:00',
                courseCode: 'CS206',
                courseName: 'Internet of Things',
                status: 'present',
            },
        ],
        wed: [
            {
                fro: '8:00',
                to: '9:00',
                courseCode: 'CS301',
                courseName: 'Blockchain Technology',
                status: 'present',
            },
            {
                fro: '9:00',
                to: '10:00',
                courseCode: 'CS302',
                courseName: 'Quantum Computing',
                status: 'absent',
            },
            {
                fro: '10:00',
                to: '11:00',
                courseCode: 'CS303',
                courseName: 'Human-Computer Interaction',
                status: 'sick',
            },
            {
                fro: '11:00',
                to: '12:00',
                courseCode: 'CS304',
                courseName: 'Bioinformatics',
                status: 'present',
            },
            {
                fro: '14:00',
                to: '15:00',
                courseCode: 'CS305',
                courseName: 'Embedded Systems',
                status: 'absent',
            },
            {
                fro: '15:00',
                to: '16:00',
                courseCode: 'CS306',
                courseName: 'Digital Signal Processing',
                status: 'present',
            },
        ],
        thu: [
            {
                fro: '8:00',
                to: '9:00',
                courseCode: 'CS401',
                courseName: 'Parallel Computing',
                status: 'present',
            },
            {
                fro: '9:00',
                to: '10:00',
                courseCode: 'CS402',
                courseName: 'Computer Graphics',
                status: 'absent',
            },
            {
                fro: '10:00',
                to: '11:00',
                courseCode: 'CS403',
                courseName: 'Game Development',
                status: 'sick',
            },
            {
                fro: '11:00',
                to: '12:00',
                courseCode: 'CS404',
                courseName: 'Augmented Reality',
                status: 'present',
            },
            {
                fro: '14:00',
                to: '15:00',
                courseCode: 'CS405',
                courseName: 'Virtual Reality',
                status: 'absent',
            },
            {
                fro: '15:00',
                to: '16:00',
                courseCode: 'CS406',
                courseName: 'Cryptography',
                status: 'present',
            },
        ],
        fri: [
            {
                fro: '8:00',
                to: '9:00',
                courseCode: 'CS501',
                courseName: 'Big Data Analytics',
                status: 'present',
            },
            {
                fro: '9:00',
                to: '10:00',
                courseCode: 'CS502',
                courseName: 'Edge Computing',
                status: 'absent',
            },
            {
                fro: '10:00',
                to: '11:00',
                courseCode: 'CS503',
                courseName: 'Neural Networks',
                status: 'sick',
            },
            {
                fro: '11:00',
                to: '12:00',
                courseCode: 'CS504',
                courseName: 'Bioengineering',
                status: 'present',
            },
            {
                fro: '14:00',
                to: '15:00',
                courseCode: 'CS505',
                courseName: 'Ethical Hacking',
                status: 'absent',
            },
            {
                fro: '15:00',
                to: '16:00',
                courseCode: 'CS506',
                courseName: 'Data Privacy',
                status: 'present',
            },
        ],
        sat: [],
    }
    const [lecture, setLecture] = useState(lectures[selectedDay.day])
    useEffect(() => {
        setLecture(lectures[selectedDay.day])
    }, [selectedDay])

    const DaySelector = ({ daysDate }) => {
        return (
            <div className="flex w-full bg-[#F3F8FA] gap-[0.2rem]">
                {daysDate.map(({ day, date }, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedtDay({ day, date })}
                        className={`flex flex-col cursor-pointer flex-1 items-center justify-center h-[8rem] text-[1.8rem] font-bold transition-all min-w-0 shadow-md ${
                            selectedDay.date.getDay() === date.getDay()
                                ? 'bg-[#6F8DBD]'
                                : 'bg-[#A0B8D9]'
                        }
                        ${
                            index === 0
                                ? 'rounded-[1rem] rounded-br-none'
                                : index === daysDate.length - 1
                                  ? 'rounded-[1rem] rounded-bl-none'
                                  : 'rounded-[1rem]'
                        } `}
                    >
                        <h3
                            className={`font-bold capitalize ${
                                selectedDay.date.getDay() === date.getDay()
                                    ? 'text-white'
                                    : 'text-black'
                            }
                ${
                    index === 0
                        ? 'rounded-[1rem] rounded-br-none'
                        : index === daysDate.length - 1
                          ? 'rounded-[1rem] rounded-bl-none'
                          : 'rounded-[1rem]'
                } `}
                        >
                            {day}
                        </h3>
                        <h3
                            className={`font-bold ${
                                selectedDay.date.getDay() === date.getDay()
                                    ? 'text-black'
                                    : 'text-white'
                            }
                ${
                    index === 0
                        ? 'rounded-[1rem] rounded-br-none'
                        : index === daysDate.length - 1
                          ? 'rounded-[1rem] rounded-bl-none'
                          : 'rounded-[1rem]'
                } `}
                        >
                            {date.getDate()}
                        </h3>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="bg-primary flex flex-col h-full p-[1rem] relative">
            <div className="mb-[1rem]">
                <DaySelector daysDate={daysDate} />
            </div>
            <div
                className={`p-[1rem] flex-1 overflow-auto flex ${lecture.length > 0 ? 'flex-col' : 'items-center justify-center'}`}
            >
                <div className="flex flex-col gap-[2rem] h-auto">
                    {lecture.length > 0 ? (
                        lecture.map((lec, index) => (
                            <Lecture key={index} {...lec} />
                        ))
                    ) : (
                        <div className="p-[2rem] h-full rounded-xl border-gray-100 flex justify-center items-center flex-col gap-[1rem]">
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
                                No lectures scheduled
                            </h3>
                        </div>
                    )}
                </div>
            </div>
            <button className="absolute bottom-[1rem] right-[1rem] cursor-pointer bg-[#6F8DBD] rounded-full border-[0.2rem]">
                <IoAdd size={35} />
            </button>
        </div>
    )
}

export default Timetable
