import { useEffect, useState } from "react";
import { useComment } from "../contexts/commnetContext";
import { IoSend } from "react-icons/io5";
import { useUser } from "../contexts/userContext";
import { MdOutlineReply } from "react-icons/md";
import { useRef } from "react";

const Comments = ({PostId, isOpen, authorId}) => {
    const { fetchComments, addComment, comments } = useComment()
    const { user } = useUser()
    const [text, setText] = useState('')
    const [ replyTo, setReplyTo ] = useState(null)
    const [replies, setReplies] = useState([])
    const [commentOwner, setCommentOwner] = useState() //we only need this info for making a notif
    const [main, setMain] = useState(null)

    useEffect(()=> {
        fetchComments(PostId)
    }, [PostId])

    const postComment = (userId)=> {
        addComment(userId, text, PostId, replyTo, main, authorId, commentOwner)
        setReplyTo(null)
        setText("")
    }

    const fetchReplies = async(commentId)=> {
        const response = await fetch("http://localhost:3000/api/comment/replies/"+commentId)
        const json = await response.json()

        if(response.ok) {
            setReplies(json)
        }
    }

    return ( 
        <div className="bg-black h-[70%] w-screen p-5 z-10 fixed bottom-0 rounded-t-3xl">

            <div className="overflow-y-auto h-[90%]"> 
                {comments.map((item)=> (
                    <div className="relative flex flex-rows gap-2 items-start mb-5 leading-4">
                        <img src={"./profiles/"+item.userId.profile} className="size-9 rounded-full"  />
                        <div>
                            <p className="font-[700]">{item.userId.username}</p>
                            <p>{item.text}</p>
                            {item.repliesList.length ? 
                            <details onClick={()=> fetchReplies(item._id)}>
                                <summary className="text-[12px] text-gray-500">show {item.repliesList.length} replies</summary>
                                {replies.map((rep)=> (
                                    <div className="mt-2 relative flex flex-rows gap-2 items-start mb-5 leading-4 w-[calc(100vw-99px)]">
            
                                        <img src={"./profiles/"+rep.userId.profile} className="size-6 rounded-full"  />
                                        <div>
                                            <p className="font-[700] text-[13px]">{rep.userId.username} {rep.replyTo._id === rep.mainComment ? "" : <><span className="text-blue-500">replied to</span> {rep.replyTo.userId.username}</>}</p>
                                            <p className="text-[13px]">{rep.text}</p>
                                        </div>
                                        <MdOutlineReply onClick={()=> { setReplyTo(rep._id), setMain(item._id), setCommentOwner(item.userId._id) } } className="absolute right-5 top-2 text-xl" />

                                    </div>
                                ))}
                            </details> : ""}
                        </div>
                        <MdOutlineReply onClick={()=> {setReplyTo(item._id) ,setMain(item._id), setCommentOwner(item.userId._id)}} className="absolute right-5 top-2 text-xl" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-5 left-[50%] -translate-x-[50%] w-[80%]">
                {replyTo !== null && <div>repling to ...</div>}
                <div className="relative mx-auto">
                    <IoSend onClick={()=> postComment(user.userInfo[0]._id)} className="text-blue-500 text-2xl absolute right-2 top-1" />
                    <input onChange={(e)=> setText(e.target.value)} value={text} type="text" className="bg-black pl-2 pr-10 py-1 text-white rounded-2xl border-1 border-gray-500 focus:outline-none w-[100%]"  />
                </div>
            </div>

        </div>
    );
}
 
export default Comments;