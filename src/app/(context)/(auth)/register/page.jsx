'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { registerUser } from '@/firebase/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context'
import { BRANCHES } from '@/utils/branches'

export default function RegisterForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(false)

    const name = searchParams.get('displayName') || ''
    const email = searchParams.get('email') || ''

    const roll = email.split('_')[1]?.split('@')[0] || ''
    const batch = '20' + (roll.substring(0, 2) || '')
    const degreeCode = roll.substring(2, 4)
    const degree = degreeCode === '01' ? 'BTech' : 'Dual Degree'

    const BRANCHESFromEnv = BRANCHES.split('_') || [] //process.env.NEXT_PUBLIC_BRANCHES?.split('_') || []

    const UUID = searchParams.get('uuid') || ''

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name,
            email,
            roll,
            degree,
            branch: '',
            batch,
            semester: 1,
            year: '1st',
        },
    })

    const semester = watch('semester')

    useEffect(() => {
        const newYear = Math.floor((semester - 1) / 2) + 1

        let suffix = 'th'
        if (newYear === 1) suffix = 'st'
        else if (newYear === 2) suffix = 'nd'
        else if (newYear === 3) suffix = 'rd'

        setValue('year', `${newYear}${suffix}`)
    }, [semester, setValue])

    useEffect(() => {
        if (errors.branch) {
            toast.error(errors.branch.message, {
                className: 'toast-error',
            })
        } else if (errors.name) {
            toast.error(errors.name.message, {
                className: 'toast-error',
            })
        } else if (errors.email) {
            toast.error(errors.email.message, {
                className: 'toast-error',
            })
        } else if (errors.roll) {
            toast.error(errors.roll.message, {
                className: 'toast-error',
            })
        } else if (errors.degree) {
            toast.error(errors.degree.message, {
                className: 'toast-error',
            })
        } else if (errors.batch) {
            toast.error(errors.batch.message, {
                className: 'toast-error',
            })
        } else if (errors.semester) {
            toast.error(errors.semester.message, {
                className: 'toast-error',
            })
        } else if (errors.year) {
            toast.error(errors.year.message, {
                className: 'toast-error',
            })
        } else {
            toast.dismiss()
        }
    }, [
        errors.branch,
        errors.name,
        errors.email,
        errors.roll,
        errors.degree,
        errors.batch,
        errors.semester,
        errors.year,
    ])

    const onSubmit = async (data) => {
        setLoading(true)

        const toastID = toast.loading('Registering...')
        data = {
            userID: UUID,
            ...data,
        }

        try {
            const res = await registerUser(
                data.userID,
                data.name,
                data.roll,
                data.email,
                data.batch,
                data.year,
                data.branch,
                data.semester,
                data.degree
            )

            if (res.status !== 200) throw new Error(res.message)

            toast.dismiss(toastID)
            toast.success('Registration successful', {
                className: 'toast-success',
            })

            setUser(res.data)
            router.replace('/')
        } catch (error) {
            toast.dismiss(toastID)
            toast.error(error.message, { className: 'toast-error' })
        } finally {
            setLoading(false)
        }
    }

    const semesterOptions =
        degree === 'Dual Degree'
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            : [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="h-fit  p-[1rem] max-container bg-primary rounded-2xl my-[2rem] border-[0.5px] border-gray-200">
                <h1 className=" text-center text-gray-800 my-[2rem]">
                    Register
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 px-[2rem]"
                >
                    <div>
                        <h2 className="block text-gray-800">Name</h2>
                        <input
                            {...register('name', {
                                required: 'Name is required',
                            })}
                            readOnly
                            className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] border border-gray-300 text-2xl rounded-md shadow-sm opacity-50 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-row gap-[2.5rem]">
                        <div className="flex-1">
                            <h2 className="block text-gray-800">Email</h2>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                                readOnly
                                className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] border border-gray-300 text-2xl rounded-md shadow-sm opacity-50 cursor-not-allowed"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="block text-gray-800">Roll Number</h2>
                            <input
                                {...register('roll', {
                                    required: 'Roll number is required',
                                })}
                                readOnly
                                className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="block text-gray-800">Degree</h2>
                        <input
                            {...register('degree', {
                                required: 'Degree is required',
                            })}
                            readOnly
                            className="bg-[#fcfcfc] mt-1 block w-full border border-gray-300 px-[1.5rem] py-[1rem] text-2xl rounded-md shadow-sm opacity-50 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <h2 className="block text-gray-800">Branch</h2>
                        <select
                            {...register('branch', {
                                required: 'Please select a branch',
                            })}
                            className="bg-[#fcfcfc] w-full p-2 border border-gray-300 shadow-sm rounded px-[1.5rem] py-[1rem] text-2xl max-h-48 overflow-y-auto"
                        >
                            <option value="">SELECT BRANCH</option>
                            {BRANCHESFromEnv.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h2 className="block text-gray-800">Batch</h2>
                        <input
                            {...register('batch', {
                                required: 'Batch is required',
                            })}
                            readOnly
                            className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm opacity-50 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-row gap-[2.5rem] w-full">
                        <div className="flex-1">
                            <h2 className="block text-gray-800">Semester</h2>
                            <select
                                {...register('semester', {
                                    required: 'Please select a semester',
                                })}
                                className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm"
                            >
                                {semesterOptions.map((sem) => (
                                    <option key={sem} value={sem}>
                                        {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <h2 className="block text-gray-800 mt-2">Year</h2>
                            <input
                                {...register('year', {
                                    required: 'Year is required',
                                })}
                                readOnly
                                className="bg-[#fcfcfc] mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-full mt-[2.5rem]">
                        <button
                            type="submit"
                            className={`px-[2.5rem] py-[0.5rem] bg-green-600 text-white rounded-md cursor-pointer ${
                                loading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-green-700'
                            }`}
                        >
                            <h2>Submit</h2>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
