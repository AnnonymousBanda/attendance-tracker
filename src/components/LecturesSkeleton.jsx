const LecturesCard = () => {
    return (
        <div className="flex flex-row gap-[1rem]">
            <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                <div className="w-[4.5rem] h-6 bg-gray-300 rounded-md animate-skeleton"></div>
                <div className="w-[4.5rem] h-5 bg-gray-200 rounded-md animate-skeleton"></div>
            </div>

            <div className="relative border-2 border-gray-200 border-l-black border-l-[0.3rem] bg-primary rounded-xl px-[2.5rem] py-[3rem] w-full flex flex-col gap-[2.5rem]">
                <div className="w-3/4 h-[2rem] bg-gray-300 rounded-md animate-skeleton"></div>
                <div className="w-1/3 h-[2rem] bg-gray-300 rounded-lg animate-skeleton"></div>
            </div>
        </div>
    )
}

function LecturesSkeleton() {
    return (
        <div className="flex flex-col gap-[1.5rem] py-[1rem]">
            <LecturesCard />
            <LecturesCard />
            <LecturesCard />
        </div>
    )
}

export default LecturesSkeleton
