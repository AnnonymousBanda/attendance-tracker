import { FaRegClock } from 'react-icons/fa6'

const SkeletonBox = ({ width, height }) => (
    <div
        className="bg-gray-300 animate-skeleton rounded-lg"
        style={{ width, height }}
    />
)

const HomeSkeleton = () => {
    return (
        <div className="bg-primary p-[1rem] rounded-lg flex flex-col gap-[1rem]">
            <div className="animat-fade-in">
                <SkeletonBox width="20rem" height="4rem" />
            </div>

            <div className="space-y-3">
                <SkeletonBox width="10rem" height="2.5rem" />
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>{' '}
            </div>

            <div className="flex justify-between items-center">
                <SkeletonBox width="15rem" height="2.5rem" />
            </div>

            <div className="space-y-6">
                <SkeletonBox width="10rem" height="2.5rem" />
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>

                <SkeletonBox width="10rem" height="2.5rem" />
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>
                <div className="bg-white px-[1rem] py-[3rem] rounded-xl shadow-sm flex justify-between items-center border border-gray-100 relative">
                    <div className="flex flex-col gap-[0.5rem]">
                        <SkeletonBox width="8rem" height="3rem" />
                        <SkeletonBox width="15rem" height="1.5rem" />
                    </div>
                    <SkeletonBox width="12rem" height="2.5rem" />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full bg-white p-[1rem] rounded-xl gap-[1rem]">
                <div className='w-full'>
                    <SkeletonBox width="10rem" height="2.5rem" />
                </div>
                <SkeletonBox width="100%" height="25rem" />
            </div>
        </div>
    )
}

export default HomeSkeleton
