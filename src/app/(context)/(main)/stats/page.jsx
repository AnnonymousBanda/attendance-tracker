'use client'

import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay } from 'swiper/modules'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Loader, PieChart, PredictionsBar } from '@/components'
import { getAttendanceReport } from '@/firebase/api'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    annotationPlugin
)

const Stats = () => {
    const [courseData, setCourseData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAttendanceReport('1', '4')
                setCourseData(res.data)
                setLoading(false)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`
        const lastDigit = day % 10
        return `${day}${['th', 'st', 'nd', 'rd'][lastDigit] || 'th'}`
    }

    const options = { month: 'long' }
    const month = new Date().toLocaleDateString('en-IN', options)
    const day = new Date().getDate()
    const formattedDate = `${month} ${getOrdinalSuffix(day)}`

    const labels = courseData.map((data) => data.courseCode)
    const chartHeight = labels.length * 45
    const values = courseData.map((data) => data.presentPercentage)

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Attendance',
                data: values,
                backgroundColor: (context) => {
                    const value = context.raw
                    if (value >= 90) return 'rgba(75, 192, 192, 0.5)'
                    if (value >= 75) return 'rgba(255, 206, 86, 0.5)'
                    return 'rgba(255, 99, 132, 0.5)'
                },
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
            },
        ],
    }

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.raw}%`
                    },
                },
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        scaleID: 'x',
                        value: 75,
                        borderColor: 'rgba(220, 53, 69)',
                        borderWidth: 1,
                        borderDash: [6, 6],
                        label: {
                            display: true,
                            content: '75%',
                            backgroundColor: 'rgba(220, 53, 69)',
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
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex flex-col items-center p-4 gap-8 bg-primary rounded-lg">
                    <h2 className="font-bold text-gray-500">
                        Today, {formattedDate}
                    </h2>
                    <div className="flex flex-col items-center w-full gap-4 border-2 border-gray-200 rounded-lg p-4">
                        <h2>Attendance Report</h2>
                        <div
                            className="w-full mx-auto"
                            style={{ height: `${chartHeight}px` }}
                        >
                            <Bar data={data} options={chartOptions} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full gap-4 border-2 border-gray-200 rounded-lg px-6 py-4">
                        <h1>Analysis</h1>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            modules={[Autoplay]}
                            className="w-full"
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            speed={800}
                        >
                            {courseData.map((data) => (
                                <SwiperSlide key={data.courseCode}>
                                    <div className="flex flex-col items-center justify-evenly w-full min-h-[400px] bg-primary border-2 border-gray-200 rounded-lg p-[1rem]">
                                        <h2 className="text-center">
                                            {data.courseCode} -{' '}
                                            {data.courseName}
                                        </h2>
                                        <div className="flex justify-center items-center w-[250px] my-4">
                                            <PieChart courseData={data} />
                                        </div>
                                        <p className="text-center">
                                            Current attendance:{' '}
                                            <span
                                                className={`font-bold px-2 py-1 rounded-lg ${
                                                    data.presentPercentage >= 90
                                                        ? 'bg-[#4BC0C0]'
                                                        : data.presentPercentage >=
                                                          75
                                                        ? 'bg-yellow-300'
                                                        : 'bg-[#FF6384]'
                                                }`}
                                            >
                                                {Math.floor(
                                                    data.presentPercentage || 0
                                                )}
                                                %
                                            </span>
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="flex flex-col items-center w-full gap-[2.5rem] border-2 border-gray-200 rounded-lg px-6 py-4">
                        <h1>Predictions</h1>
                        <PredictionsBar courseData={courseData} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Stats
