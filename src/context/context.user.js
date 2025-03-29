import { Loader } from '@/components'
import { getUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!navigator.onLine) {
                    toast.error('No internet connection', { className: 'toast-error' })
                    return
                }

                const res = await getUser('1')

                if (res.status !== 200) throw new Error(res.message)

                setUser({ ...res.data, userID: '1' })
            } catch (error) {
                toast.error(error.message, { className: 'toast-error' })
            } finally {
                setLoading(false)
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
