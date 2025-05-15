'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'
import {
    AttendanceButton,
    CancelClassButton,
    HomeSkeleton,
    SummaryBar,
} from '@/components'
import {
    addExtraLecture,
    getAttendanceReport,
    getLectures,
} from '@/firebase/api'
import { FaRegClock } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import { useAuth } from '@/context'

const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const [greeting, setGreeting] = useState('')
    const [showForm, setShowForm] = useState(false)

    const [classes, setClasses] = useState([])
    const [summaryData, setSummaryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [courses, setCourses] = useState([])

    const initialRender = useRef(true)

    const { user } = useAuth()

    useEffect(() => {
        const fetch = async () => {
            try {
                let res = await getLectures(
                    user.userID,
                    user.semester,
                    new Date()
                        .toLocaleDateString('en-US', { weekday: 'short' })
                        .toLowerCase()
                )

                if (res.status !== 200) throw new Error(res.message)

                setClasses(res.data)

                res = await getAttendanceReport(user.userID, user.semester)

                if (res.status !== 200) throw new Error(res.message)

                setSummaryData(res.data)

                res.data.map((course) => {
                    return {
                        courseCode: course.courseCode,
                        courseName: course.courseName,
                    }
                })

                setCourses(res.data)

                setLoading(false)
            } catch (error) {
                toast.error(error.message, { className: 'toast-error' })
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }

        const fetchSummary = async () => {
            try {
                const res = await getAttendanceReport(
                    user.userID,
                    user.semester
                )
                if (res.status !== 200) throw new Error(res.message)

                setSummaryData(res.data)
            } catch (error) {
                toast.error(error.message, { className: 'toast-error' })
            }
        }
        fetchSummary()
    }, [classes])

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    // useEffect(() => {
    //     window.addEventListener('popstate', () => {
    //         push('/')
    //         history.replaceState(null, '', '/')
    //         history.pushState(null, '', '/')
    //     })
    // }, [push])

    const formatDate = (date) => {
        const options = {
            weekday: 'long',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }
        return date.toLocaleDateString('en-US', options).replace(',', '')
    }

    const onSubmit = async (data) => {
        data = {
            courseCode: data.course.split(' - ')[0],
            courseName: data.course.split(' - ')[1],
            from: data.from,
            to: data.to,
            status: null,
        }

        try {
            const res = await addExtraLecture(
                user.userID,
                data,
                user.semester,
                new Date()
                    .toLocaleDateString('en-US', { weekday: 'short' })
                    .toLowerCase()
            )
            if (res.status !== 200) throw new Error(res.message)

            setClasses(res.data)
            console.log(res.data)
            reset()
            setShowForm(false)
            toast.success('Class added successfully', {
                className: 'toast-success',
            })
        } catch (error) {
            toast.error(error.message, { className: 'toast-error' })
        }
    }

    const OngoingClasses = () => {
        const ongoingClasses = classes?.filter((cls) => {
            const [from_hours, from_minutes] = cls.from.split(':').map(Number)
            const from = new Date()
            from.setHours(from_hours, from_minutes, 0, 0)

            const [to_hours, to_minutes] = cls.to.split(':').map(Number)
            const to = new Date()
            to.setHours(to_hours, to_minutes, 0, 0)
            const now = new Date()

            return from <= now && to >= now
        })

        return (
            <div className="space-y-3">
                <h2 className="text-gray-700">Ongoing Class</h2>
                {ongoingClasses?.length > 0 ? (
                    ongoingClasses.map((cls, i) => (
                        <div
                            key={cls.courseCode + cls.from + i}
                            className="bg-white px-[1rem] pt-[3.5rem] pb-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative"
                        >
                            <div className="space-y-1">
                                <h3 className="text-[#0E2C75] font-semibold">
                                    {cls.courseCode}
                                </h3>
                                <h3 className="text-gray-700 font-medium">
                                    {cls.courseName}
                                </h3>
                                <p className="text-gray-700 font-medium bg-gray-200 px-[1rem] py-[0.5rem] w-fit text-center rounded-lg">
                                    {cls.from} - {cls.to}
                                </p>
                            </div>

                            <AttendanceButton
                                lecture={cls}
                                day={new Date()
                                    .toLocaleDateString('en-US', {
                                        weekday: 'short',
                                    })
                                    .toLowerCase()}
                                setLectures={setClasses}
                            />
                            <CancelClassButton
                                lecture={cls}
                                day={new Date()
                                    .toLocaleDateString('en-US', {
                                        weekday: 'short',
                                    })
                                    .toLowerCase()}
                                setLectures={setClasses}
                            />
                        </div>
                    ))
                ) : (
                    <NoClasses message="There are no classes scheduled at this time" />
                )}
            </div>
        )
    }

    const PastClasses = () => {
        const pastClasses = classes?.filter((cls) => {
            const [to_hours, to_minutes] = cls.to.split(':').map(Number)
            const to = new Date()
            to.setHours(to_hours, to_minutes, 0, 0)
            return to < new Date()
        })

        return (
            <div className="space-y-3">
                <h3 className="text-gray-500 uppercase">Past</h3>
                {pastClasses.length === 0 ? (
                    <NoClasses message="No past classes to display" />
                ) : (
                    <>
                        {pastClasses.map((cls, i) => (
                            <div
                                key={cls.courseCode + cls.from + i}
                                className="bg-white px-[1rem] pt-[3.5rem] pb-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative"
                            >
                                <div>
                                    <h3 className="text-[#0E2C75] font-semibold">
                                        {cls.courseCode}
                                    </h3>
                                    <h3 className="text-gray-700 font-medium">
                                        {cls.courseName}
                                    </h3>
                                </div>

                                <AttendanceButton
                                    lecture={cls}
                                    day={new Date()
                                        .toLocaleDateString('en-US', {
                                            weekday: 'short',
                                        })
                                        .toLowerCase()}
                                    setLectures={setClasses}
                                />
                                <CancelClassButton
                                    lecture={cls}
                                    day={new Date()
                                        .toLocaleDateString('en-US', {
                                            weekday: 'short',
                                        })
                                        .toLowerCase()}
                                    setLectures={setClasses}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        )
    }

    const UpcomingClasses = () => {
        const upcomingClasses = classes.filter((cls) => {
            const [from_hours, from_minutes] = cls.from.split(':').map(Number)
            const from = new Date()
            from.setHours(from_hours, from_minutes, 0, 0)
            return from > new Date()
        })

        return (
            <div className="space-y-3">
                <h3 className="text-gray-500 uppercase">Upcoming</h3>
                {upcomingClasses.length === 0 ? (
                    <NoClasses message="No upcoming classes" />
                ) : (
                    <>
                        {upcomingClasses.map((cls, i) => (
                            <div
                                key={cls.courseCode + cls.from + i}
                                className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-[#0E2C75] font-semibold">
                                        {cls.courseCode}
                                    </h3>
                                    <h3 className="text-gray-700 font-medium">
                                        {cls.courseName}
                                    </h3>
                                </div>
                                <p className="text-gray-700 font-medium bg-gray-200 px-[1rem] py-[0.5rem] w-fit text-center rounded-lg">
                                    {cls.from} - {cls.to}
                                </p>
                                <CancelClassButton
                                    lecture={cls}
                                    day={new Date()
                                        .toLocaleDateString('en-US', {
                                            weekday: 'short',
                                        })
                                        .toLowerCase()}
                                    setLectures={setClasses}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        )
    }

    const NoClasses = ({ message }) => {
        return (
            <div className="bg-white p-[2rem] rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-400 mb-2 flex flex-col items-center gap-[1rem]">
                    <FaRegClock size={30} />
                    <h3 className="">{message}</h3>
                </div>
            </div>
        )
    }

    return loading ? (
        <HomeSkeleton />
    ) : (
        <div className="bg-primary p-[1rem] rounded-lg">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="animat-fade-in">
                    <h1 className="text-[#0f318a] bg-clip-text bg-gradient-to-r from-[#0E2C75] to-[#2563eb]">
                        {greeting}
                    </h1>
                    <h3 className="text-gray-500">{formatDate(new Date())}</h3>
                </div>

                <OngoingClasses />

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-gray-700">Today's Classes</h2>
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className={`text-blue-500 hover:text-blue-900 hover:cursor-pointer  transition-all duration-300 ${
                                showForm ? 'rotate-45' : ''
                            }`}
                        >
                            <MdAdd size={30} />
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={`bg-white p-[1.25rem] rounded-lg flex flex-col gap-[2rem] items-center`}
                        >
                            <div>
                                <label htmlFor="course" className="block mb-1">
                                    <h3>Select Course:</h3>
                                </label>
                                <select
                                    id="course"
                                    className="border rounded-lg p-2 w-full text-[1.4rem] text-[#8c8c8c]"
                                    {...register('course', {
                                        required:
                                            'Course selection is required',
                                    })}
                                >
                                    <option
                                        value=""
                                        className="text-[1.4rem] cursor-pointer"
                                    >
                                        Select a course
                                    </option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.courseCode}
                                            value={`${course.courseCode} - ${course.courseName}`}
                                            className="text-[1.4rem] cursor-pointer"
                                        >
                                            {course.courseCode} -{' '}
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>
                                {errors.course && (
                                    <p className="text-red-500">
                                        {errors.course.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-[2rem]">
                                <div className="flex gap-[0.5rem] items-center">
                                    <label
                                        htmlFor="from"
                                        className="block mb-1"
                                    >
                                        <h3>From:</h3>
                                    </label>
                                    <input
                                        id="from"
                                        type="time"
                                        {...register('from', {
                                            required: 'Start time is required',
                                        })}
                                        className="shadow-blue-100 p-[0.5rem] rounded-lg w-full text-[#8c8c8c] text-[1.4rem] border"
                                    />
                                    {errors.from && (
                                        <p className="text-red-500">
                                            {errors.from.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-[0.5rem] items-center">
                                    <label
                                        htmlFor="to"
                                        className="block mb-1 mt-2"
                                    >
                                        <h3>To:</h3>
                                    </label>
                                    <input
                                        id="to"
                                        type="time"
                                        {...register('to', {
                                            required: 'End time is required',
                                        })}
                                        className="shadow-blue-100 p-[0.5rem] rounded-lg w-full text-[#8c8c8c] text-[1.4rem] border"
                                    />
                                    {errors.to && (
                                        <p className="text-red-500">
                                            {errors.to.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-fit bg-green px-[1rem] py-[0.5rem] rounded-lg hover:bg-green-600 hover:cursor-pointer transition-colors duration-150"
                            >
                                <h3>Add Class</h3>
                            </button>
                        </form>
                    )}
                    <UpcomingClasses />
                    <PastClasses />
                </div>

                <SummaryBar summaryData={summaryData} />
            </div>
        </div>
    )
}

export default Home
