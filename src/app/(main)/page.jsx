'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'

const OngoingClasses = ({ classes, onAttendanceUpdate }) => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const isOngoing = (classTime) => {
        const [hours, minutes] = classTime.split(':').map(Number)
        return (
            hours === currentTime.getHours() &&
            minutes <= currentTime.getMinutes() + 5 &&
            minutes >= currentTime.getMinutes() - 5
        )
    }

    const ongoingClasses = classes.filter((cls) => {
        const [hours, minutes] = cls.time.split(':').map(Number)
        const classTime = new Date()
        classTime.setHours(hours, minutes, 0, 0)
        const now = new Date()

        return (
            now >= new Date(classTime.getTime() - 5 * 60 * 1000) &&
            now <= new Date(classTime.getTime() + 5 * 60 * 1000)
        )
    })

    return (
        <div className="space-y-3">
            <h2 className="text-gray-700  tracking-wider">
                Ongoing Class
            </h2>
            {ongoingClasses.length > 0 ? (
                ongoingClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center border border-gray-100 hover:border-blue-100"
                    >
                        <div className="space-y-1">
                            <h3 className="text-[#0E2C75] font-semibold">
                                {cls.code}
                            </h3>
                            <h3 className="text-gray-700 font-medium">
                                {cls.name}
                            </h3>
                        </div>

                        <p className="text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                            {cls.time}
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={() =>
                                    onAttendanceUpdate(cls.id, 'Present')
                                }
                                className="bg-green-100 text-green-700 font-medium py-2 px-6 rounded-lg hover:bg-green-200 transition-colors duration-200 cursor-pointer"
                            >
                                <p>Present</p>
                            </button>
                            <button
                                onClick={() =>
                                    onAttendanceUpdate(cls.id, 'Absent')
                                }
                                className="bg-red-100 text-red-700 font-medium py-2 px-6 rounded-lg hover:bg-red-200 transition-colors duration-200 cursor-pointer"
                            >
                                <p>Absent</p>
                            </button>
                            <button
                                onClick={() =>
                                    onAttendanceUpdate(cls.id, 'Sick')
                                }
                                className="bg-yellow-200 text-yellow-700 font-medium py-2 px-6 rounded-lg hover:bg-yellow-300 hover:text-yellow-700 transition-colors duration-200 cursor-pointer"
                            >
                                <p>Sick</p>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-gray-400 mb-2">
                        <svg
                            className="w-16 h-16 mx-auto"
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
                        No Ongoing Classes
                    </h3>
                    <p className="text-gray-400 ">
                        There are no classes scheduled at this time
                    </p>
                </div>
            )}
        </div>
    )
}

const Home = () => {
    const [greeting, setGreeting] = useState('')
    const [date, setDate] = useState(new Date())
    const [classes, setClasses] = useState([
        {
            id: 1,
            code: 'CE2205',
            name: 'Numerical',
            time: '04:00 PM',
            status: '--',
            credits: 3,
            type: 'upcoming',
        },
        {
            id: 2,
            code: 'CE2202',
            name: 'Soil Mechanics',
            time: '05:00 PM',
            status: '--',
            credits: 4,
            type: 'upcoming',
        },
        {
            id: 3,
            code: 'CE2201',
            name: 'Structural Analysis',
            time: '01:00 PM',
            status: 'Attended',
            credits: 4,
            type: 'past',
        },
        {
            id: 4,
            code: 'CE2204',
            name: 'Water Resource',
            time: '02:00 PM',
            status: 'Attended',
            credits: 3,
            type: 'past',
        },
    ])

    const [summaryData, setSummaryData] = useState({
        labels: ['CE2201', 'CE2202', 'CE2203', 'CE2204', 'CE2205', 'IDE'],
        data: [95, 80, 87, 76, 90, 60],
    })

    const [newClass, setNewClass] = useState({
        code: '',
        name: '',
        time: '',
        status: '--',
        type: 'upcoming',
    })

    const [showForm, setShowForm] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()
    const { push } = useRouter()

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

    const handleAttendanceUpdate = (id, status) => {
        setClasses((prev) =>
            prev.map((cls) => (cls.id === id ? { ...cls, status } : cls))
        )
    }

    const onSubmit = (data) => {
        setClasses((prev) => [
            ...prev,
            { ...data, id: classes.length + 1, status: '--', type: 'upcoming' },
        ])
        reset()
        setShowForm(false)
    }

    return (
        <div className="bg-primary p-[1rem] rounded-lg">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="animat-fade-in">
                    <h1 className="font-bold text-[#0f318a] bg-clip-text bg-gradient-to-r from-[#0E2C75] to-[#2563eb]">
                    {greeting} 
                    </h1>
                    <h3 className="text-gray-500 font-medium mt-1">
                        {formatDate(date)}
                    </h3>
                </div>

                <OngoingClasses
                    classes={classes}
                    onAttendanceUpdate={handleAttendanceUpdate}
                    className="animat-fade-in text-[#000000]"
                />

                {showForm && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white p-5 rounded-xl shadow-md mt-4 space-y-3"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Class Code"
                                    {...register('code', {
                                        required: 'Class Code is required',
                                    })}
                                    className="shadow-blue-100 p-2 rounded-lg w-full"
                                />
                                {errors.code && (
                                    <p className="text-red-500 ">
                                        {errors.code.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Class Name"
                                    {...register('name', {
                                        required: 'Class Name is required',
                                    })}
                                    className="shadow-blue-100 p-2 rounded-lg w-full"
                                />
                                {errors.name && (
                                    <p className="text-red-500 ">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="time"
                                    placeholder="Time"
                                    {...register('time', {
                                        required: 'Class Time is required',
                                    })}
                                    className="shadow-blue-100 p-2 rounded-lg w-full text-[#8c8c8c]"
                                />
                                {errors.time && (
                                    <p className="text-red-500 ">
                                        {errors.time.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <select
                                    {...register('type')}
                                    className="shadow-blue-100 p-2 rounded-lg w-full"
                                >
                                    <option value="upcoming" ><p>Upcoming</p></option>
                                    
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <p>Add Class</p>
                        </button>
                    </form>
                )}

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Today's Classes
                        </h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-blue-500 hover:text-blue-900  transition-colors text-4xl font-bold"
                        >
                            <MdAdd size={24} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-medium text-gray-500 uppercase tracking-wider">
                            Upcoming
                        </h3>
                        {classes
                            .filter((cls) => cls.type === 'upcoming')
                            .map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center border border-gray-100 hover:border-blue-100"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-[#0E2C75] font-semibold">
                                            {cls.code}
                                        </h3>
                                        <h3 className="text-gray-700 font-medium">
                                            {cls.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                                        {cls.time}
                                    </p>
                                </div>
                            ))}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-medium text-gray-500 uppercase tracking-wider">
                            Past
                        </h3>
                        {classes
                            .filter((cls) => cls.type === 'past')
                            .map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center border border-gray-100"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-[#0E2C75] font-semibold">
                                            {cls.code}
                                        </h3>
                                        <h3 className="text-gray-700 font-medium">
                                            {cls.name}
                                        </h3>
                                    </div>
                                    <p
                                        className={`px-4 py-2 rounded-lg font-medium ${
                                            cls.status === 'Attended'
                                                ? 'text-green-500 bg-green-50'
                                                : 'text-red-500 bg-red-50'
                                        }`}
                                    >
                                        {cls.status}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Summary
                    </h2>
                    {summaryData.labels.map((label, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className={`text-white px-3 py-1.5 rounded-lg text-sm font-medium min-w-[60px] text-center
                  ${
                      summaryData.data[index] < 75
                          ? 'bg-red-500'
                          : 'bg-green-500'
                  }`}
                            >
                                {summaryData.data[index]}%
                            </div>
                            <div className="flex-grow h-7 bg-gray-100 rounded-lg relative overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out
                    ${
                        summaryData.data[index] < 75
                            ? 'bg-red-500'
                            : 'bg-green-500'
                    }`}
                                    style={{
                                        width: `${summaryData.data[index]}%`,
                                    }}
                                />
                                <div
                                    className="absolute top-0 right-0 h-full"
                                    style={{
                                        width: `${
                                            100 - summaryData.data[index]
                                        }%`,
                                        backgroundImage:
                                            'repeating-linear-gradient(45deg, #f3f4f6 0, #f3f4f6 1px, transparent 1px, transparent 4px)',
                                        backgroundColor: '#f9fafb',
                                    }}
                                />
                            </div>
                            <h3 className="text-gray-700 w-20 text-sm font-medium">
                                {label}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
