import { Header, Navbar } from '@/components'

const layout = ({ children }) => {
    return (
        <main className="flex flex-col h-screen gap-[1rem]">
            <Header />
            <div className="max-container h-full overflow-auto">{children}</div>
            <Navbar />
        </main>
    )
}

export default layout
