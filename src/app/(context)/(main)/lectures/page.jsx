'use client'

import { Lecture, LecturesSkeleton } from '@/components'
import React, { useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import {
    getLectures,
    addExtraLecture,
    getAttendanceReport,
} from '@/firebase/api'
import { useAuth } from '@/context'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const Timetable = () => {
    const [selectedDay, setSelectedtDay] = useState(() => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        const today = new Date()
        const todayIndex = today.getDay() // === 0 ? 0 : today.getDay() - 1
        const todayDate = new Date(today)
        // todayDate.setDate(today.getDate() + (!todayIndex ? 1 : 0))

        return {
            day: days[todayIndex],
            date: todayDate,
        }
    })

    const [daysDate] = useState(() => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

        const monday = new Date()
        monday.setDate(today.getDate() - daysToMonday)

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        return days.map((day, index) => {
            const dateObj = new Date(monday)
            dateObj.setDate(monday.getDate() + index)
            return {
                day,
                date: dateObj,
            }
        })
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()
    const [loading, setLoading] = useState(true)
    const [lectures, setLectures] = useState([])
    const [courses, setCourses] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLectures(
                    user.userID,
                    user.semester,
                    selectedDay.date
                        .toLocaleDateString('en-GB')
                        .split('/')
                        .join('_')
                )
                if (res.status !== 200) throw new Error(res.message)

                setLectures(res.data)

                const attendanceRes = await getAttendanceReport(
                    user.userID,
                    user.semester
                )
                if (attendanceRes.status !== 200)
                    throw new Error(attendanceRes.message)

                setCourses(
                    attendanceRes.data.map((course) => ({
                        courseCode: course.courseCode,
                        courseName: course.courseName,
                    }))
                )
                setLoading(false)
            } catch (error) {
                toast.error(error.message, {
                    className: 'toast-error',
                })
                setLoading(false)
            }
        }
        fetchData()
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
                            }`}
                        >
                            {day}
                        </h3>
                        <h3
                            className={`font-bold ${
                                selectedDay.date.getDay() === date.getDay()
                                    ? 'text-black'
                                    : 'text-white'
                            }`}
                        >
                            {date.getDate()}
                        </h3>
                    </button>
                ))}
            </div>
        )
    }

    const handleAddLecture = async (data) => {
        try {
            const lectureData = {
                courseCode: data.course.split(' - ')[0],
                courseName: data.course.split(' - ')[1],
                from: data.from,
                to: data.to,
                status: null,
            }

            const res = await addExtraLecture(
                user.userID,
                lectureData,
                user.semester,
                selectedDay.date
                    .toLocaleDateString('en-GB')
                    .split('/')
                    .join('_')
            )

            if (res.status !== 200) throw new Error(res.message)

            setLectures(res.data)
            setIsModalOpen(false)
            reset()
        } catch (error) {
            toast.error(error.message, {
                className: 'toast-error',
            })
        }
    }

    return (
        <div className="bg-primary flex flex-col h-full p-[1rem] relative rounded-lg">
            <div className="mb-[1rem]">
                <DaySelector daysDate={daysDate} />
            </div>

            {loading ? (
                <div className="flex-1 overflow-hidden">
                    <LecturesSkeleton />
                </div>
            ) : (
                <div
                    className={`p-[1rem] flex-1 overflow-auto flex ${
                        lectures.length > 0
                            ? 'flex-col'
                            : 'items-center justify-center'
                    }`}
                >
                    {lectures.length > 0 ? (
                        <div className="flex flex-col gap-[2rem] h-auto">
                            {lectures.map((lec, index) => (
                                <Lecture
                                    key={index}
                                    lecture={lec}
                                    setLectures={setLectures}
                                    date={selectedDay.date
                                        .toLocaleDateString('en-GB')
                                        .split('/')
                                        .join('_')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-[2rem] h-full rounded-[1rem] border-gray-100 flex justify-center items-center flex-col gap-[1rem]">
                            <div className="text-gray-400 mb-[0.5rem]">
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
                            <h3 className="text-gray-500 font-medium mb-[0.5rem]">
                                No lectures scheduled
                            </h3>
                        </div>
                    )}
                </div>
            )}

            <button
                className="absolute bottom-[1rem] right-[1rem] cursor-pointer bg-[#A0B8D9] rounded-full border-[0.1rem] hover:bg-[#6F8DBD] transition-colors duration-150"
                onClick={() => setIsModalOpen(true)}
            >
                <IoAdd size="3.5rem" />
            </button>
            {isModalOpen && (
                <div
                    className="fixed w-full z-50 inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] flex justify-center items-center"
                    onClick={() => {
                        setIsModalOpen(false)
                        reset()
                    }}
                >
                    <div
                        className="bg-white p-[2rem] rounded-lg max-w-[50rem] w-auto flex gap-[1rem] flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-center text-gray-800 font-semibold">
                            Add New Lecture
                        </h2>

                        <form
                            onSubmit={handleSubmit(handleAddLecture)}
                            className="space-y-[1rem] flex flex-col gap-[1rem]"
                        >
                            <div>
                                <label className="block mb-[0.5rem]">
                                    <h3>COURSE</h3>
                                </label>
                                <select
                                    {...register('course', {
                                        required: 'REQUIRED FIELD',
                                    })}
                                    className="w-full p-[0.5rem] border rounded-[0.5rem] text-[1.4rem] text-[#8c8c8c]"
                                >
                                    <option value="" className="text-[1.4rem]">
                                        SELECT COURSE
                                    </option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.courseCode}
                                            value={`${course.courseCode} - ${course.courseName}`}
                                            className="text-[1.4rem]"
                                        >
                                            {course.courseCode} -{' '}
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>
                                {errors.course && (
                                    <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
                                        {errors.course.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-[0.5rem] items-center">
                                <div className="flex-1">
                                    <label className="block mb-[0.5rem] text-[1rem]">
                                        <h3>FROM</h3>
                                    </label>
                                    <input
                                        type="time"
                                        {...register('from', {
                                            required: 'REQUIRED FIELD',
                                        })}
                                        className="w-full p-[0.5rem] border rounded-[0.5rem] text-[1.4rem] text-[#8c8c8c]"
                                    />
                                    {errors.from && (
                                        <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
                                            {errors.from.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <label className="block mb-[0.5rem] text-[1rem]">
                                        <h3>TO</h3>
                                    </label>
                                    <input
                                        type="time"
                                        {...register('to', {
                                            required: 'REQUIRED FIELD',
                                        })}
                                        className="w-full p-[0.5rem] border rounded-[0.5rem] text-[1.4rem] text-[#8c8c8c]"
                                    />
                                    {errors.to && (
                                        <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
                                            {errors.to.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center gap-[2rem] mt-[1.5rem]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        reset()
                                    }}
                                    className="bg-red p-[1rem] rounded-lg cursor-pointer hover:bg-red-600 transition-colors duration-150"
                                >
                                    <p className="text-gray-800 uppercase font-bold">
                                        CANCEL
                                    </p>
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green p-[1rem] rounded-lg cursor-pointer hover:bg-green-600 transition-colors duration-150"
                                >
                                    <p className="text-gray-800 uppercase font-bold">
                                        CONFIRM
                                    </p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timetable
