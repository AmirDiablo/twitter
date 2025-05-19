import { useNavigate } from "react-router";

const CommentNotif = ({notifs}) => {
    const navigate = useNavigate()

    return ( 
        <div>

            {notifs.map((item)=> (
                <div>
                    {item.eventType === "comment" && 
                        <div className="text-white p-5 w-screen flex items-center gap-3 relative">
                            <img onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} src={"./profiles/"+item.who.profile} className="size-20 rounded-full" />
                            <div className="">
                                <div className="text-xl"><p className="font-[700] inline">{item.who.username}</p> commented on your post:</div>
                                <p className="text-gray-400">{item.comment.text}</p>
                            </div>
                            <img onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} src={"./posts/"+item.post.content.file} className="size-15 rounded-[7px] absolute right-5" />
                        </div>
                    }
                </div>
            ))}

        </div>
    );
}
 
export default CommentNotif;