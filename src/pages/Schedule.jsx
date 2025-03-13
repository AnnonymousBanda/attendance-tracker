import React from 'react'
import { DaySelector } from '../components'

const Schedule = () => {
    const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
        <div>
            <DaySelector days={daysList} />
        </div>
    )
}

export default Schedule
