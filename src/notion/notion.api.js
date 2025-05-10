import { AppError, catchAsync } from '@/firebase/firebase.error'

const getCourses = catchAsync(async (semester, branch) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_GSHEET_URL)
        const link = await res.json()

        if (!res.ok) {
            throw new AppError('Failed to fetch courses', 404)
        }

        const courses = await fetch(
            `${link[branch]}?action=getcourses&semester=${semester}`
        )
        const data = await courses.json()

        if (!courses.ok) {
            throw new AppError('Failed to fetch courses', 404)
        }

        return data
    } catch (error) {
        console.log('Error fetching courses:', error)
        throw new AppError(error.message, 500)
    }
})

const getLectures = catchAsync(async (semester, day, branch) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_GSHEET_URL)
        const link = await res.json()

        if (!res.ok) {
            throw new AppError('Failed to fetch courses', 404)
        }

        const lectures = await fetch(
            `${link[branch]}?action=getlectures&semester=${semester}&day=${day}`
        )
        const data = await lectures.json()

        if (!lectures.ok) {
            throw new AppError('Failed to fetch lectures', 404)
        }

        return data
    } catch (error) {
        console.log('Error fetching lectures:', error)
        throw new AppError(error.message, 500)
    }
})

const getDatabaseLinks = catchAsync(async () => {
    const url = process.env.NEXT_PUBLIC_GSHEET_URL

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new AppError('Failed to fetch database links', 404)
    }

    const data = await response.json()
    console.log(data)
    return data
})

export { getCourses, getLectures }
