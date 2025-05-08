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
import Notion from '@/notion'

const db = getFirestore(app)

const USER = collection(db, 'users')

const register = catchAsync(
    async (
        userID,
        name,
        roll,
        email,
        batch,
        year,
        department,
        branch,
        semester,
        degree
    ) => {
        if (
            !userID ||
            !name ||
            !email ||
            !roll ||
            !batch ||
            !year ||
            !department ||
            !branch ||
            !semester ||
            !degree
        )
            throw new AppError('Please, provide all the required fields', 400)

        if (year < 1 || year > 5) throw new AppError('Invalid year', 400)

        if (degree !== 'BTech' && degree !== 'Dual Degree')
            throw new AppError(
                'Please, select between BTech or Dual Degree',
                400
            )

        if (
            (degree === 'Dual Degree' && (semester < 1 || semester > 10)) ||
            (degree === 'BTech' && (semester < 1 || semester > 8))
        )
            throw new AppError('Invalid semester', 400)

        const n = degree === 'Dual Degree' ? 10 : 8
        const lectures = {}
        for (let i = 1; i <= n; i++)
            lectures[i] = {
                mon: [],
                tue: [],
                wed: [],
                thu: [],
                fri: [],
                sat: [],
                sun: [],
            }

        const courses = {}
        for (let i = 1; i <= n; i++) {
            let temp = await Notion.getCourses(semester, branch)
            courses[i] = []
            temp = temp.sort((a, b) => a.courseCode.localeCompare(b.courseCode))
            temp.forEach((course) => {
                courses[i].push({
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    present: 0,
                    absent: 0,
                    medical: 0,
                })
            })
        }

        const userRef = doc(USER, userID)
        await setDoc(userRef, {
            name,
            email,
            roll,
            batch,
            year,
            department,
            branch,
            degree,
            semester,
            courses,
        })

        return { status: 200, message: 'User added successfully' }
    }
)

const getUser = catchAsync(async (userID) => {
    if (!userID)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    return {
        status: 200,
        message: 'User fetched successfully',
        data: {
            userID: userID,
            name: user.data().name,
            email: user.data().email,
            roll: user.data().roll,
            department: user.data().department,
            branch: user.data().branch,
            degree: user.data().degree,
            semester: user.data().semester,
            batch: user.data().batch,
            year: user.data().year,
        },
    }
})

const modifySemester = catchAsync(async (userID, semester) => {
    if (!userID || !semester)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    degree = user.data().degree
    semester = Number(semester)
    if (
        (degree === 'Dual Degree' && (semester < 1 || semester > 10)) ||
        (degree === 'BTech' && (semester < 1 || semester > 8))
    )
        throw new AppError('Invalid semester', 400)

    await updateDoc(userRef, { semester })

    return { status: 200, message: 'Semester updated successfully' }
})

const getLectures = catchAsync(async (userID, semester, day) => {
    if (!userID || !semester || !day)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    let branch = user.data().branch

    let lecturesFirebase =
        user
            .data()
            .lectures?.[
                semester
            ]?.filter((lecture) => lecture.status !== 'cancelled') || []
    let lecturesNotion = (await Notion.getLectures(semester, day, branch)) || []

    const lectures = []
    lectures.concat(lecturesFirebase).concat(lecturesNotion)
    lectures?.sort((a, b) => a.from.localeCompare(b.from))

    return {
        status: 200,
        message: 'Lectures fetched successfully',
        data: lectures || [],
    }
})

const addExtraLecture = catchAsync(async (userID, lecture, semester, day) => {
    const { to, from, courseCode, courseName } = lecture
    if (
        !to ||
        !from ||
        !day ||
        !semester ||
        !userID ||
        !courseCode ||
        !courseName
    )
        throw new AppError('Please, provide all the required fields', 400)

    const [fromH, fromM] = from.split(':').map(Number)
    const [toH, toM] = to.split(':').map(Number)
    if (toH < fromH || (toH === fromH && toM <= fromM))
        throw new AppError('Invalid time', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    let lectures = await getLectures(userID, semester, day).data

    if (
        lectures.some((lecture) => {
            return lecture.to > from && lecture.from < to
        })
    )
        throw new AppError('Lecture time conflict', 400)

    await updateDoc(userRef, {
        [`lectures.${semester}.${day}`]: arrayUnion(lecture),
    })

    lectures.concat(lecture)
    lectures.sort((a, b) => a.from.localeCompare(b.from))

    return {
        status: 200,
        message: 'Lecture added successfully',
        data: lectures,
    }
})

const modifyAttendance = catchAsync(
    async (userID, semester, to, from, day, courseCode, status) => {
        if (!['present', 'absent', 'medical', 'cancelled'].includes(status))
            throw new AppError('Invalid status', 400)

        if (!to || !from || !day || !courseCode || !status || !userID)
            throw new AppError('Please, provide all the required fields', 400)

        const userRef = doc(USER, userID)
        const user = await getDoc(userRef)

        if (!user.exists()) throw new AppError('User not found', 404)

        let branch = user.data().branch

        let lectures = await getLectures(userID, semester, branch, day)

        let preStatus = null
        lectures = lectures.map((lecture) => {
            if (
                lecture.to === to &&
                lecture.from === from &&
                lecture.courseCode === courseCode
            ) {
                preStatus = lecture.status
                return {
                    ...lecture,
                    status,
                }
            }
            return lecture
        })

        // if (preStatus === status)
        //     return {
        //         status: 200,
        //         message: 'Attendance marked successfully',
        //         data: lectures || [],
        //     }

        await updateDoc(userRef, {
            [`lectures.${semester}.${day}`]: lectures,
        })

        let courses = user.data().courses?.[semester] || []

        courses = courses?.map((course) => {
            if (course.courseCode === courseCode) {
                if (preStatus && course[preStatus] !== undefined)
                    course[preStatus]--
                // if (status === 'cancelled') course['total']--
                if (course[status] !== undefined) course[status]++
                return { ...course }
            }
            return course
        })

        await updateDoc(userRef, {
            [`courses.${semester}`]: courses,
        })

        lectures = lectures?.filter((lecture) => lecture.status !== 'cancelled')

        lectures?.sort((a, b) => a.from.localeCompare(b.from))

        return {
            status: 200,
            message: 'Attendance marked successfully',
            data: lectures || [],
        }
    }
)

const getAttendanceReport = catchAsync(async (userID, semester) => {
    if (!userID || !semester)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    let branch = user.data().branch

    const total = (await Notion.getCourses(semester, branch))
        ?.sort((a, b) => a.courseCode.localeCompare(b.courseCode))
        .reduce((acc, course) => {
            acc[course.courseCode] = course.total
            return acc
        }, {})

    const report = user
        .data()
        .courses[semester]?.map((course) => ({
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
            maximumAchievableAttendance: 100,
            // Number(
            //     (
            //         (total[course.courseCode] - course.absent) /
            //         total[course.courseCode]
            //     ).toFixed(2)
            // ) * 100,
            minimumLecturesToAttend: 10,
            //     Math.floor(
            //     total[course.courseCode] * 0.75 -
            //         (course.present + course.medical)
            // ),
        }))
        ?.sort((a, b) => a.courseCode.localeCompare(b.courseCode))

    return { status: 200, message: 'Attendance report', data: report || [] }
})

const resetSemester = catchAsync(async (userID, semester) => {
    if (!userID || !semester)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const user = await getDoc(userRef)

    if (!user.exists()) throw new AppError('User not found', 404)

    await updateDoc(userRef, {
        [`lectures.${semester}`]: {
            mon: [],
            tue: [],
            wed: [],
            thu: [],
            fri: [],
            sat: [],
            sun: [],
        },
        [`courses.${semester}`]: [],
    })

    return { status: 200, message: 'Semester reset successfully' }
})

export {
    register,
    modifySemester,
    getLectures,
    addExtraLecture,
    modifyAttendance,
    getAttendanceReport,
    getUser,
    resetSemester,
}
