const { MdClose } = require('react-icons/md')

const AttendanceButton = ({ lecture }) => {
    const handleClick = () => {
        console.log('Cancel class button clicked')
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
