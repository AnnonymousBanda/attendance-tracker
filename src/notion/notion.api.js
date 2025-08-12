import { AppError, catchAsync } from '@/firebase/firebase.error'

const cellrange = {
    1: 'A, B, C, D, E, F, G, H, I, J, K, L, M',
    2: 'O, P, Q, R, S, T, U, V, W, X, Y, Z, AA',
    3: 'AC, AD, AE, AF, AG, AH, AI, AJ, AK, AL, AM, AN, AO',
    4: 'AQ, AR, AS, AT, AU, AV, AW, AX, AY, AZ, BA, BB, BC',
    5: 'BE, BF, BG, BH, BI, BJ, BK, BL, BM, BN, BO, BP, BQ',
    6: 'BS, BT, BU, BV, BW, BX, BY, BZ, CA, CB, CC, CD, CE',
    7: 'CG, CH, CI, CJ, CK, CL, CM, CN, CO, CP, CQ, CR, CS',
    8: 'CU, CV, CW, CX, CY, CZ, DA, DB, DC, DD, DE, DF, DG',
}

const getCourses = catchAsync(async (semester, branch) => {
    try {
        const id = process.env.NEXT_PUBLIC_GSHEET_ID
        const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${branch}`

        const response = await fetch(url)

        if (response.status !== 200) {
            throw new AppError('Failed to fetch courses', 404)
        }

        const raw = await response.text()
        const json = JSON.parse(raw.substr(47).slice(0, -2))

        const allcourses = parseCourses(json)
        const semcourses = allcourses[semester]

        return semcourses
    } catch (error) {
        console.log('Error fetching courses:', error)
        throw new AppError(error.message, 500)
    }
})

const getLectures = catchAsync(async (semester, day, branch) => {
    try {
        const id = process.env.NEXT_PUBLIC_GSHEET_ID
        const semCellRange = cellrange[semester]

        const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&tq=SELECT ${semCellRange}&sheet=${branch}`
        const response = await fetch(url)

        if (response.status !== 200) {
            throw new AppError('Failed to fetch lectures', 404)
        }

        const raw = await response.text()
        const json = JSON.parse(raw.substr(47).slice(0, -2))

        const timetable = extractTimetable(json)
        const lectures = timetable[day]

        return lectures
    } catch (error) {
        console.log('Error fetching lectures:', error)
        throw new AppError(error.message, 500)
    }
})

const parseCourses = (json) => {
    const totalSemesters = 4
    const columnsPerSemester = 14
    const semesterData = {}

    const rows = json.table.rows

    for (let sem = 0; sem < totalSemesters; sem++) {
        const semName = `${sem + 1}`
        semesterData[semName] = []

        const baseIndex = sem * columnsPerSemester

        rows.forEach((row, rowIndex) => {
            const cells = row?.c || []

            const nameCell = cells[baseIndex]
            const codeCell = cells[baseIndex + 1]
            const totalClassesCell = cells[baseIndex + 2]

            const courseName = nameCell?.v || null
            const courseCode = codeCell?.v || null
            const total = totalClassesCell?.v || null

            if (courseName && courseCode) {
                semesterData[semName].push({
                    courseName,
                    courseCode,
                    total,
                })
            }
        })
    }

    return semesterData
}

function extractTimetable(json) {
    const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

    const cols = json.table.cols.slice(1, 13)
    const rows = json.table.rows

    const lectures = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
    }

    cols.forEach((col, colIndex) => {
        const label = col.label
        const [from, to] = label.split(' ')[0].split('-')

        const slotCourseCodes = label.split(' ').slice(1, 8)

        weekdays.forEach((day, dayIndex) => {
            const code = slotCourseCodes[dayIndex]
            if (!code) return

            const row = rows.find((r) => r.c[1] && r.c[1].v === code)
            if (!row) return

            const courseName = row.c[0]?.v

            lectures[day].push({
                courseCode: code,
                courseName: courseName,
                from,
                to,
                status: null,
            })
        })
    })

    return lectures
}

// const getDatabaseLinks = catchAsync(async () => {
//     const url = process.env.NEXT_PUBLIC_GSHEET_URL

//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })

//     if (!response.ok) {
//         throw new AppError('Failed to fetch database links', 404)
//     }

//     const data = await response.json()
//     console.log(data)
//     return data
// })

export { getCourses, getLectures }
