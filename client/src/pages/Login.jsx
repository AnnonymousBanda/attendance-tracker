import React from 'react'
import { logo, msLogo } from '../assets'

const Login = () => {
    return (
        <div className="h-screen w-full bg-primary flex justify-center items-center bg-[#ffffff]">
            <div className="w-fit h-fit p-[5rem] rounded-xl shadow-lg flex flex-col gap-[3rem] max-container justify-center items-center">
                <div className="flex flex-col items-center gap-[1rem]">
                    <img src={logo} alt="Logo" className="w-[8rem]" />
                    <h1>Attendance&nbsp;Tracker</h1>
                </div>
                <button className="flex gap-[0.5rem] cursor-pointer items-center justify-center bg-[#2f2f2f] text-white h-[4.5rem] px-[1.5rem] rounded-sm hover:bg-[#0e0202]">
                    <img
                        src={msLogo}
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
