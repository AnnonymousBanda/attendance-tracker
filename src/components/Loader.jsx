const Loader = () => {
    return (
        <div className="flex-col gap-4 w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-transparent text-green text-4xl animate-spin flex items-center justify-center border-t-green rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red text-2xl animate-spin flex items-center justify-center border-t-red rounded-full" />
            </div>
        </div>
    )
}

export default Loader
