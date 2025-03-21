'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'
import { AttendanceButton, CancelClassButton, SummaryBar } from '@/components'
import { FaRegClock } from 'react-icons/fa6'
// import axios from 'axios'

const OngoingClasses = ({ classes }) => {
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
                        className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative"
                    >
                        <div className="space-y-1">
                            <h3 className="text-[#0E2C75] font-semibold">
                                {cls.courseCode}
                            </h3>
                            <h3 className="text-gray-700 font-medium">
                                {cls.courseName}
                            </h3>
                            <p className="text-gray-700 font-medium bg-gray-200 px-[1rem] py-[0.5rem] w-fit rounded-lg">
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

const PastClasses = ({ classes }) => {
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
                            className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative"
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

const UpcomingClasses = ({ classes }) => {
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
                            <p className="text-gray-700 font-medium bg-gray-200 px-[1rem] py-[0.5rem] w-[10.5rem] text-center rounded-lg">
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

    const [classes, setClasses] = useState([
        {
            courseCode: 'CE2205',
            courseName: 'Numerical',
            date: '19/03/2025',
            from: '23:00',
            to: '24:00',
            status: null,
        },
        {
            courseCode: 'CE2202',
            courseName: 'Soil Mechanics',
            from: '12:00',
            to: '01:00',
            status: 'present',
        },
        {
            courseCode: 'CE2201',
            courseName: 'Structural Analysis',
            from: '10:00',
            to: '11:00',
            status: 'absent',
        },
        {
            courseCode: 'CE2204',
            courseName: 'Water Resource',
            from: '00:00',
            to: '00:09',
            status: 'sick',
        },
    ])

    // const Datafetching = () => {
    //     const [classes, setClasses] = useState([]);

    //     useEffect(() => {
    //         axios.get('/api/classes')
    //             .then((res) => {
    //                 console.log(res.data);
    //                 setClasses(res.data);
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             });
    //     }, []);

    //     return (
    //         <div>
    //             <ul>
    //                 {classes.map((item) => (
    //                     <li key={item.courseCode}>
    //                         {item.courseCode} - {item.courseName} ({item.from} - {item.to}) - {item.status || }
    //                     </li>
    //                 ))}
    //             </ul>
    //         </div>
    //     );
    // };

    const [summaryData, setSummaryData] = useState({
        labels: ['CE2201', 'CE2202', 'CE2203', 'CE2204', 'CE2205', 'IDE'],
        data: [95, 80, 87, 76, 90, 60],
    })
    const [courses, setCourses] = useState([
        {
            courseCode: 'CE2201',
            courseName: 'Structural Analysis',
        },
        {
            courseCode: 'CE2202',
            courseName: 'Soil Mechanics',
        },
        {
            courseCode: 'CE2203',
            courseName: 'Fluid Mechanics',
        },
        {
            courseCode: 'CE2204',
            courseName: 'Water Resource',
        },
        {
            courseCode: 'CE2205',
            courseName: 'Numerical',
        },
        {
            courseCode: 'CS2207',
            courseName: 'Introductio to Data Science',
        },
    ])

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

    const onSubmit = (data) => {
        data = {
            courseCode: data.course.split(' - ')[0],
            courseName: data.course.split(' - ')[1],
            from: data.from,
            to: data.to,
            status: null,
        }

        console.log(data)

        reset()
        setShowForm(false)
    }

    return (
        <div className="bg-primary p-[1rem] rounded-lg">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="animat-fade-in">
                    <h1 className="text-[#0f318a] bg-clip-text bg-gradient-to-r from-[#0E2C75] to-[#2563eb]">
                        {greeting}
                    </h1>
                    <h3 className="text-gray-500">{formatDate(new Date())}</h3>
                </div>

                <OngoingClasses classes={classes} />

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
                    <UpcomingClasses classes={classes} />
                    <PastClasses classes={classes} />
                </div>

                <SummaryBar summaryData={summaryData} />
            </div>
        </div>
    )
}

export default Home
