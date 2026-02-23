import { useNavigate } from "react-router";

const ReplyNotif = ({notifs}) => {
    const navigate = useNavigate()
    
    return ( 
        <div>

            {notifs.map((item)=> (
                <div className="w-[100%]">
                    {item.eventType === "reply" && 
                        <div className="text-white p-5 flex justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <img onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} src={"http://localhost:3000/uploads/profiles/"+item.who.profile} className="size-15 rounded-full" />
                                <div className="text-sm">
                                    <div className="text-sm"><p className="font-[700] inline">{item.who.username}</p> replied to your comment:</div>
                                    <p className="text-gray-400">{item.comment.text}</p>
                                </div>
                            </div>
                            <img onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} src={"http://localhost:3000/uploads/posts/"+item.post.content.file} className="size-15 rounded-[7px]" />
                        </div>
                    }
                </div>
            ))}

        </div>
    );
}
 
export default ReplyNotif;