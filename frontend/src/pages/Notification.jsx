import { useEffect } from "react";
import { useState } from "react";
import { useUser } from "../contexts/userContext";
import FollowNotif from "../components/FollowNotif";
import { IoIosArrowBack } from "react-icons/io";
import LikeNotif from "../components/LikeNotif";
import ReplyNotif from "../components/ReplyNotif";
import CommentNotif from "../components/CommentNotif";
import MentionNotif from "../components/MentionNotif";
import { useNavigate } from "react-router";
import SideNav from "../components/SideNav"
import { useRef } from "react";

const Notification = () => {
    const navigate = useNavigate()
    const [notifs, setNotifs] = useState([])
    const { user } = useUser()
    const [error, setError] = useState(null);
    /* const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);
    const observerRef = useRef();
    const lastPostRef = useRef();
    const [page, setPage] = useState(1); */

    const myId = user.userInfo[0]._id

    const fetchNotifs = async(userId)=> {
        const response = await fetch("http://localhost:3000/api/notification/"+userId)
        const json = await response.json()

        if(response.ok) {
            setNotifs(json)
        }
    }

    useEffect(()=> {
        fetchNotifs(myId)
    }, [])

    /* useEffect(() => {
        if (loadingRef.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                fetchPosts(page);
            }
        }, {
            rootMargin: '100px', // 100px مانده به آخرین المان، لود بعدی شروع شود
            threshold: 0.1
        });

        if (lastPostRef.current) {
            observerRef.current.observe(lastPostRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, page, fetchPosts]); */

    return ( 
        <div className="flex min-h-screen">

            <div className="hidden md:block md:w-70 flex-shrink-0">
                <div className="sticky top-0 h-screen">
                    <SideNav />
                </div>
            </div>

            {/* بخش اصلی محتوا*/}
            <div className="flex-1 flex flex-col min-h-screen bg-gray-950">
                <div className="text-white flex items-center gap-3 p-5 z-10 bg-black/80 sticky left-0 right-0 top-0">
                    <div onClick={()=> navigate(-1)} className="text-3xl"><IoIosArrowBack /></div>
                    <p className="font-[700] text-xl">Notifications</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="md:px-10 lg:px-30 xl:px-50 mb-15">
                        <CommentNotif notifs={notifs}/>
                        <LikeNotif notifs={notifs} />
                        <FollowNotif notifs={notifs} />
                        <ReplyNotif notifs={notifs} />
                        <MentionNotif notifs={notifs}/>
                    </div>
                    
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
 
export default Notification;