import { Loader } from '@/components'
import { getUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser('1')

                if (res.status !== 200) throw new Error(res.message)

                setUser({ ...res.data, userID: '1' })
                setLoading(false)
            } catch (error) {
                toast.error(error.message, { className: 'toast-error' })
            }
        }

        fetchUser()
    }, [])

    const logout = () => setUser(null)

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {loading ? <Loader /> : children}
        </UserContext.Provider>
    )
}

const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within a UserProvider')
    return context
}

export { UserProvider, useUser }
