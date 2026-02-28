import { useLocation, useNavigate } from "react-router";
import Posts from "../components/Posts";
import { IoIosArrowBack } from "react-icons/io";
import SideNav from "../components/SideNav";
import { useEffect, useState } from "react";

const OpenedPost = () => {
    const navigate = useNavigate()
    const postId = useLocation().search.split("=")[1]
    console.log(postId)
    const [postInfo, setPostInfo] = useState([])
    const [error, setError] = useState()

    const fetchPost = async () => {
        setError(null)
        const response = await fetch("http://localhost:3000/api/post/?postId="+postId)
        const json = await response.json()

        if(response.ok) {
            setPostInfo(json)
            setError(null)
        }

        if(!response.ok) {
            setError(json.message)
        }
    }

    useEffect(()=> {
        fetchPost()
    }, [])

    return ( 
        <div className="text-white flex min-h-screen">

            <div className="hidden md:block md:w-70 flex-shrink-0">
                <div className="sticky top-0 h-screen">
                    <SideNav />
                </div>
            </div>

            {/* بخش اصلی محتوا*/}
            <div className="flex-1 flex flex-col min-h-screen bg-gray-950">
                <div className="flex items-center gap-3 p-5 sticky left-0 right-0 top-0 bg-black">
                    <div onClick={()=> navigate(-1)} className="text-4xl"><IoIosArrowBack /></div>
                    <p className="font-[700] text-2xl">Post details</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                <Posts allPosts={postInfo} />
                
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
 
export default OpenedPost;