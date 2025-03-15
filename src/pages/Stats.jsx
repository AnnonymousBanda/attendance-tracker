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

    const courseData = [
        {
            courseCode: 'CS2201',
            courseName: 'Data Structures and Algorithms',
            attended: 6,
            medical: 1,
            total: 10,
            attendance: 70,
            prediction: 'You need to attend 2 more classes to maintain 75%',
        },
        {
            courseCode: 'CS2202',
            courseName: 'Computer Networks',
            attended: 7,
            medical: 0,
            total: 10,
            attendance: 80,
            prediction: 'You need to attend 1 more class to maintain 75%',
        },
        {
            courseCode: 'CS2203',
            courseName: 'Database Management Systems',
            attended: 5,
            medical: 2,
            total: 10,
            attendance: 50,
            prediction: 'You need to attend 5 more classes to maintain 75%',
        },
        {
            courseCode: 'CS2204',
            courseName: 'Software Engineering',
            attended: 9,
            medical: 0,
            total: 10,
            attendance: 90,
            prediction: 'You can skip 1 more class to maintain 75%',
        },
        {
            courseCode: 'CS2207',
            courseName: 'Operating Systems',
            attended: 8,
            medical: 0,
            total: 10,
            attendance: 80,
            prediction: 'You need to attend 1 more class to maintain 75%',
        },
    ]

    const labels = courseData.map((data) => data.courseCode)
    const chartHeight = labels.length * 50
    const values = courseData.map((data) => data.attendance)

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Attendance Report',
                data: values,
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
                <div
                    className="w-full mx-auto"
                    style={{ height: `${chartHeight}px` }}
                >
                    <Bar data={data} options={chartOptions} />
                </div>
            </div>
            <div className="flex flex-col items-center w-full gap-[1rem] border-[2px] border-solid border-[#f0f0f0] rounded-[1rem] px-[1.5rem] py-[1rem]">
                <h1 className="font-bold">Analysis</h1>
                <div className="w-full flex flex-col items-center gap-[1rem]">
                    <div className="flex w-full flex-col gap-[4rem]">
                        {courseData.map((data) => (
                            <div className="flex flex-col justify-between w-full gap-[1.3rem] bg-primary">
                                <h2 className="font-bold">
                                    {data.courseCode} - {data.courseName}
                                </h2>
                                <div className="flex justify-center items-center w-full gap-[1rem]">
                                    <div className="flex flex-col p-[0.5rem] justify-center items-center gap-[0.2rem] w-[10rem] bg-[#4bff63b7] rounded-xl shadow-lg">
                                        <p>{data.attended}</p>
                                        <p>Attended</p>
                                    </div>
                                    <div className="flex flex-col p-[0.5rem] justify-center items-center gap-[0.2rem] w-[10rem] bg-[#FF6384b7] rounded-xl shadow-lg">
                                        <p>{data.total - data.attended}</p>
                                        <p>Absent</p>
                                    </div>
                                    <div className="flex flex-col p-[0.5rem] justify-center items-center gap-[0.2rem] w-[10rem] bg-tertiary rounded-xl shadow-lg">
                                        <p>{data.total}</p>
                                        <p>Total</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-[1rem] px-[1rem] w-full">
                                    <p className="w-full">
                                        Medical Leaves requested: {data.medical}
                                    </p>
                                    <p className='w-full'>
                                        Your current attendance for the course{' '}
                                        <b>{data.courseCode}</b> is{' '}
                                        <b>{data.attendance}%</b>
                                    </p>
                                    <div
                                        className={`w-full rounded-[1rem] ${
                                            data.attendance > 75
                                                ? 'bg-[#4bff63b7]'
                                                : 'bg-[#FF6384b7]'
                                        } p-[1rem]`}
                                    >
                                        <h2 className="font-bold">
                                            Prediction
                                        </h2>
                                        <p>{data.prediction}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats
