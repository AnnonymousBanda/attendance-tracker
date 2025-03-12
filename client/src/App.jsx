import React from 'react'
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Timetable, Login } from './pages'
import { Navbar } from './components'

const Layout = ({ children }) => {
    const pathname = useLocation()

    return (
        <div className="w-screen h-svh flex flex-col gap-[1rem]">
            <div className="w-full h-full">{children}</div>
            {pathname.pathname !== '/login' && <Navbar />}
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
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
