'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'

export default function RegisterForm() {
    const searchParams = useSearchParams()

    const name = searchParams.get('displayName') || ''
    const email = searchParams.get('email') || ''

    const rollNumber = email.split('_')[1]?.split('@')[0] || ''
    const batch = '20' + (rollNumber.substring(0, 2) || '')
    const degreeCode = rollNumber.substring(2, 4)
    const degree = degreeCode === '01' ? 'Btech' : 'Dual Degree'

    const departmentFromEnv =
        process.env.NEXT_PUBLIC_DEPARTMENT?.split(',') || []

    const branchCode = rollNumber.substring(4, 6)
    const branch = branchCode // Placeholder

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
            department: '',
            branch,
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

    const onSubmit = (data) => {
        console.log('Form Data:', data)
    }

    const semesterOptions =
        degree === 'Dual Degree'
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            : [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <div className="min-h-screen px-20 flex items-center justify-center">
            <div className="h-full  p-4 max-container bg-primary rounded-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Register
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            {...register('name')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            {...register('email')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Roll Number
                        </label>
                        <input
                            {...register('rollNumber')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Degree
                        </label>
                        <input
                            {...register('degree')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <select
                            {...register('department', {
                                required: 'REQUIRED FIELD',
                            })}
                            className="w-full p-2 border border-gray-300 shadow-sm rounded text-base max-h-48 overflow-y-auto text-gray-700"
                        >
                            <option value="">SELECT DEPARTMENT</option>
                            {departmentFromEnv.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="text-red-500  text-sm ">
                                {errors.department.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch
                        </label>
                        <input
                            {...register('branch', {
                                required: 'REQUIRED FIELD',
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter your branch"
                        />
                        {errors.branch && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.branch.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Batch
                        </label>
                        <input
                            {...register('batch')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Semester
                        </label>
                        <select
                            {...register('semester')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            {semesterOptions.map((sem) => (
                                <option key={sem} value={sem}>
                                    {sem}
                                </option>
                            ))}
                        </select>
                        <label className="block text-sm font-medium text-gray-700 mt-2">
                            Year
                        </label>
                        <input
                            {...register('year')}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
