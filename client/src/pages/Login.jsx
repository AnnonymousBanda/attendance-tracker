import React from 'react'
import { logo, msLogo } from '../assets'

const Login = () => {
    return (
        <div className="h-full w-full bg-primary flex justify-center items-center">
            <div className="w-fit h-fit p-[5rem] rounded-xl shadow-lg flex flex-col gap-[3rem] bg-[#ffffff] justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <img src={logo} alt="Logo" className="w-[8rem]" />
                    <p>Attendance Tracker Platform</p>
                </div>
                <button className="flex gap-3 cursor-pointer items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202]">
                    <img
                        src={msLogo}
                        alt="Microsoft logo"
                        className="w-[1.8rem]"
                    />
                    <p className="font-[600] tracking-wide text-[1.8rem]">
                        Login with Microsoft
                    </p>
                </button>
            </div>
        </div>
    )
}

export default Login