import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Timetable, Login } from './pages'
import { Navbar } from './components'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => (
    <div className="w-screen h-svh flex flex-col gap-[1rem]">
        <Header />
        <div className="w-full h-full">
            <Outlet />
        </div>
        <Navbar />
    </div>
)

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/timetable" element={<Timetable />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
)

export default App
