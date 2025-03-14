import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Login, Lectures } from './pages'
import { Navbar, PreventBrowserRefresh } from './components'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => (
    <div className="w-screen h-svh overflow-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-20 bg-white shadow-md">
            <Header />
        </div>

        {/* Scrollable Content */}
        <div 
            className="w-full overflow-y-auto pt-[56px] pb-[72px]" 
            style={{ height: 'calc(100svh)' }}
        >
            <Outlet />
        </div>
        <Navbar />
    </div>
)

const App = () => (
    <BrowserRouter>
        <PreventBrowserRefresh />
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/lectures" element={<Lectures />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
)

export default App
