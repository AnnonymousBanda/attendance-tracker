import React from 'react'

const Card = ({ fro, to, sub_name }) => {
    return (
        <div className=" border-l-10 border-black relative bg-[#F5F5F5] shadow-lg rounded-xl px-4 py-8 w-72 border  font-[Plus Jakarta Sans]">
            <div className="absolute left-[-55px]  top-1/2 -translate-y-21 text-right">
                <span className="block text-sm text-black font-semibold">
                    {fro}
                </span>
                <span className="block text-xs text-gray-400">{to}</span>
            </div>
            <div className="absolute right-2 top-2 cursor-pointer text-gray-700 hover:text-black text-xl font-semibold">
                ✕
            </div>
            <h1 className="text-lg font-semibold text-black  mb-3">
                {sub_name}
            </h1>
            <div className="flex gap-6">
                <button className="bg-green-100 text-green-700 font-medium py-1 px-4 rounded-lg hover:bg-green-200 transition">
                    Present
                </button>
                <button className="bg-red-100 text-red-700 font-medium py-1 px-5 rounded-lg hover:bg-red-200 transition">
                    Absent
                </button>
            </div>
        </div>
    )
}

export default Card
