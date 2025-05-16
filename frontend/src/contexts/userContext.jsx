import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children })=> {
    const [user, setUser] = useState()
    const [followings, setFollowings] = useState([])

    const login = (value)=> {
        setUser(value)
    }

    const updateFollowings = (userId)=> {
        const Exist = followings.includes(userId)

        if(Exist) {
            setFollowings( followings.filter( item=> item !== userId ) )
        }else{
            setFollowings([...followings, userId])
        }
    }


    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'))

        const fetchUser = async (id)=> {
            const response = await fetch("http://localhost:3000/api/account/profile/"+id)
            const json = await response.json()

            if(response.ok) {
                setUser({token: user.token, userInfo: json})
                setFollowings(json[0].followings)
            }
        }

        if (user) {
            fetchUser(user.id)
        }

    }, [])

    console.log(user, followings)
    
    return (
        <UserContext.Provider value={{user, followings, login, updateFollowings}}>
            {children}
        </UserContext.Provider>
    )
}

//hook
export const useUser = ()=> {
    return useContext(UserContext)
}