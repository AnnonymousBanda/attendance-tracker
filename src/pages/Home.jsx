import React, { useState, useEffect } from 'react'

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

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    const formatDate = (date) => {
        const options = {
            weekday: 'long',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }
        return date.toLocaleDateString('en-US', options).replace(',', '')
    }

    const handleAddClass = (e) => {
        e.preventDefault()
        
        if (!newClass.code || !newClass.name || !newClass.time) {
            alert('Please fill all fields')
            return
        }

        const newClassItem = {
            ...newClass,
            id: classes.length + 1,
            
        }

        setClasses((prev) => [...prev, newClassItem])
        setNewClass({
            code: '',
            name: '',
            time: '',
            status: '--',
            type: 'upcoming',
        })
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 font-Plus Jakarta Sans overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="animate-fade-in">
                    <div className="text-2xl sm:text-3xl font-bold text-[#0E2C75] bg-clip-text text-transparent bg-gradient-to-r from-[#0E2C75] to-[#2563eb]">
                        {greeting}
                    </div>
                    <div className="text-gray-500 font-medium mt-1">
                        {formatDate(date)}
                    </div>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                        <div className="text-[#455068] font-medium mb-2">
                            Total Courses
                        </div>
                        <div className="text-3xl font-bold text-purple-800">
                            06
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            1 Elective
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                        <div className="text-[#455068] font-medium mb-2">
                            Attendance
                        </div>
                        <div className="text-3xl font-bold text-red-500">
                            60%
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            24% Absent
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                        <div className="text-[#455068] font-medium mb-2">
                            Requested Leaves
                        </div>
                        <div className="text-3xl font-bold text-blue-500">
                            17
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            11 Approved
                        </div>
                    </div>
                </div>

                
                {showForm && (
                    <form
                        onSubmit={handleAddClass}
                        className="bg-white p-5 rounded-xl shadow-md mt-4 space-y-3 border"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Class Code"
                                value={newClass.code}
                                onChange={(e) =>
                                    setNewClass({
                                        ...newClass,
                                        code: e.target.value,
                                    })
                                }
                                className="border p-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={newClass.name}
                                onChange={(e) =>
                                    setNewClass({
                                        ...newClass,
                                        name: e.target.value,
                                    })
                                }
                                className="border p-2 rounded-lg"
                            />
                            <input
                                type="time"
                                value={newClass.time}
                                onChange={(e) =>
                                    setNewClass({
                                        ...newClass,
                                        time: e.target.value,
                                    })
                                }
                                className="border p-2 rounded-lg"
                            />
                            <select
                                value={newClass.type}
                                onChange={(e) =>
                                    setNewClass({
                                        ...newClass,
                                        type: e.target.value,
                                    })
                                }
                                className="border p-2 rounded-lg"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3 mt-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}

               
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-semibold text-gray-700">
                            Today's Classes
                        </div>
                        <button onClick={() => setShowForm(true)} className="text-blue-500 hover:text-blue-900  transition-colors text-4xl font-bold">
                            +
                        </button>
                    </div>

                    
                    <div className="space-y-3">
                        <div className="text-xl font-medium text-gray-500 uppercase tracking-wider">
                            Upcoming
                        </div>
                        {classes
                            .filter((cls) => cls.type === 'upcoming')
                            .map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center border border-gray-100 hover:border-blue-100"
                                >
                                    <div className="space-y-1">
                                        <div className="text-[#0E2C75] font-semibold">
                                            {cls.code}
                                        </div>
                                        <div className="text-gray-700 font-medium">
                                            {cls.name}
                                        </div>
                                    </div>
                                    <div className="text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                                        {cls.time}
                                    </div>
                                </div>
                            ))}
                    </div>

                   
                    <div className="space-y-3">
                        <div className="text-xl font-medium text-gray-500 uppercase tracking-wider">
                            Past
                        </div>
                        {classes
                            .filter((cls) => cls.type === 'past')
                            .map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center border border-gray-100"
                                >
                                    <div className="space-y-1">
                                        <div className="text-[#0E2C75] font-semibold">
                                            {cls.code}
                                        </div>
                                        <div className="text-gray-700 font-medium">
                                            {cls.name}
                                        </div>
                                    </div>
                                    <div
                                        className={`px-4 py-2 rounded-lg font-medium ${
                                            cls.status === 'Attended'
                                                ? 'text-green-500 bg-green-50'
                                                : 'text-red-500 bg-red-50'
                                        }`}
                                    >
                                        {cls.status}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <div className="text-xl font-semibold text-gray-700">
                        Summary
                    </div>
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
                            <div className="text-gray-700 w-20 text-sm font-medium">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* <button
                onClick={() => setShowForm(true)}
                className="fixed z-30 bottom-20 right-6 bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
            >
                +
            </button> */}
        </div>
    )
}

export default Home
