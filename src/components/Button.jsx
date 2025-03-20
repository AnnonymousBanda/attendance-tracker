function Button({cls}) {
    return (
        <div className="flex gap-[1rem]">
            <button
                className={`bg-green-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    cls.status === 'present'
                        ? 'hover:cursor-default opacity-40'
                        : ''
                }`}
            >
                <p>present</p>
            </button>
            <button
                className={`bg-red-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    cls.status === 'absent'
                        ? 'hover:cursor-default opacity-40'
                        : ''
                }`}
            >
                <p>absent</p>
            </button>
            <button
                className={`bg-yellow-400 text-black font-medium p-[0.5rem] rounded-lg transition-colors duration-400 cursor-pointer ${
                    cls.status === 'sick'
                        ? 'hover:cursor-default opacity-40'
                        : ''
                }`}
            >
                <p>medical</p>
            </button>
        </div>
    )
}

export default Button