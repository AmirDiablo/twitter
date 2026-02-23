import { useNavigate } from "react-router";

const MentionNotif = ({notifs}) => {
    const navigate = useNavigate()

    return ( 
        <div>

           {notifs.map((item)=> (
                <div>
                    {item.eventType === "mention" && 
                        <div className="text-white p-5 ">
                            <div className="flex items-center relative">
                                <div className="flex items-center w-[100%]">
                                    <div onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} className="flex items-center gap-3">
                                        <img src={"http://localhost:3000/uploads/profiles/"+item.who.profile} className="size-15 rounded-full" />
                                        <div className="text-xl"><p className="font-[700] inline">{item.who.username}</p> mentioned you on a post</div>
                                    </div>
                                    {item.post.content.file ? <img onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} src={"http://localhost:3000/uploads/posts/"+item.post.content.file} className="size-15 rounded-[7px]" /> : <div onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} className="size-15 rounded-[7px] bg-gray-800" />}
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