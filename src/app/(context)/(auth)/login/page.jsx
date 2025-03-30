'use client'

import Image from 'next/image'
import { logo, ms_logo } from '@/assets'
import { useAuth } from '@/context'
import { useState } from 'react'

const Login = () => {
    const { signInWithMicrosoft } = useAuth()
    const [buttonClicked, setButtonClicked] = useState(false)

    return (
        <div className="h-screen w-full bg-primary flex justify-center items-center">
            <div className="w-fit h-fit p-[5rem] rounded-xl shadow-lg flex flex-col gap-[3rem] max-container justify-center items-center">
                <div className="flex flex-col items-center gap-[1rem]">
                    <Image src={logo} alt="Logo" className="w-[8rem]" />
                    <h1>Attendance&nbsp;Tracker</h1>
                </div>
                <button
                    className={`flex gap-[0.5rem] cursor-pointer items-center justify-center text-white h-[4.5rem] px-[1.5rem] rounded-lg bg-[#2f2f2f]  ${buttonClicked ? 'opacity-50 ' : 'hover:bg-[#0e0202]'}`}
                    onClick={async () => {
                        setButtonClicked(true)
                        await signInWithMicrosoft()
                        setButtonClicked(false)
                    }}
                >
                    <Image
                        src={ms_logo}
                        alt="Microsoft logo"
                        className="w-[1.8rem]"
                    />
                    <p>Login&nbsp;with&nbsp;Microsoft</p>
                </button>
            </div>
        </div>
    )
}

export default Login
