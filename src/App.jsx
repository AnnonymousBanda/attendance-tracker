import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Home, NotFound, Schedule, Stats, Login, Lectures } from './pages'
import { Navbar, PreventBrowserRefresh } from './components'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => (
    <div className="w-screen h-svh flex flex-col">
        <Header />
        <div className="w-full h-full py-[1rem] max-container overflow-auto">
            <Outlet />
        </div>
        <Navbar />
    </div>
)

const App = () => {
    return (
        <BrowserRouter>
            {/* <PreventBrowserRefresh /> */}
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
}

export default App
