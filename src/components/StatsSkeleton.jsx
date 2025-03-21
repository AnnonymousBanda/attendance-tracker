function StatsSkeleton() {
    return (
        <div className="flex flex-col items-center p-[1rem] gap-[2rem] bg-primary rounded-lg">
            <div className="w-[20rem] h-[2rem] bg-gray-300 rounded-md animate-skeleton"></div>

            <div className="flex flex-col items-center w-full gap-[1.5rem] border-2 border-gray-200 rounded-lg p-[1.5rem]">
                <div className="w-[12rem] h-[2rem] bg-gray-300 rounded-md animate-skeleton"></div>
                <div className="w-full h-[25rem] bg-gray-300 rounded-lg animate-skeleton"></div>
            </div>

            <div className="flex flex-col items-center w-full gap-[1.5rem] border-2 border-gray-200 rounded-lg px-[2rem] py-[1.5rem]">
                <div className="w-[12rem] h-[2rem] bg-gray-300 rounded-md animate-skeleton"></div>
                <div className="w-full h-[25rem] bg-gray-300 rounded-lg animate-skeleton"></div>
            </div>

            <div className="flex flex-col items-center w-full gap-[1.5rem] border-2 border-gray-200 rounded-lg px-[2rem] py-[1.5rem]">
                <div className="w-[12rem] h-[2rem] bg-gray-300 rounded-md animate-skeleton"></div>
                <div className="w-full h-[25rem] bg-gray-300 rounded-lg animate-skeleton"></div>
            </div>
        </div>
    )
}

export default StatsSkeleton
