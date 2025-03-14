import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const Stats = () => {
    const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`
        const lastDigit = day % 10
        return `${day}${['th', 'st', 'nd', 'rd'][lastDigit] || 'th'}`
    }

    const options = { month: 'long' }
    const month = new Date().toLocaleDateString('en-IN', options)
    const day = new Date().getDate()
    const formattedDate = `${month} ${getOrdinalSuffix(day)}`

    const data = {
        labels: ['Attended', 'Absent', 'Sick'],
        datasets: [
            {
                data: [7, 2, 1],
                backgroundColor: [
                    'rgba(75, 255, 192, 0.8)',
                    'rgba(255, 10, 50, 0.8)',
                    'rgba(201, 203, 220, 0.8)',
                ],
                borderColor: [
                    'rgba(0, 0, 0, 0.8)',
                    'rgba(0, 0, 0, 0.8)',
                    'rgba(0, 0, 0, 0.8)',
                ],
                borderWidth: 2,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial',
                        weight: 'bold',
                    },
                    color: '#333',
                    padding: 20,
                    boxWidth: 20,
                },
            },
        },
    }

    return (
        <div className="max-container flex flex-col items-center py-[1rem] gap-[2rem]">
            <h2 className="font-[900] text-[#858699]">
                Today, {formattedDate}
            </h2>
            <div className="flex flex-col w-full gap-[1rem] border-[2px] border-solid border-[#f0f0f0] rounded-[1rem] p-[1rem]">
                <h2 className="font-bold">Monthly Report</h2>
                <div className="w-[200px] mx-auto">
                    <Pie data={data} options={chartOptions} />
                </div>
            </div>
        </div>
    )
}

export default Stats
