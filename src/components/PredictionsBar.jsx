import { Bar } from 'react-chartjs-2'

export default function PredictionsBar({ courseData }) {
    const labels = courseData.map((course) => course.courseCode)
    const chartHeight = courseData.length * 45

    const totalClasses = {
        labels: labels,
        datasets: [
            {
                label: 'Classes',
                data: [4, 5, 12, 7, 10],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
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

    const totalClassesOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
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
                data: [60, 70, 80, 90, 100],
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
            y: {
                beginAtZero: true,
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
                            zAjust: 20,
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
        },
    }

    return (
        <>
            <div className="w-full">
                <h3 className="w-full">
                    Minimum classes to maintain 75%.
                </h3>
                <div className="w-full">
                    <Bar
                        data={totalClasses}
                        options={totalClassesOptions}
                        height={chartHeight}
                    />
                </div>
            </div>
            <div className="w-full">
                <h3 className="w-full">
                    Predicted attendance if all remaining classes are attended.
                </h3>
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
