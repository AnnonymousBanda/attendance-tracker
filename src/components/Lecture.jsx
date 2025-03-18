import React from 'react'

const Lecture = ({ fro, to, sub_code, sub_name }) => {
    return (
        <div className="max-container border-l-5 relative bg-[#F5F5F5] rounded-xl px-6 py-8 shadow-lg shadow-[#a0b8d9] font-[Plus Jakarta Sans] hover:shadow-[#a0b8d9]/20 transition-shadow">
            <div className="absolute left-[-55px] top-1/2 -translate-y-1/2 text-right space-y-1">
                <span className="block text-[1.1rem] font-semibold text-gray-900">
                    {fro}
                </span>
                <span className="block text-[0.9rem] text-gray-600">{to}</span>
            </div>
            <div className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors text-xl font-semibold">
                ✕
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-4">
                {sub_code}:{sub_name}
            </h1>
            <div className="flex gap-4 flex-wrap">
                <button className="bg-green-100 text-green-700 font-medium py-2 px-6 rounded-lg hover:bg-green-200 transition-colors duration-200">
                    Present
                </button>
                <button className="bg-red-100 text-red-700 font-medium py-2 px-6 rounded-lg hover:bg-red-200 transition-colors duration-200">
                    Absent
                </button>
                <button className="bg-yellow-200 text-yellow-700 font-medium py-2 px-6 rounded-lg hover:bg-yellow-100 hover:text-yellow-500 transition-colors duration-200">
                    sick
                </button>
            </div>
        </div>
    )
}

export default Lecture
