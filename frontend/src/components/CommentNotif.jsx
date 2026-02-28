import { useNavigate } from "react-router";

const CommentNotif = ({notifs}) => {
    const navigate = useNavigate()

    return ( 
        <div>

            {notifs.map((item)=> (
                <div>
                    {item.eventType === "comment" && 
                        <div className="text-white p-5 flex items-center gap-3">
                            <div className="flex items-center gap-3 w-[100%]">
                                <img onClick={()=> navigate("/profile/?userId="+item.who._id)} src={"http://localhost:3000/uploads/profiles/"+item.who.profile} className="size-15 rounded-full" />
                                <div className="text-sm">
                                    <div className="text-sm"><p className="font-[700] inline">{item.who.username}</p> commented on your post:</div>
                                    <p className="text-gray-400">{item.comment.text}</p>
                                </div>
                            </div>
                            <img onClick={()=> navigate("/openedPost/?postId="+item.post._id)} src={"http://localhost:3000/uploads/posts/"+item.post.content.file} className="size-15 rounded-[7px]" />
                        </div>
                    }
                </div>
            ))}

        </div>
    );
}
 
export default CommentNotif;