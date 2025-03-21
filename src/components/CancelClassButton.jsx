'use client'
import { getLectures, modifyAttendance } from '@/firebase/api'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { TiCancel } from 'react-icons/ti'

const CancelButton = ({ lecture, date, setLecture }) => {
    const [isDialog, setDialog] = useState(false)
    const handleClick = () => {
        setDialog(!isDialog)
    }

    return (
        <>
            <button
                className="absolute right-[0.25rem] top-[0.25rem] cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
                onClick={handleClick}
            >
                <MdClose size={25} />
            </button>
            {isDialog && (
                <CancelDialog
                    lecture={lecture}
                    date={date}
                    setLecture={setLecture}
                    setDialog={setDialog}
                />
            )}
        </>
    )
}

const CancelDialog = ({ lecture, date, setLecture, setDialog }) => {
    const [loading, setLoading] = useState(false)
    const handleClose = () => {
        setDialog(false)
    }

    const handleSubmit = async () => {
        setLoading(true)
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
            setDialog(false)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div
            onClick={handleClose}
            className="fixed w-full z-50 inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] flex justify-center items-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center justify-center rounded-lg p-[2rem] gap-[2rem] bg-primary shadow-lg max-w-[35rem]"
            >
                <div className="flex flex-col items-center gap-[1rem]">
                    {/* <TiCancel className="w-[5rem] h-[5rem] text-gray-500" /> */}
                    <h2 className="text-center text-gray-800 font-semibold">
                        Are you sure you want to cancel this class?
                    </h2>
                </div>
                <div
                    className={`flex w-full justify-center gap-[3rem] ${
                        loading ? 'opacity-50' : ''
                    }`}
                >
                    <button
                        onClick={handleClose}
                        className="bg-red p-[1rem] rounded-lg"
                    >
                        <p className="text-gray-800 uppercase font-bold">
                            Cancel
                        </p>
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green p-[1rem] rounded-lg"
                    >
                        <p className="text-gray-800 uppercase font-bold">
                            Confirm
                        </p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CancelButton
