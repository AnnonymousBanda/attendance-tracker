// import { AppError, catchAsync } from '@/firebase/firebase.error'
// import { Client } from '@notionhq/client'

// const notion = new Client({
//     auth: process.env.NEXT_PUBLIC_NOTION_API_KEY,
// })

// const getDatabases = catchAsync(async (branchName, sem) => {
//     if (!branchName || !sem) {
//         throw new AppError('Please, provide all the required fields', 400)
//     }

//     const rootPageId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID
//     const database = {}

//     const page = await notion.blocks.children.list({ block_id: rootPageId })
//     const results = page.results

//     for (const block of results) {
//         const branch = block.child_page?.title?.replaceAll('"', '')
//         if (!branch) continue

//         const semesters = await notion.blocks.children.list({
//             block_id: block.id,
//         })
//         const semesterResults = semesters.results

//         for (let i = 0; i < semesterResults.length - 1; i++) {
//             const semesterBlock = semesterResults[i]
//             const semester = semesterBlock.child_page?.title?.split(' ')[1]
//             if (!semester) continue

//             const nestedDatabases = await notion.blocks.children.list({
//                 block_id: semesterBlock.id.replaceAll('-', ''),
//             })

//             const semesterDb = nestedDatabases.results

//             if (!semesterDb[0] || !semesterDb[1]) continue

//             const timetable = semesterDb[0].id?.replaceAll('-', '')
//             const courses = semesterDb[1].id?.replaceAll('-', '')

//             if (!database[branch]) database[branch] = {}

//             database[branch][semester] = {
//                 timetable,
//                 courses,
//             }
//         }
//     }

//     const data = database[branchName]?.[sem]
//     if (!data)
//         throw new AppError('Database not found for given branch and semester')

//     return data
// })

// const getCourses = catchAsync(async (semester, branch) => {
//     if (!branch || !semester) {
//         throw new AppError('Please, provide all the required fields', 400)
//     }

//     const { courses } = await getDatabases(branch, semester)
//     const courseList = []

//     const response = await notion.databases.query({
//         database_id: courses,
//     })

//     for (const course of response.results) {
//         const courseCode =
//             course.properties['Course Code']?.title?.[0]?.text?.content
//         const courseName =
//             course.properties['Course Name']?.rich_text?.[0]?.text?.content
//         const totalClasses = course.properties['Total classes']?.number

//         courseList.push({ courseCode, courseName, totalClasses })
//     }

//     return courseList
// })

// const getLectures = catchAsync(async (semester, day, branch) => {
//     if (!branch || !semester || !day) {
//         throw new AppError('Please, provide all the required fields', 400)
//     }

//     const databaseID = await getDatabases(branch, semester)

//     const lectures = []
//     const courses = {}

//     const coursesResponse = await notion.databases.query({
//         database_id: databaseID.courses,
//     })

//     for (const course of coursesResponse.results) {
//         const courseCode =
//             course.properties['Course Code']?.title?.[0]?.text?.content
//         const courseName =
//             course.properties['Course Name']?.rich_text?.[0]?.text?.content

//         if (courseCode) {
//             courses[courseCode] = { courseCode, courseName }
//         }
//     }

//     const lecturesResponse = await notion.databases.query({
//         database_id: databaseID.timetable,
//         filter: {
//             property: 'Day/Time',
//             title: {
//                 equals: day,
//             },
//         },
//     })

//     const lecturesData = lecturesResponse.results?.[0]?.properties

//     if (!lecturesData) return []

//     for (let i = 8; i < 20; i++) {
//         const courseCode =
//             lecturesData[`${i}:00-${i + 1}:00`]?.rich_text?.[0]?.text?.content
//         if (!courseCode) continue

//         lectures.push({
//             courseCode,
//             courseName: courses[courseCode]?.courseName || null,
//             from: `${i}:00`,
//             to: `${i + 1}:00`,
//             status: null,
//         })
//     }

//     return lectures
// })

const getCourses = async () => {}

const getLectures = async () => {}

export { getCourses, getLectures }
