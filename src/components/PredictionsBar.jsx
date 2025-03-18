import { Legend, plugins } from 'chart.js'
import { Bar } from 'react-chartjs-2'

export default function PredictionsBar({ courseData }) {
    const labels = courseData.map((course) => course.courseCode)
    const chartHeight = courseData.length   * 50 *2
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Actual Attendance',
                data: [50, 60, 70, 80, 90],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
            },
            {
                label: 'Predicted Attendance if all classes are attended',
                data: [60, 70, 80, 90, 100],
                backgroundColor: (context) => {
                    const value = context.raw
                    if (value >= 90) return 'rgba(75, 255, 100, 0.5)'
                    if (value >= 75) return 'rgba(255, 206, 86, 0.5)'
                    return 'rgba(255, 99, 132, 0.5)'
                },
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
            },
            {
                label: 'Predicted Attendance if 75% is maintained',
                data: [75, 75, 75, 75, 75],
                backgroundColor: (context) => {
                    const value = context.raw
                    if (value >= 90) return 'rgba(75, 255, 100, 0.5)'
                    if (value >= 75) return 'rgba(255, 206, 86, 0.5)'
                    return 'rgba(255, 99, 132, 0.5)'
                },
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                barPercentage: 0.7,
            },
        ],
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                labels: {
                    boxWidth: 20,
                    padding: 20,
                },
            },
        }
    }

    const options = {
        indexAxis: 'y',
        responsive: true,
        maitainAspectRatio: false,
        Legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
                boxWidth: 20,
                padding: 20,

            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }

    return (
        <div className='w-full h-full'>
            <Bar data={data} options={options} height={chartHeight}/>
        </div>
    )
}
