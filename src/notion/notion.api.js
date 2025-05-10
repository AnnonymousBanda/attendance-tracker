import { AppError, catchAsync } from '@/firebase/firebase.error'

const getCourses = catchAsync(async (semester, branch) => {
    const data = await getDatabaseLinks()
})

const getLectures = catchAsync(async (semester, day, branch) => {
    const data = await getDatabaseLinks()
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
