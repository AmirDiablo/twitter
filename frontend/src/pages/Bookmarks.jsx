import { useUser } from "../contexts/userContext";
import Posts from "../components/Posts";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";

const Bookmarks = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const [bookmarks, setBookmarks] = useState([])
    const [isLoading, setIsLoading] = useState(null)

    const fetchBookmarks = async()=> {
        setIsLoading(true)
        const response = await fetch("http://localhost:3000/api/account/bookmarks/"+user.userInfo[0]._id)
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
        }
        
        if(response.ok) {
            setIsLoading(false)
            setBookmarks(json)
        }
    }

    useEffect(()=> {
        fetchBookmarks()
    }, [])

    return ( 
        <div className="mt-20">
            <div className="text-white flex items-center gap-3 p-5 fixed top-0 left-0 right-0 bg-black/80">
                <p onClick={()=> navigate(-1)} className="text-4xl"><IoIosArrowBack /></p>
                <p className="text-2xl">Bookmarks</p>
            </div>

            {isLoading && <Loader />}

           <Posts allPosts={bookmarks}/>

        </div>
    );
}
 
export default Bookmarks;