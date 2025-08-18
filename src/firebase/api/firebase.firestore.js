import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDoc,
    runTransaction,
} from 'firebase/firestore'

import { app } from '../firebase.config.js'
import { AppError, catchAsync } from '../firebase.error.js'
import Notion from '@/notion'

const db = getFirestore(app)

const USER = collection(db, 'users')

const registerUser = catchAsync(
    async (
        userID,
        name,
        roll,
        email,
        batch,
        year,
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
            !branch ||
            !semester ||
            !degree
        )
            throw new AppError('Please, provide all the required fields', 400)

        if (degree !== 'BTech' && degree !== 'Dual Degree')
            throw new AppError(
                'Please, select between BTech or Dual Degree',
                400
            )

        if (year < 1) throw new AppError('Invalid year', 400)
        if (degree === 'Dual Degree' && year > 5)
            throw new AppError('Invalid year', 400)
        if (degree === 'BTech' && year > 4)
            if (year < 1 || year > 5) throw new AppError('Invalid year', 400)

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

        //fetch all semester courses from notion
        let temp = (await Notion.getCourses(semester, branch)) || []

        temp = temp?.sort((a, b) => a.courseCode.localeCompare(b.courseCode))

        const courses = {}
        for (let i = 1; i <= n; i++) {
            courses[i] = []
            temp?.forEach((course) => {
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
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) throw new AppError('User already exists', 400)

        await setDoc(userRef, {
            name,
            email,
            roll,
            batch,
            year,
            branch,
            degree,
            semester,
            courses,
            lectures,
        })

        return {
            status: 200,
            message: 'User added successfully',
            data: {
                userID,
                name,
                email,
                roll,
                batch,
                year,
                branch,
                degree,
                semester,
                courses,
                lectures,
            },
        }
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

    const degree = user.data().degree
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

    // firebase lectures get fetched and then gsheet data is fetched which includes the cancelled lectures with status null.
    let lecturesFirebase =
        user
            .data()
            .lectures?.[semester]?.[day]?.sort((a, b) =>
                a.from.localeCompare(b.from)
            ) || []
    let lecturesNotion =
        (await Notion.getLectures(semester, day, branch))?.sort((a, b) =>
            a.from.localeCompare(b.from)
        ) || []

    let lectures = []
    let l1 = lecturesFirebase.length,
        l2 = lecturesNotion.length
    let i = 0,
        j = 0
    while (true) {
        if (l1 === 0 && l2 === 0) break

        if (i >= l1 && j >= l2) break

        if (i >= l1) lectures.push(lecturesNotion[j++])
        else if (j >= l2) lectures.push(lecturesFirebase[i++])
        else if (lecturesFirebase[i]?.from < lecturesNotion[j]?.from) {
            lectures.push(lecturesFirebase[i])
            i++
        } else if (lecturesFirebase[i]?.from > lecturesNotion[j]?.from) {
            lectures.push(lecturesNotion[j])
            j++
        } else {
            lectures.push(lecturesFirebase[i])
            i++
            j++
        }
    }

    lectures = lectures
        .filter((lecture) => lecture.status !== 'cancelled')
        .sort((a, b) => parseTime(a.from) - parseTime(b.from))

    return {
        status: 200,
        message: 'Lectures fetched successfully',
        data: lectures || [],
    }
})

const parseTime = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
}

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

    let lectures = (await getLectures(userID, semester, day)).data

    console.log(lectures)

    const toTimeDate = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        return date
    }

    if (
        lectures?.some(
            (lecture) =>
                toTimeDate(lecture.to) > toTimeDate(from) &&
                toTimeDate(lecture.from) < toTimeDate(to)
        )
    )
        throw new AppError('Lecture time conflict', 400)

    await updateDoc(userRef, {
        [`lectures.${semester}.${day}`]: arrayUnion(lecture),
    })

    lectures = lectures?.concat(lecture)
    lectures?.sort((a, b) => parseTime(a.from) - parseTime(b.from))

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
        let lectures = (await getLectures(userID, semester, day)).data

        let preStatus = null
        // lectures = lectures?.map((lecture) => {
        //     if (
        //         lecture.to === to &&
        //         lecture.from === from &&
        //         lecture.courseCode === courseCode
        //     ) {
        //         preStatus = lecture.status
        //         return { ...lecture, status }
        //     }
        //     return lecture
        // })

        lectures = lectures?.map((lecture) => {
            const match =
                lecture.to === to &&
                lecture.from === from &&
                lecture.courseCode === courseCode
            if (match) {
                preStatus = lecture.status
                return { ...lecture, status: status } // explicit
            }
            return lecture
        })

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) throw new AppError('User not found', 404)

            transaction.update(userRef, {
                [`lectures.${semester}.${day}`]: lectures,
            })

            let courses = userDoc.data().courses?.[semester] || []
            courses = courses.map((course) => {
                if (course.courseCode === courseCode) {
                    if (preStatus && course[preStatus] !== undefined)
                        course[preStatus]--
                    if (course[status] !== undefined) course[status]++
                    return { ...course }
                }
                return course
            })

            transaction.update(userRef, {
                [`courses.${semester}`]: courses,
            })
        })

        lectures = lectures
            .filter((lecture) => lecture.status !== 'cancelled')
            .sort((a, b) => parseTime(a.from) - parseTime(b.from))

        return {
            status: 200,
            message: 'Attendance marked successfully',
            data: lectures,
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
            present: course.present,
            medical: course.medical,
            absent: course.absent,
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
                    (
                        (total[course.courseCode] - course.absent) /
                        total[course.courseCode]
                    ).toFixed(2)
                ) * 100,
            minimumLecturesToAttend: Math.floor(
                total[course.courseCode] * 0.75 -
                    (course.present + course.medical)
            ),
        }))
        ?.sort((a, b) => a.courseCode.localeCompare(b.courseCode))

    return { status: 200, message: 'Attendance report', data: report || [] }
})

const resetSemester = catchAsync(async (userID, semester) => {
    if (!userID || !semester)
        throw new AppError('Please, provide all the required fields', 400)

    const userRef = doc(USER, userID)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) throw new AppError('User not found', 404)

    let courses = userSnap.data().courses?.[semester] || []
    courses = courses.map((course) => ({
        ...course,
        present: 0,
        absent: 0,
        medical: 0,
    }))

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
        [`courses.${semester}`]: courses,
    })

    return { status: 200, message: 'Semester reset successfully' }
})

const updateAttendance = catchAsync(
    async (userID, semester, courseCode, attendanceData) => {
        if (!userID || !semester || !courseCode || !attendanceData)
            throw new AppError('Please, provide all the required fields', 400)

        const userRef = doc(USER, userID)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) throw new AppError('User not found', 404)

        const courses = userSnap.data().courses?.[semester] || []
        const courseIndex = courses.findIndex(
            (course) => course.courseCode === courseCode
        )

        if (courseIndex === -1) throw new AppError('Course not found', 404)

        const updatedCourse = courses.map(
            (course) => {
                if(course.courseCode === courseCode) {
                    return {
                        ...course,
                        present: attendanceData.present || course.present,
                        absent: attendanceData.absent || course.absent,
                        medical: attendanceData.medical || course.medical,
                    }
                }
                return course
            }
        )

        await updateDoc(userRef, {
            [`courses.${semester}`]: updatedCourse,
        })

        return { status: 200, message: 'Attendance updated successfully' }
    }
)

export {
    registerUser,
    getUser,
    modifySemester,
    getLectures,
    addExtraLecture,
    modifyAttendance,
    getAttendanceReport,
    resetSemester,
    updateAttendance,
}
