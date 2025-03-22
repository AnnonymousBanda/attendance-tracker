'use client'

import { Lecture, LecturesSkeleton, Loader } from '@/components'
import React, { useEffect, useState } from 'react'
import { IoAdd, IoClose } from 'react-icons/io5'
import { getLectures } from '@/firebase/api'
import { useUser } from '@/context'

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

    const [loading, setLoading] = useState(true)
    const [lecture, setLecture] = useState([])
    const { user } = useUser()

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const user = {
                    name: 'Ankit Bhagat',
                    userID: '1',
                    email: 'ankit_2301ce03@iitp.ac.in',
                    roll: '2301CE03',
                    semester: '4',
                    branch: 'Computer Science',
                }
                const res = await getLectures(
                    user.userID,
                    user.semester,
                    selectedDay.date.toLocaleDateString('en-GB').split('/').join('_')
                )

                if (res.status === 200) {
                    setLecture(res.data)
                    setLoading(false)
                } else {
                    throw new Error(res.message)
                }
            } catch (error) {
                alert(error.message)
            }
        }
        fetchLectures()
    }, [selectedDay])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newLecture, setNewLecture] = useState({ courseCode: '', from: '', to: '' })

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
                        } `}>
                        <h3 className={`font-bold capitalize ${selectedDay.date.getDay() === date.getDay() ? 'text-white' : 'text-black'}`}>
                            {day}
                        </h3>
                        <h3 className={`font-bold ${selectedDay.date.getDay() === date.getDay() ? 'text-black' : 'text-white'}`}>
                            {date.getDate()}
                        </h3>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="bg-primary flex flex-col h-full p-[1rem] relative rounded-[1rem]">
            <div className="mb-[1rem]">
                <DaySelector daysDate={daysDate} />
            </div>
            {loading ? (
                <div className="relative h-full">
                    <LecturesSkeleton />
                </div>
            ) : (
                <div className={`p-[1rem] flex-1 overflow-auto flex ${lecture.length > 0 ? 'flex-col' : 'items-center justify-center'}`}>
                    <div className="flex flex-col gap-[2rem] h-auto">
                        {lecture.length > 0 ? (
                            lecture.map((lec, index) => (
                                <Lecture
                                    key={index}
                                    lecture={lec}
                                    setLecture={setLecture}
                                    date={selectedDay.date.toLocaleDateString('en-GB').split('/').join('_')}
                                />
                            ))
                        ) : (
                            <div className="p-[2rem] h-full rounded-[1rem] border-gray-100 flex justify-center items-center flex-col gap-[1rem]">
                                <div className="text-gray-400 mb-[0.5rem]">
                                    <svg className="w-[4rem] h-[4rem] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-500 font-medium mb-[0.5rem]">No lectures scheduled</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button className="absolute bottom-[1rem] right-[1rem] cursor-pointer bg-[#A0B8D9] rounded-full border-[0.1rem] p-[1rem] shadow-lg hover:bg-[#6F8DBD]"
                onClick={() => setIsModalOpen(true)}>
                <IoAdd size={3.5 + 'rem'} />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-md z-100 uppercase">
                    <div className="bg-white p-[1.5rem] rounded-[1rem] shadow-2xl w-[25rem] ">
                        
                        <h2 className="text-[1.5rem] font-bold text-[#6F8DBD] mb-[1rem] text-center">Add New Lecture</h2>

                        <input type="text" placeholder="COURSE CODE" className="w-full p-[1rem] mb-[1rem] border rounded-[0.5rem]" 
                            value={newLecture.courseCode} onChange={(e) => setNewLecture({ ...newLecture, courseCode: e.target.value })} />
                        <input type="time" className="w-full p-[1rem] mb-[1rem] border rounded-[0.5rem]" 
                            value={newLecture.from} onChange={(e) => setNewLecture({ ...newLecture, from: e.target.value })} />
                        <input type="time" className="w-full p-[1rem] mb-[1.5rem] border rounded-[0.5rem]" 
                            value={newLecture.to} onChange={(e) => setNewLecture({ ...newLecture, to: e.target.value })} />

                        <div className="flex justify-center gap-[2rem]">
                            <button className="bg-[#FF6384] px-[1rem] py-[0.8rem] rounded-[0.5rem] hover:bg-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                            <button className="bg-[#4BC0C0] text-white px-[1rem] py-[0.8rem] rounded-[0.5rem] hover:bg-blue-600 hover:text-black" onClick={() => setIsModalOpen(false)}>ADD</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timetable  