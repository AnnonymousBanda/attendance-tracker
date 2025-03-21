import { getLectures, modifyAttendance } from '@/firebase/api'

const { MdClose } = require('react-icons/md')

const AttendanceButton = ({ lecture, date, setLecture }) => {
    const handleClick = async () => {
        try {
            const res = await modifyAttendance(
                '1',
                '4',
                lecture.to,
                lecture.from,
                date,
                lecture.courseCode,
                'cancelled'
            )

            if (!res) throw new Error('Failed to cancel class')

            if (res.status !== 200) throw new Error(res.message)

            console.log(res)
            setLecture([...res.data])
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <button
            className="absolute right-[0.25rem] top-[0.25rem] cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
            onClick={handleClick}
        >
            <MdClose size={25} />
        </button>
    )
}

export default AttendanceButton
