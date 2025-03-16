'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ courseData }) => {
    const labels = ['Attended', 'Absent', 'Medical']
    const attendance = [
        courseData.attended,
        courseData.total - courseData.attended - courseData.medical,
        courseData.medical,
    ]
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Classes',
                data: attendance,
                backgroundColor: [
                    'rgba(0, 255, 0, 0.4)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderColor: '#ffffff',
                borderWidth: 1.5,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 20, 
                    borderWidth: 2, 
                    borderColor: 'black',
                },
            },
        },
        radius: '90%',
    }

    return <Pie data={data} options={options} />
}

export default PieChart
