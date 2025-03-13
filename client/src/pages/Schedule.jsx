import React from 'react'
import DaySelector from '../components/DaySelector'

export default function Schedule() {
    const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
        <div>
            <DaySelector days={daysList} />
        </div>
    )
}
