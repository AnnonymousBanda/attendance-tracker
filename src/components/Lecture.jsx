import React from 'react'
import { MdClose } from 'react-icons/md'

const Lecture = ({ fro, to, sub_code, sub_name }) => {
    return (
        <div className=" border-l-5 relative bg-white rounded-xl px-[2.5rem] py-[3rem] shadow-lg shadow-[#b1c1d5] w-full  transition-shadow">
            <div className="absolute left-[-55px] top-1/2 -translate-y-1/2 text-right space-y-1">
                <p className=" font-bold text-gray-900">{fro}</p>
                <p className="block text-gray-600">{to}</p>
            </div>
            <div className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors text-xl font-semibold ">
                <MdClose size={24} />
            </div>
            <div className="flex flex-col gap-[2.5rem]">
                <h2>
                    {sub_code}: {sub_name}
                </h2>
                <div className="flex gap-[1.5rem] flex-wrap">
                    <button className="bg-green-100 text-green-700 font-medium py-[0.75rem] px-[2.5rem] rounded-lg hover:bg-green-200 transition-colors duration-200 cursor-pointer">
                        <p>Present</p>
                    </button>
                    <button className="bg-red-100 text-red-700 font-medium py-[0.75rem] px-[2.5rem] rounded-lg hover:bg-red-200 transition-colors duration-200 cursor-pointer">
                        <p>Absent</p>
                    </button>
                    <button className="bg-yellow-200 text-yellow-700 font-medium py-[0.75rem] px-[2.5rem] rounded-lg hover:bg-yellow-300 hover:text-yellow-700 transition-colors duration-200 cursor-pointer">
                        <p>Sick</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Lecture
