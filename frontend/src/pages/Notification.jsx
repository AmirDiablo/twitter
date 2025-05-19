import { useEffect } from "react";
import { useState } from "react";
import { useUser } from "../contexts/userContext";
import FollowNotif from "../components/FollowNotif";
import { IoIosArrowBack } from "react-icons/io";
import LikeNotif from "../components/LikeNotif";
import ReplyNotif from "../components/ReplyNotif";
import CommentNotif from "../components/CommentNotif";
import MentionNotif from "../components/MentionNotif";

const Notification = () => {
    const [notifs, setNotifs] = useState([])
    const { user } = useUser()

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

    return ( 
        <div>

            <div className="text-white flex items-center gap-3 p-5 z-10 bg-black/80 fixed left-0 right-0 top-0">
               <div className="text-4xl"><IoIosArrowBack /></div>
               <p className="font-[700] text-2xl">Notifications</p>
            </div>

            <div className="mt-15 mb-15">
                <CommentNotif notifs={notifs}/>
                <LikeNotif notifs={notifs} />
                <FollowNotif notifs={notifs} />
                <ReplyNotif notifs={notifs} />
                <MentionNotif notifs={notifs}/>
            </div>

        </div>
     );
}
 
export default Notification;