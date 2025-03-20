import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDoc,
} from 'firebase/firestore'

import { app } from '../firebase.config.js'
import { AppError, catchAsync } from '../firebase.error.js'

const db = getFirestore(app)

const USER = collection(db, 'users')

const addNewUser = async (userID, user) => {
    try {
        const userRef = doc(USER, userID)
        await setDoc(userRef, user)

        return { status: 200, message: 'User added successfully' }
    } catch (e) {
        return { status: 500, message: e.message }
    }
}

const updateUser = async (userID, user) => {
    try {
        const userRef = doc(USER, userID)
        await updateDoc(userRef, user)

        return { status: 200, message: 'User updated successfully' }
    } catch (e) {
        return { status: 500, message: e.message }
    }
}

const getLectures = catchAsync(async (userID, semester, date) => {
    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    const lectures = user.data().lectures || {} // get all lectures of the day

    return {
        status: 200,
        message: 'Lectures fetched successfully',
        data: lectures[semester][date] || [],
    }
})

const addExtraLecture = catchAsync(async (userID, lecture, semester, date) => {
    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    const lectures = user.data().lectures || {} // get all lectures of the day

    await updateDoc(userRef, {
        [`lectures.${semester}.${date}`]: arrayUnion(lecture),
    })

    return {
        status: 200,
        message: 'Lecture added successfully',
        data: lectures,
    }
})

const modifyAttendance = async (userID, to, from, date, courseCode, status) => {
    try {
        if (!['present', 'absent', 'medical'].includes(status))
            throw new AppError('Invalid status', 400)

        if (!to || !from || !date || !courseCode || !status || !userID)
            throw new AppError('Please, provide all the required fields', 400)

        const userRef = doc(USER, userID)
        const user = await getDoc(userRef)

        if (!user.exists()) throw new AppError('User not found', 404)

        let lectures = user.data().lectures || [] // get all lectures of the day

        lectures = lectures.map((lecture) => {
            if (
                lecture.to === to &&
                lecture.from === from &&
                lecture.date === date &&
                lecture.courseCode === courseCode
            )
                lecture.status = status

            return lecture
        })

        await updateDoc(userRef, {
            lectures: arrayUnion(lectures),
        })

        return {
            status: 200,
            message: 'Attendance marked successfully',
            data: lectures,
        }
    } catch (error) {
        return {
            status: error.code || 500,
            message: error.message || 'Internal server error',
            stack: error.stack || null,
        }
    }
}

const getAttendanceReport = async (userID, semester) => {
    try {
        const userRef = doc(USER, userID)
        const user = await getDoc(userRef)

        if (!user.exists()) throw new AppError('User not found', 404)

        const report = user
            .data()
            .courses[semester].map((course) => ({
                ...course,
                presentPercentage:
                    Number(
                        (
                            (course.present + course.medical) /
                            (course.present + course.absent + course.medical)
                        ).toFixed(2)
                    ) * 100,
                absentPercentage:
                    Number(
                        (
                            course.absent /
                            (course.present + course.absent + course.medical)
                        ).toFixed(2)
                    ) * 100,
                maximumAchievableAttendance:
                    Number(
                        ((course.total - course.absent) / course.total).toFixed(
                            2
                        )
                    ) * 100,
                minimumLecturesToAttend: Math.floor(
                    course.total * 0.75 - course.present + course.medical
                ),
            }))
            .sort((a, b) => a.courseCode.localeCompare(b.courseCode))

        return { status: 200, message: 'Attendance report', data: report }
    } catch (error) {
        return {
            status: error.code || 500,
            message: error.message || 'Internal server error',
            stack: error.stack || null,
        }
    }
}

export {
    addNewUser,
    updateUser,
    getLectures,
    addExtraLecture,
    modifyAttendance,
    getAttendanceReport,
}
