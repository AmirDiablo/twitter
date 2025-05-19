import { useNavigate } from "react-router";

const MentionNotif = ({notifs}) => {
    const navigate = useNavigate()

    return ( 
        <div>

           {notifs.map((item)=> (
                <div>
                    {item.eventType === "mention" && 
                        <div className="text-white p-5 w-screen">
                            <div className="flex items-center relative">
                                <div className="flex items-center w-[75%]">
                                    <div onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} className="flex items-center gap-3">
                                        <img src={"./profiles/"+item.who.profile} className="size-18 rounded-full" />
                                        <div className="text-xl"><p className="font-[700] inline">{item.who.username}</p> mentioned you on a post</div>
                                    </div>
                                    {item.post.content.file ? <img onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} src={"posts/"+item.post.content.file} className="size-12 rounded-[7px] absolute right-5" /> : <div onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} className="size-12 rounded-[7px] bg-gray-800 absolute right-5" />}
                                </div>
                            </div>
                        </div>
                    }
                </div>
           ))}

        </div>
    );
}
 
export default MentionNotif;