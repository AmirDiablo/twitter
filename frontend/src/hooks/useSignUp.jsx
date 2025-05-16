import { useState } from "react";
import { useUser } from "../contexts/userContext";


export const useSignUp = () => {
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)
    const { login } = useUser()

    const sign = async(username, email, password)=> {
        setIsLoading(true)
        setError(null)

        const response = await fetch("http://localhost:3000/api/account/signup", {
            method: "POST",
            body: JSON.stringify({username, email, password}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            localStorage.setItem("user", JSON.stringify(json))
            setIsLoading(false)
            login(json)
        }
    }

    return {sign, isLoading, error};
}
