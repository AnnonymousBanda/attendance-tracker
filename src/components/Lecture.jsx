import React from 'react'
import { MdClose } from 'react-icons/md'

const Lecture = ({ fro, to, sub_code, sub_name, status }) => {
    return (
        <div className=" border-l-5 relative bg-white rounded-xl px-[2.5rem] py-[3rem] shadow-md w-full ">
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
                <div className='flex gap-[1rem]'>
                    <button
                        className={`bg-green-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'present' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>present</p>
                    </button>
                    <button
                        className={`bg-red-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'attended' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>absent</p>
                    </button>
                    <button
                        className={`bg-yellow-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${status === 'sick' ? 'hover:cursor-default opacity-40' : ''}`}
                    >
                        <p>sick</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Lecture
