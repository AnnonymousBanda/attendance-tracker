export default function SummaryBar({ summaryData }) {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-white p-[1rem] rounded-xl gap-[1rem]">
            <h2 className="w-full">Summary</h2>
            <div className="flex flex-col gap-[0.5rem] w-full px-[0.5rem]">
                {summaryData.map((data, index) => (
                    <div
                        key={index}
                        className="flex items-center w-full justify-center gap-[0.5rem]"
                    >
                        <h3
                            className={`${
                                summaryData.presentPercentage > 75
                                    ? 'bg-green'
                                    : 'bg-red'
                            } p-[0.3rem] w-[5rem] font-charts text-center text-white font-bold rounded-lg flex-none`}
                        >
                            {summaryData.presentPercentage}%
                        </h3>
                        <div className="flex-grow w-full h-[2.5rem] bg-gray-100 rounded-lg relative overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                                    summaryData.presentPercentage < 75
                                        ? 'bg-red-400'
                                        : 'bg-green-400'
                                }`}
                                style={{
                                    width: `${summaryData.presentPercentage}%`,
                                }}
                            />
                        </div>
                        <h3 className="lg:ml-[0.5rem] min-w-[6rem] text-right font-charts">
                            {data.courseCode}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
