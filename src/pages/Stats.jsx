import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    annotationPlugin
) 

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

    const labels = ['CS2201', 'CS2202', 'CS2203', 'CS2204', 'CS2207']
    const chartHeight = labels.length * 50

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Attendance Report',
                data: [62, 76, 89, 99, 100],
                backgroundColor: (context) => {
                    const value = context.raw
                    if (value >= 90) return 'rgba(75, 255, 100, 0.5)'
                    if (value >= 75) return 'rgba(255, 206, 86, 0.5)'
                    return 'rgba(255, 99, 132, 0.5)'
                },
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.8,
            },
        ],
    }

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        scaleID: 'x',
                        value: 75,
                        borderColor: 'red',
                        borderWidth: 1,
                        borderDash: [6, 6],
                        label: {
                            display: true,
                            content: '75%',
                            backgroundColor: 'red',
                            color: 'white',
                            position: 'start',
                            xAdjust: 20,
                            zAjust: 20,
                        },
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: { font: { size: 13 }, color: '#333' },
            },
            y: {
                ticks: { font: { size: 12 }, color: '#333' },
            },
        },
    }

    return (
        <div className="flex flex-col items-center p-[1rem] gap-[2rem] bg-primary rounded-lg">
            <h2 className="font-[900] text-[#858699]">
                Today, {formattedDate}
            </h2>
            <div className="flex flex-col items-center w-full gap-[1rem] border-[2px] border-solid border-[#f0f0f0] rounded-[1rem] p-[1rem]">
                <h2 className="font-bold">Attendance Report</h2>
                <div className="w-full mx-auto" style={{ height: `${chartHeight}px` }}>
                    <Bar data={data} options={chartOptions} />
                </div>
            </div>
            <div className="flex flex-col items-center w-full gap-[1rem] border-[2px] border-solid border-[#f0f0f0] rounded-[1rem] px-[1.5rem] py-[1rem]">
                <h1 className='font-bold'>Analysis</h1>
                <div className='w-full flex flex-col items-center gap-[1rem]'>
                    <div className='flex w-full flex-col gap-[0.5rem]'>
                        <h2 className='font-bold'>CS2201</h2>
                        <p>You are too short of attendance. Be prepared for the debarment mail from the course instructor.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Stats
