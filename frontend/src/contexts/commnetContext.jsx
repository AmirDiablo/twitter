import { createContext, useContext, useEffect, useState } from "react";

const CommentContext = createContext()

export const CommentProvider = ({ children })=> {
    const [comments, setComments] = useState([])

    const fetchComments = async(postId)=> {
        const response = await fetch("http://localhost:3000/api/comment/"+postId)
        const json = await response.json()

        if(response.ok) {
            setComments(json)
        }
    }

    const addComment = async(userId, text, postId, replyTo, mainComment)=> {
         const response = await fetch("http://localhost:3000/api/comment/postComment", {
            method: "POST",
            body: JSON.stringify({userId, text, postId, replyTo, mainComment}),
            headers: {
                "Content-Type" : "application/json"
            }
         })

         const json = await response.json()
         
         if(!response.ok) {
            console.log(json.error)
         }
         if(response.ok) {
            setComments([...comments, json])
         }
    }

    const deleteComment = async()=> {

    }

    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            console.log("sljv")
        }

    }, [])

    console.log(comments)
    
    return (
        <CommentContext.Provider value={{comments, fetchComments, addComment}}>
            {children}
        </CommentContext.Provider>
    )
}

//hook
export const useComment = ()=> {
    return useContext(CommentContext)
}