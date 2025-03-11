import React from 'react'

const SettingsDialog = ({user, isOpen, setIsOpen }) => {
    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <div
            className={`absolute z-10 inset-0 bg-black backdrop-blur-[7px] bg-opacity-30 flex items-center justify-center ${
                isOpen ? '' : 'hidden'
            }`}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#E5E7EB] p-6 rounded-lg shadow-lg h-auto md:max-w-5xl w-full flex flex-col gap-[2rem] overflow-y-auto max-h-screen max-w-[98vw]"
            >
                <div className="w-full flex justify-between items-center">
                    <p className="uppercase text-[2rem] text-gray-500 font-bold flex gap-[1rem]">
                        <img
                            src="/images/settings.svg"
                            alt="Settings gear icon"
                            width={30}
                            height={30}
                        />
                        <span>settings</span>
                    </p>
                    <button onClick={handleClose}>
                        <XMarkIcon
                            className="stroke-gray-500 fill-gray-500"
                            width={30}
                            height={30}
                        />
                    </button>
                </div>

                <div className="w-full flex md:flex-row flex-col gap-[5rem] justify-center items-center py-[3rem] rounded-lg">
                    <div className="cursor-pointer h-full flex justify-center items-center">
                        {user?.picture ? (
                            <DynamicLazyBlurImage
                                src={user?.picture}
                                alt="profile picture"
                                width={150}
                                height={150}
                                className="p-[3rem]"
                            />
                        ) : (
                            <LazyBlurImage
                                src="user.png"
                                alt="profile picture"
                                width={150}
                                height={150}
                                className="p-[0.2rem]"
                            />
                        )}
                    </div>
                    <div
                        className="md:w-1/2 w-3/4 flex flex-col gap-[1rem]"
                    >
                        <div className="flex flex-col gap-3 relative">
                            <label className="text-[2rem] font-medium text-gray-700">
                                Name
                            </label>
                            <div className="flex gap-2 w-full">
                                
                            </div>
                        </div>
                        <div className="w-full flex justify-center"></div>
                        <div className="flex flex-col gap-3">
                            <label className="block text-[2rem] font-medium text-gray-700">
                                Email
                            </label>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsDialog
