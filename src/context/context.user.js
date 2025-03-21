import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = {
                name: 'Ankit Bhagat',
                userID: '1',
                email: 'ankit_2301ce03@iitp.ac.in',
                roll: '2301CE03',
                semester: '4',
                branch: 'Computer Science',
            }
            setUser(userData)
        }

        fetchUser()
    }, [])

    const logout = () => setUser(null)

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within a UserProvider')
    return context
}

export { UserProvider, useUser }
