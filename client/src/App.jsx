import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Timetable } from './pages'
import Navbar from './components/Navbar'

const App = () => {
    return (
        <BrowserRouter>
            <div className="w-screen h-screen flex flex-col gap-[1rem]">
                <div className="w-full h-full overflow-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/timetable" element={<Timetable />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Navbar />
            </div>
        </BrowserRouter>
    )
}

export default App
