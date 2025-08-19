'use client'

import { XMarkIcon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { profilePic } from '@/assets'
import { HiAcademicCap } from 'react-icons/hi2'
import { IoCalendar, IoBook, IoClose } from 'react-icons/io5'
import { MdBugReport, MdLogout, MdModeEdit } from 'react-icons/md'
import { BiSolidBookBookmark } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context'
import { useState, useEffect } from 'react'
import {
    modifySemester,
    getAttendanceReport,
    updateAttendance, // <-- use your backend function
} from '@/firebase/api/firebase.firestore'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader } from '@/components'

export default function ProfileDialog({ setisDialogOpen }) {
    const { user, logout } = useAuth()
    const [courses, setCourses] = useState([])
    const [attendanceReport, setAttendanceReport] = useState([]) // per-course attendance aggregates
    const [originalAttendance, setOriginalAttendance] = useState({}) // to revert on cancel
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const [semester, setSemester] = useState(user?.semester)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [coursesExpanded, setCoursesExpanded] = useState(false) // accordion toggle
    const [savingCourseId, setSavingCourseId] = useState(null) // for per-course save state
    const [editingCourse, setEditingCourse] = useState(null) // which course is in edit mode
    const router = useRouter()

    const handleClose = () => {
        setisDialogOpen(false)
    }

    useEffect(() => {
        const fetchReport = async () => {
            if (!user) {
                toast.error('User not authenticated', {
                    className: 'toast-error',
                })
                return
            }
            setLoading(true)
            try {
                const reportRes = await getAttendanceReport(
                    user.userID,
                    user.semester
                )
                const reportData = reportRes?.data || []

                const normalized = reportData.map((r) => ({
                    courseCode: r.courseCode,
                    courseName: r.courseName || r.courseTitle || '',
                    present: r.present ?? 0,
                    absent: r.absent ?? 0,
                    medical: r.medical ?? 0,
                }))

                setAttendanceReport(normalized)

                const originalMap = {}
                normalized.forEach((r) => {
                    originalMap[r.courseCode] = {
                        present: r.present,
                        absent: r.absent,
                        medical: r.medical,
                    }
                })
                setOriginalAttendance(originalMap)

                const courseList = normalized.map((r) =>
                    r.courseName
                        ? `${r.courseCode} - ${r.courseName}`
                        : r.courseCode
                )
                setCourses(courseList)

                setLoading(false)
            } catch (error) {
                toast.error(
                    error.message || 'Failed to load attendance report',
                    {
                        className: 'toast-error',
                    }
                )
                setLoading(false)
            }
        }

        fetchReport()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleEdit = () => {
        setEdit(true)
    }

    const handleCancel = () => {
        setEdit(false)
        setSemester(user?.semester)
    }

    const handleChangeSem = async () => {
        setLoading(true)
        try {
            const res = await modifySemester(user?.userID, semester)
            if (res.status !== 200) throw new Error(res.message)

            setEdit(false)
            toast.success('Semester updated', { className: 'toast-success' })
            setLoading(false)
            setisDialogOpen(false)
            router.replace('/')
        } catch (error) {
            toast.error(error.message || 'Failed to update semester', {
                className: 'toast-error',
            })
            setLoading(false)
        }
    }

    const toggleCoursesExpanded = () => setCoursesExpanded((s) => !s)

    const onChangeCourseValue = (index, field, value) => {
        setAttendanceReport((prev) => {
            const copy = [...prev]
            const val = Number(value)
            copy[index] = { ...copy[index], [field]: isNaN(val) ? 0 : val }
            return copy
        })
    }

    const startEditCourse = (courseCode) => {
        setEditingCourse(courseCode)
    }

    const cancelEditCourse = (index, courseCode) => {
        const orig = originalAttendance[courseCode] || {
            present: 0,
            absent: 0,
            medical: 0,
        }
        setAttendanceReport((prev) => {
            const copy = [...prev]
            copy[index] = { ...copy[index], ...orig }
            return copy
        })
        setEditingCourse(null)
    }

    // save one course using updateAttendance backend function you provided
    const saveCourse = async (courseObj) => {
        setSavingCourseId(courseObj.courseCode)
        try {
            const res = await updateAttendance(
                user.userID,
                user.semester,
                courseObj.courseCode,
                {
                    present: Number(courseObj.present) || 0,
                    absent: Number(courseObj.absent) || 0,
                    medical: Number(courseObj.medical) || 0,
                }
            )

            if (res?.status && res.status !== 200) {
                throw new Error(res.message || 'Failed to update')
            }

            setOriginalAttendance((prev) => ({
                ...prev,
                [courseObj.courseCode]: {
                    present: Number(courseObj.present) || 0,
                    absent: Number(courseObj.absent) || 0,
                    medical: Number(courseObj.medical) || 0,
                },
            }))

            toast.success('Course attendance saved', {
                className: 'toast-success',
            })
            setEditingCourse(null)
        } catch (err) {
            toast.error(err.message || 'Failed to save', {
                className: 'toast-error',
            })
        } finally {
            setSavingCourseId(null)
        }
    }

    const saveAllCourses = async () => {
        setLoading(true)
        try {
            for (const c of attendanceReport) {
                const orig = originalAttendance[c.courseCode] || {
                    present: 0,
                    absent: 0,
                    medical: 0,
                }
                if (
                    Number(c.present) !== Number(orig.present) ||
                    Number(c.absent) !== Number(orig.absent) ||
                    Number(c.medical) !== Number(orig.medical)
                ) {
                    await updateAttendance(
                        user.userID,
                        user.semester,
                        c.courseCode,
                        {
                            present: Number(c.present) || 0,
                            absent: Number(c.absent) || 0,
                            medical: Number(c.medical) || 0,
                        }
                    )
                }
            }

            const newOrig = {}
            attendanceReport.forEach((r) => {
                newOrig[r.courseCode] = {
                    present: r.present,
                    absent: r.absent,
                    medical: r.medical,
                }
            })
            setOriginalAttendance(newOrig)
            setEdit(false)
            setisDialogOpen(false)
            router.replace('/')

            toast.success('All courses saved', { className: 'toast-success' })
        } catch (err) {
            toast.error(err.message || 'Failed to save all', {
                className: 'toast-error',
            })
        } finally {
            setLoading(false)
            setEditingCourse(null)
        }
    }

    return (
        <div
            onClick={handleClose}
            className="fixed z-50 inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] flex justify-center items-center h-screen"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="lg:max-w-[35vw] w-full bg-primary h-full p-[2rem] flex flex-col gap-[2rem] max-container"
            >
                {/* Header */}
                <div className="flex justify-between items-center h-auto">
                    <div className="flex justify-center items-center gap-[0.5rem]">
                        <UserCircleIcon className="w-[2.5rem] h-[2.5rem]" />
                        <h2 className="font-[900] uppercase tracking-wide">
                            Profile
                        </h2>
                    </div>
                    <button onClick={handleClose}>
                        <XMarkIcon className="w-[2.8rem] h-[2.8rem] cursor-pointer" />
                    </button>
                </div>

                <div className="h-full">
                    {/* Main content */}
                    <div className="flex flex-col h-full justify-center items-center">
                        {/* Profile picture + basic info */}
                        <div className="flex justify-center items-center gap-[2rem] w-full p-[1rem] rounded-lg">
                            <Image
                                src={profilePic}
                                alt="User icon"
                                className="w-[8rem] h-[8rem]"
                            />
                            <div className="flex flex-col gap-[0.5rem] justify-center">
                                <h1 className="text-[1.7rem]">{user?.name}</h1>
                                <h2 className="text-[1.5rem]">{user?.roll}</h2>
                                <h2 className="text-[1.5rem]">{user?.email}</h2>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-between h-full gap-[1.2rem] w-full overflow-auto">
                            <div className="flex flex-col w-full justify-center items-center p-[1rem] gap-[1rem]">
                                {/* Branch */}
                                <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                    <BiSolidBookBookmark className="w-[3.3rem] h-[4rem]" />
                                    <div className="flex flex-col w-full justify-center">
                                        <h3 className="font-bold">Branch</h3>
                                        <p>{user?.branch}</p>
                                    </div>
                                </div>
                                {/* Batch */}
                                <div className="flex justify-center w-full bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                    <HiAcademicCap className="w-[3.3rem] h-[4rem]" />
                                    <div className="flex flex-col w-full justify-center">
                                        <h3 className="font-bold">Batch</h3>
                                        <p>{user?.batch}</p>
                                    </div>
                                </div>
                                {/* Semester */}
                                <div className="flex justify-center w-full items-center bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg relative">
                                    <IoCalendar className="w-[3.3rem] h-[4rem]" />
                                    <div className="flex flex-col flex-1 w-full justify-center">
                                        <h3 className="font-bold">Semester</h3>
                                        <input
                                            onChange={(e) =>
                                                setSemester(e.target.value)
                                            }
                                            type="number"
                                            value={semester}
                                            disabled={!edit}
                                            className={`w-[4rem] text-[1.2rem] md:text-[1.6rem] text-right ${
                                                edit
                                                    ? 'bg-white rounded-lg'
                                                    : 'border-none'
                                            }`}
                                        />
                                    </div>
                                    {!edit && (
                                        <button
                                            onClick={handleEdit}
                                            className="bg-secondary p-[0.5rem] rounded-lg cursor-pointer hover:bg-black"
                                        >
                                            <MdModeEdit className="w-[2rem] text-primary h-[2rem]" />
                                        </button>
                                    )}
                                    {edit && (
                                        <div className="flex gap-[0.5rem] justify-center items-center absolute top-0 translate-y-[55%] right-[5rem]">
                                            <button
                                                onClick={handleCancel}
                                                className="bg-red py-[0.75rem] px-[1rem] rounded-lg cursor-pointer hover:bg-red-600"
                                            >
                                                <h4 className="uppercase">
                                                    Cancel
                                                </h4>
                                            </button>
                                            <button
                                                onClick={handleChangeSem}
                                                disabled={loading}
                                                className={`bg-green py-[0.75rem] px-[1rem] rounded-lg cursor-pointer hover:bg-green-600 ${
                                                    loading
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : ''
                                                }`}
                                            >
                                                <h4 className="uppercase">
                                                    Save
                                                </h4>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Courses + Attendance Editor */}
                                <div className="flex flex-col w-full bg-[#d7e4ee] p-[1rem] gap-[1rem] rounded-lg">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row gap-[1rem] items-center">
                                            <IoBook className="w-[3.3rem] h-[4rem]" />
                                            <h3 className="font-bold">
                                                Courses
                                            </h3>
                                        </div>
                                        {/* Edit toggle button */}
                                        <div>
                                            <button
                                                onClick={toggleCoursesExpanded}
                                                className={`${
                                                    coursesExpanded
                                                        ? 'bg-red'
                                                        : 'bg-secondary'
                                                } py-[0.5rem] px-[0.75rem] rounded-lg hover:opacity-80 transition-colors cursor-pointer text-white`}
                                            >
                                                <h4 className="bg-secondary p-[0.5rem] rounded-lg cursor-pointer hover:bg-black">
                                                    {coursesExpanded ? (
                                                        <IoClose className="w-8 h-8 text-red-600 cursor-pointer" />
                                                    ) : (
                                                        <MdModeEdit className="w-[2rem] text-primary h-[2rem]" />
                                                    )}
                                                </h4>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-[0.5rem]">
                                        {loading ? (
                                            <Loader />
                                        ) : (
                                            <>
                                                {!coursesExpanded && (
                                                    <div className="flex flex-col gap-[0.5rem]">
                                                        {courses.map(
                                                            (course, index) => (
                                                                <p
                                                                    key={index}
                                                                    className="text-[1.2rem] md:text-[1.6rem]"
                                                                >
                                                                    {course}
                                                                </p>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {coursesExpanded &&
                                                    attendanceReport.length ===
                                                        0 && (
                                                        <p className="text-[1.2rem]">
                                                            No course attendance
                                                            data available.
                                                        </p>
                                                    )}

                                                {coursesExpanded &&
                                                    attendanceReport.length >
                                                        0 && (
                                                        <div className="flex flex-col gap-[1rem]">
                                                            {/* header row with P A M */}
                                                            <div className="hidden md:flex justify-between items-center px-[0.5rem]">
                                                                <div className="w-1/3">
                                                                    <h4 className="font-semibold">
                                                                        Course
                                                                    </h4>
                                                                </div>
                                                                <div className="w-2/3 flex justify-between">
                                                                    <h4 className="font-semibold">
                                                                        P
                                                                    </h4>
                                                                    <h4 className="font-semibold">
                                                                        A
                                                                    </h4>
                                                                    <h4 className="font-semibold">
                                                                        M
                                                                    </h4>
                                                                    <h4 className="font-semibold">changes</h4>
                                                                </div>
                                                            </div>

                                                            {attendanceReport.map(
                                                                (c, idx) => (
                                                                    <div
                                                                        key={
                                                                            c.courseCode
                                                                        }
                                                                        className="flex flex-col md:flex-row justify-between items-center bg-white p-[0.75rem] rounded-lg"
                                                                    >
                                                                        <div className="flex items-center gap-[0.5rem] w-full md:w-1/3">
                                                                            <button
                                                                                onClick={() =>
                                                                                    startEditCourse(
                                                                                        c.courseCode
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    editingCourse ===
                                                                                    c.courseCode
                                                                                }
                                                                                className={`bg-secondary p-[0.4rem] rounded-lg ${
                                                                                    editingCourse ===
                                                                                    c.courseCode
                                                                                        ? 'opacity-50 cursor-not-allowed'
                                                                                        : 'hover:bg-black'
                                                                                }`}
                                                                            >
                                                                                <MdModeEdit className="w-[1.4rem] h-[1.4rem] text-primary" />
                                                                            </button>

                                                                            <div className="flex flex-col">
                                                                                <h3 className="font-bold">
                                                                                    {
                                                                                        c.courseCode
                                                                                    }
                                                                                </h3>
                                                                                <p className="text-md">
                                                                                    {
                                                                                        c.courseName
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex-1 w-full md:w-2/3 flex gap-[0.5rem] justify-between items-center mt-[0.5rem] md:mt-0">
                                                                            <input
                                                                                type="number"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                value={
                                                                                    c.present
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onChangeCourseValue(
                                                                                        idx,
                                                                                        'present',
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    editingCourse !==
                                                                                    c.courseCode
                                                                                }
                                                                                className="w-[4.5rem] text-[1rem] md:text-[1.2rem] text-right bg-white rounded-lg p-[0.25rem]"
                                                                            />
                                                                            <input
                                                                                type="number"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                value={
                                                                                    c.absent
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onChangeCourseValue(
                                                                                        idx,
                                                                                        'absent',
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    editingCourse !==
                                                                                    c.courseCode
                                                                                }
                                                                                className="w-[4.5rem] text-[1rem] md:text-[1.2rem] text-right bg-white rounded-lg p-[0.25rem]"
                                                                            />
                                                                            <input
                                                                                type="number"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                value={
                                                                                    c.medical
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onChangeCourseValue(
                                                                                        idx,
                                                                                        'medical',
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    editingCourse !==
                                                                                    c.courseCode
                                                                                }
                                                                                className="w-[4.5rem] text-[1rem] md:text-[1.2rem] text-right bg-white rounded-lg p-[0.25rem]"
                                                                            />

                                                                            <div className="flex gap-[0.5rem] ml-[1rem]">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        cancelEditCourse(
                                                                                            idx,
                                                                                            c.courseCode
                                                                                        )
                                                                                    }
                                                                                    className="bg-red py-[0.4rem] px-[0.75rem] rounded-lg cursor-pointer hover:bg-red-600"
                                                                                >
                                                                                    <h4 className="uppercase">
                                                                                        Cancel
                                                                                    </h4>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        saveCourse(
                                                                                            c
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        savingCourseId ===
                                                                                        c.courseCode
                                                                                    }
                                                                                    className={`bg-green py-[0.4rem] px-[0.75rem] rounded-lg cursor-pointer hover:bg-green-600 ${
                                                                                        savingCourseId ===
                                                                                        c.courseCode
                                                                                            ? 'opacity-50 cursor-not-allowed'
                                                                                            : ''
                                                                                    }`}
                                                                                >
                                                                                    <h4 className="uppercase">
                                                                                        Save
                                                                                    </h4>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}

                                                            <div className="flex justify-end mt-[0.5rem]">
                                                                <button
                                                                    onClick={() => {
                                                                        saveAllCourses()
                                                                        // handleChangeSem()
                                                                    }}
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    className={`bg-primary py-[0.6rem] px-[1rem] rounded-lg cursor-pointer hover:opacity-90 ${
                                                                        loading
                                                                            ? 'opacity-50 cursor-not-allowed'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <h4 className="uppercase">
                                                                        Save All
                                                                    </h4>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bug Report + Logout */}
                        </div>
                        <div className="flex flex-col w-full bg-[#d7e4ee] justify-center items-center mt-[4rem] p-[1rem] gap-[1rem] rounded-lg">
                            <Link
                                href="https://forms.gle/DjoRKfTt6NNjepzU9"
                                target="#"
                                className="w-full flex justify-center items-center bg-primary p-[1rem] gap-[1rem] rounded-lg"
                            >
                                <MdBugReport className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold">Report a Bug</h3>
                                </div>
                            </Link>
                            <button
                                className={`w-full flex justify-center items-center bg-red-300 p-[1rem] gap-[1rem] rounded-lg cursor-pointer ${
                                    buttonClicked
                                        ? 'opacity-50 '
                                        : 'hover:bg-red '
                                }`}
                                onClick={async () => {
                                    setButtonClicked(true)
                                    await logout()
                                    setButtonClicked(false)
                                }}
                            >
                                <MdLogout className="w-[3rem] h-[4rem]" />
                                <div className="flex flex-col w-full justify-center">
                                    <h3 className="font-bold uppercase">
                                        Logout
                                    </h3>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
