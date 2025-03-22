'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'
import {
    AttendanceButton,
    CancelClassButton,
    Loader,
    SummaryBar,
} from '@/components'
import { getAttendanceReport, getLectures } from '@/firebase/api'
import { FaRegClock } from 'react-icons/fa6'

const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()
    const { push } = useRouter()

    const [greeting, setGreeting] = useState('')
    const [showForm, setShowForm] = useState(false)

    const [classes, setClasses] = useState([])
    const [summaryData, setSummaryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [courses] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const user = {
                    name: 'Ankit Bhagat',
                    userID: '1',
                    email: 'ankit_2301ce03@iitp.ac.in',
                    roll: '2301CE03',
                    semester: '4',
                    branch: 'Computer Science',
                }
                let res = await getLectures(
                    user.userID,
                    user.semester,
                    new Date().toLocaleDateString('en-GB').split('/').join('_')
                )

                if (res.status !== 200)
                    throw new Error(res.error || 'Something went wrong!')

                setClasses(res.data)

                res = await getAttendanceReport(user.userID, user.semester)

                if (res.status !== 200)
                    throw new Error(res.error || 'Something went wrong!')

                setSummaryData(res.data)
                console.log(res.data)

                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    useEffect(() => {
        window.addEventListener('popstate', () => {
            push('/')
            history.replaceState(null, '', '/')
            history.pushState(null, '', '/')
        })
    }, [push])

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
                '1',
                data,
                '4',
                new Date().toLocaleDateString('en-GB').split('/').join('_')
            )
            if (res.status !== 200) throw new Error('kuch toh gadbad hai')

            setClasses(res.data)
            alert(res.message)
        } catch (error) {
            console.log(error)
        }

        reset()
        setShowForm(false)
    }

    const OngoingClasses = () => {
        const ongoingClasses = classes.filter((cls) => {
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
                {ongoingClasses.length > 0 ? (
                    ongoingClasses.map((cls) => (
                        <div
                            key={cls.courseCode}
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

                            <AttendanceButton lecture={cls} />
                            <CancelClassButton lecture={cls} />
                        </div>
                    ))
                ) : (
                    <NoClasses message="There are no classes scheduled at this time" />
                )}
            </div>
        )
    }

    const PastClasses = () => {
        const pastClasses = classes.filter((cls) => {
            const [to_hours, to_minutes] = cls.to.split(':').map(Number)
            const to = new Date()
            to.setHours(to_hours, to_minutes, 0, 0)
            return to < new Date()
        })

        return (
            <div className="space-y-3">
                <h3 className="text-gray-500 uppercase">Past</h3>
                {pastClasses.length === 0 ? (
                    <NoClasses message="No past classes to diplay" />
                ) : (
                    <>
                        {pastClasses.map((cls) => (
                            <div
                                key={cls.courseCode + cls.from}
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

                                <AttendanceButton lecture={cls} />
                                <CancelClassButton lecture={cls} />
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
                        {upcomingClasses.map((cls) => (
                            <div
                                key={cls.courseCode + cls.from}
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
                                <CancelClassButton lecture={cls} />
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
        <Loader />
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
                            className="bg-white p-[1.25rem] rounded-xl shadow-md mt-[1rem] space-y-3"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="course"
                                        className="block mb-1"
                                    >
                                        <p>Select Course:</p>
                                    </label>
                                    <select
                                        id="course"
                                        className="border rounded-lg p-2 w-full text-[1rem] text-[#8c8c8c]"
                                        {...register('course', {
                                            required:
                                                'Course selection is required',
                                        })}
                                    >
                                        <option value="">
                                            Select a course
                                        </option>
                                        {courses.map((course) => (
                                            <option
                                                key={course.courseCode}
                                                value={`${course.courseCode} - ${course.courseName}`}
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

                                <div>
                                    <div className="flex gap-[0.5rem] items-center">
                                        <label
                                            htmlFor="from"
                                            className="block mb-1"
                                        >
                                            <p className="w-[4rem]">From:</p>
                                        </label>
                                        <input
                                            id="from"
                                            type="time"
                                            {...register('from', {
                                                required:
                                                    'Start time is required',
                                            })}
                                            className="shadow-blue-100 p-2 rounded-lg w-full text-[#8c8c8c] text-[1rem]"
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
                                            <p className="w-[4rem]">To:</p>
                                        </label>
                                        <input
                                            id="to"
                                            type="time"
                                            {...register('to', {
                                                required:
                                                    'End time is required',
                                            })}
                                            className="shadow-blue-100 p-2 rounded-lg w-full text-[#8c8c8c] text-[1rem]"
                                        />
                                        {errors.to && (
                                            <p className="text-red-500">
                                                {errors.to.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors"
                            >
                                <p>Add Class</p>
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
