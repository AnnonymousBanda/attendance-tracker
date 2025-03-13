import React from 'react'
import Calender from '../components/Calender'

const Timetable = () => {
    const daysData = [
        { name: 'Mon', date: '7' },
        { name: 'Tue', date: '7' },
        { name: 'Wed', date: '7' },
        { name: 'Thu', date: '7' },
        { name: 'Fri', date: '7' },
        { name: 'Sat', date: '7' },
    ]

    return (
        <div>
            <Calender days={daysData} />
        </div>
    )
}

export default Timetable
