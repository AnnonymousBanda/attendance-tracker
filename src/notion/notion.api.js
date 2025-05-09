import { AppError, catchAsync } from '@/firebase/firebase.error'

const getCourses = catchAsync(async (semester, branch) => {
    const url = process.env.NEXT_PUBLIC_GSHEET_URL

    const response = await fetch(
        `${url}?action=getcourses&semester=${semester}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                branch: branch,
            }),
        }
    )

    if (!response.ok) {
        throw new AppError('Failed to fetch courses', 404)
    }

    const data = await response.json()
    return data
})

const getLectures = catchAsync(async (semester, day, branch) => {
    const url = process.env.NEXT_PUBLIC_GSHEET_URL

    const response = await fetch(
        `${url}?action=getlectures&semester=${semester}&day=${day}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                branch: branch,
            }),
        }
    )

    if (!response.ok) {
        throw new AppError('Failed to fetch lectures', 404)
    }

    const data = await response.json()
    return data
})

export { getCourses, getLectures }
