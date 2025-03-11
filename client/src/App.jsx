import React from 'react'
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Timetable } from './pages'
import Navbar from './components/Navbar'

const Layout = ({ children }) => {
    const pathname = useLocation()

    return (
        <div className="w-screen h-screen flex flex-col gap-[1rem]">
            <div className="w-full h-full overflow-auto">{children}</div>
            {pathname.pathname !== '/' && <Navbar />}
        </div>
    )
}

const App = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/timetable" element={<Timetable />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
