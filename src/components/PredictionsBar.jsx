import { Bar } from 'react-chartjs-2'

export default function PredictionsBar({ courseData }) {
    const labels = courseData.map((course) => course.courseCode)
    const chartHeight = courseData.length * 45
    const minLectureData = courseData.map(
        (course) => course.minimumLecturesToAttend || 0
    )
    const maxValueClasses = Math.max(...minLectureData)

    const maxAchievableAttendance = courseData.map(
        (course) => course.maximumAchievableAttendance
    )

    const totalClasses = {
        labels: labels,
        datasets: [
            {
                label: 'Classes',
                data: minLectureData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
                fontFamily: 'Roboto Mono',
            },
        ],
        plugins: {
            legend: {
                display: false,
            },
        },
    }

    const totalClassesOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                max: maxValueClasses + 2,
                ticks: {
                    font: {
                        size: 13,
                        family: 'Roboto Mono',
                    },
                    color: '#333',
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 13,
                        family: 'Roboto Mono',
                    },
                    color: '#333',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: '#fff',
                font: {
                    family: 'Roboto Mono',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`
                    },
                },
            },
        },
    }

    const totalPrediction = {
        labels: labels,
        datasets: [
            {
                label: 'Predicted Attendance',
                data: maxAchievableAttendance,
                backgroundColor: (context) => {
                    const value = context.raw
                    if (value >= 75) return 'rgba(75, 192, 192, 0.5)'
                    return 'rgba(255, 99, 132, 0.5)'
                },
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
            },
        ],
        plugins: {
            legend: {
                display: false,
            },
        },
    }

    const totalPredictionOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: { size: 13, family: 'Roboto Mono' },
                    color: '#333',
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 13, family: 'Roboto Mono' },
                    color: '#333',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    family: 'Roboto Mono',
                },
                formatter: (value) => {
                    return `${value}%`
                },
            },
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
                        },
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.raw}%`
                    },
                },
            },
        },
    }

    return (
        <>
            <div className="w-full">
                <h3 className="w-full">Minimum classes to maintain 75%</h3>
                <div className="w-full">
                    <Bar
                        data={totalClasses}
                        options={totalClassesOptions}
                        height={chartHeight}
                    />
                </div>
            </div>
            <div className="w-full">
                <h3 className="w-full">Maximum acheivable attendance</h3>
                <div className="w-full">
                    <Bar
                        data={totalPrediction}
                        options={totalPredictionOptions}
                        height={chartHeight}
                    />
                </div>
            </div>
        </>
    )
}
