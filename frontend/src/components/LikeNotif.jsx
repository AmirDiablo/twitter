import { useNavigate } from "react-router";

const LikeNotif = ({notifs}) => {
    const navigate = useNavigate()

    return ( 
        <div>

            {notifs.map((item)=> (
                <div>
                    {item.eventType === "like" && 
                        <div className="text-white p-5">
                            <div className="flex items-center justify-between ">
                                <div className="flex items-center justify-between gap-3 w-[100%] ">
                                    <div onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} className="flex items-center gap-3 ">
                                        <img src={"http://localhost:3000/uploads/profiles/"+item.who.profile} className="size-15 rounded-full" />
                                        <div className="text-sm"><p className="font-[700] inline">{item.who.username}</p> liked your post</div>
                                    </div>
                                    {item.post.content.file ? <img onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} src={"http://localhost:3000/uploads/posts/"+item.post.content.file} className="size-15 rounded-[7px]" /> : <div onClick={()=> navigate("/openedPost", {state: {postInfo: [item.post]}})} className="size-15 rounded-[7px] bg-gray-800 " />}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
}
 
export default LikeNotif;