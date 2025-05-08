'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { register } from '@/firebase/api'
import { toast } from 'react-hot-toast';

export default function RegisterForm() {
    const searchParams = useSearchParams()

    const name = searchParams.get('displayName') || ''
    const email = searchParams.get('email') || ''

    const rollNumber = email.split('_')[1]?.split('@')[0] || ''
    const batch = '20' + (rollNumber.substring(0, 2) || '')
    const degreeCode = rollNumber.substring(2, 4)
    const degree = degreeCode === '01' ? 'Btech' : 'Dual Degree'

    const BRANCHESFromEnv = process.env.NEXT_PUBLIC_BRANCHES?.split('_') || []

    const branchCode = rollNumber.substring(4, 6)
    const department = branchCode
    const UUID = searchParams.get('UUID') || ''

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
            rollNumber,
            degree,
            department,
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

    const onSubmit = async (data) => {
        data = {
            userID: UUID,
            name: data.name,
            email: data.email,
            batch: data.batch,
            roll: data.roll,
            year: data.year,
            department: data.department,
            branch: data.branch,
            semester: data.semester,
            degree: data.degree,
        }

        try {
            const res = await register(
                data.userID,
                data.name,
                data.roll,
                data.email,
                data.batch,
                data.year,
                data.department,
                data.branch,
                data.semester,
                data.degree
            )

            if (res.status !== 200) throw new Error(res.message)
            setValue('UUID', res.data.UUID)
            console.log(res.data)
            reset()
            
            toast.success(' regidter successfully', {
                className: 'toast-success',
            })
        } catch (error) {
            toast.error(error.message, { className: 'toast-error' })
        }
    }

    const semesterOptions =
        degree === 'Dual Degree'
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            : [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <div className="min-h-screen px-20 flex items-center justify-center">
            <div className="h-full  p-[1rem] max-container bg-primary rounded-lg">
                <h1 className=" text-center text-gray-800 p-[2rem]">
                    Register
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <h2 className="block   text-gray-700">Name</h2>
                        <input
                            {...register('name')}
                            readOnly
                            className="mt-1 block w-full px-[1.5rem] py-[1rem] border border-gray-300 text-2xl rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <h2 className="block  text-gray-700">Email</h2>
                        <input
                            {...register('email')}
                            readOnly
                            className="mt-1 block w-full px-[1.5rem] py-[1rem] border border-gray-300 text-2xl rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <h2 className="block text-gray-700">Roll Number</h2>
                        <input
                            {...register('rollNumber')}
                            readOnly
                            className="mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <h2 className="block  text-gray-700">Degree</h2>
                        <input
                            {...register('degree')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 px-[1.5rem] py-[1rem] text-2xl rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <h2 className="block  text-gray-700">Branch</h2>
                        <select
                            {...register('branch', {
                                required: 'REQUIRED FIELD',
                            })}
                            className="w-full p-2 border border-gray-300 shadow-sm rounded px-[1.5rem] py-[1rem] text-2xl  max-h-48 overflow-y-auto text-gray-700"
                        >
                            <option value="">SELECT BRANCH</option>
                            {BRANCHESFromEnv.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                        {errors.branch && (
                            <p className="text-red-500  text-sm ">
                                {errors.branch.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <h2 className="block  text-gray-700">Department</h2>
                        <input
                            {...register('department', {
                                required: 'REQUIRED FIELD',
                            })}
                            className="mt-1 block w-full  border border-gray-300 rounded-md px-[1.5rem] py-[1rem] text-2xl shadow-sm"
                            placeholder="Enter your department"
                        />
                        {errors.department && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.department.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <h2 className="block  text-gray-700">Batch</h2>
                        <input
                            {...register('batch')}
                            readOnly
                            className="mt-1 block w-full  px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <h2 className="block text-gray-700">Semester</h2>
                        <select
                            {...register('semester')}
                            className="mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm"
                        >
                            {semesterOptions.map((sem) => (
                                <option key={sem} value={sem}>
                                    {sem}
                                </option>
                            ))}
                        </select>
                        <h2 className="block  text-gray-700 mt-2">Year</h2>
                        <input
                            {...register('year')}
                            readOnly
                            className="mt-1 block w-full px-[1.5rem] py-[1rem] text-2xl border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <button
                            type="submit"
                            className="w-50  px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                        >
                            <h2>Submit</h2>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
