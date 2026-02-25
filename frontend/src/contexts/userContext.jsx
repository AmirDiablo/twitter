import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [followings, setFollowings] = useState([])
    const [loading, setLoading] = useState(true)

    // استخراج توکن از localStorage (ساختار: {token, userInfo})
    const getToken = useCallback(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                const parsedData = JSON.parse(storedUser)
                // بررسی ساختار آبجکتی با token
                if (parsedData?.token) {
                    return parsedData.token
                }
            } catch {
                return null
            }
        }
        return null
    }, [])

    // تابع لاگین - دریافت اطلاعات از سرور و ذخیره در localStorage
    const login = (serverResponse, authToken) => {
        // serverResponse: [{userInfo}] - آرایه‌ای از اطلاعات کاربر
        if (Array.isArray(serverResponse) && serverResponse[0]) {
            const userInfo = serverResponse[0]
            setUser(userInfo)
            setFollowings(userInfo.followings || [])
            
            // ذخیره در localStorage با ساختار {token, userInfo}
            const storageData = {
                token: authToken,
                userInfo: userInfo
            }
            localStorage.setItem("user", JSON.stringify(storageData))
        }
    }

    // تابع خروج
    const logout = () => {
        setUser(null)
        setFollowings([])
        localStorage.removeItem("user")
    }

    // به‌روزرسانی دنبال‌شوندگان
    const updateFollowings = (userId) => {
        setFollowings(prevFollowings => {
            const exists = prevFollowings.includes(userId)
            let newFollowings
            
            if (exists) {
                newFollowings = prevFollowings.filter(item => item !== userId)
            } else {
                newFollowings = [...prevFollowings, userId]
            }
            
            // به‌روزرسانی localStorage
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                const storageData = JSON.parse(storedUser)
                storageData.userInfo.followings = newFollowings
                localStorage.setItem("user", JSON.stringify(storageData))
            }
            
            return newFollowings
        })
    }

    // دریافت اطلاعات اولیه
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem('user')
                
                if (!storedUser) {
                    setLoading(false)
                    return
                }

                // پارس کردن داده localStorage با ساختار {token, userInfo}
                const parsedData = JSON.parse(storedUser)
                
                if (!parsedData?.userInfo?._id) {
                    setLoading(false)
                    return
                }

                const userId = parsedData.userInfo._id

                // دریافت اطلاعات به‌روز از سرور
                const response = await fetch(`http://localhost:3000/api/account/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${parsedData.token}` // ارسال توکن برای احراز هویت
                    }
                })
                
                const json = await response.json()

                if (response.ok) {
                    // json به صورت آرایه‌ای از userInfo است: [{...}]
                    if (Array.isArray(json) && json[0]) {
                        const updatedUserInfo = json[0]
                        setUser(updatedUserInfo)
                        setFollowings(updatedUserInfo.followings || [])
                        
                        // به‌روزرسانی localStorage با حفظ token قبلی
                        const updatedStorage = {
                            token: parsedData.token, // حفظ token قبلی
                            userInfo: updatedUserInfo
                        }
                        localStorage.setItem("user", JSON.stringify(updatedStorage))
                    }
                } else {
                    // اگر توکن منقضی شده باشد
                    localStorage.removeItem('user')
                    setUser(null)
                    setFollowings([])
                }
            } catch (error) {
                console.error("خطا در دریافت اطلاعات کاربر:", error)
                localStorage.removeItem('user')
                setUser(null)
                setFollowings([])
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    // مقدار context
    const value = useMemo(() => ({
        user,
        setUser,
        followings,
        token: getToken(),
        login,
        logout,
        updateFollowings,
        loading,
        isAuthenticated: !!user
    }), [user, followings, loading, getToken])

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

// hook سفارشی
export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser باید درون UserProvider استفاده شود")
    }
    return context
}