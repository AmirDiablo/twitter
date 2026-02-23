import { useUser } from "../contexts/userContext";
import Posts from "../components/Posts";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
import SideNav from "../components/SideNav";

const Bookmarks = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const [bookmarks, setBookmarks] = useState([])
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState()

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
        <div className="flex min-h-screen">

            <div className="hidden md:block md:w-64 flex-shrink-0">
                <div className="sticky top-0 h-screen">
                    <SideNav />
                </div>
            </div>

            {/* بخش اصلی محتوا*/}
            <div className="flex-1 flex flex-col min-h-screen bg-gray-950">
                <div className="text-white flex items-center gap-3 p-5 sticky top-0 left-0 right-0 bg-black/80">
                    <p onClick={()=> navigate(-1)} className="text-4xl"><IoIosArrowBack /></p>
                    <p className="text-2xl">Bookmarks</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <Posts allPosts={bookmarks}/>
                    
                    {/* نمایش خطا در صورت وجود */}
                    {error && (
                        <div className="text-center text-red-500 py-8">
                        خطا در بارگذاری: {error}
                        <button 
                            onClick={() => fetchPosts(page)} 
                            className="block mx-auto mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                        >
                            تلاش مجدد
                        </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
 
export default Bookmarks;