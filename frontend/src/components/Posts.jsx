import {format} from 'date-fns'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { useNavigate } from 'react-router';
import { useUser } from "../contexts/userContext";
import { useState } from 'react';

import Comments from './Commnets';

const Posts = ({allPosts}) => {
    const { user } = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const [postId, setPostId] = useState()
    const [authorId, setAuthorId] = useState()
    const navigate = useNavigate()

    const like = async(postId, postOwner)=> {
        const response = await fetch("http://localhost:3000/api/post/like", {
            method: "PUT",
            body: JSON.stringify({postId, userId: user.userInfo[0]._id, postOwner, eventType: "like"}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json()
    }

    const bookmark = async(postId)=> {
        const response = await fetch("http://localhost:3000/api/post/bookmark", {
            method: "PUT",
            body: JSON.stringify({postId, userId: user.userInfo[0]._id}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
    }

    const openComments = (postId, author)=> {
        setPostId(postId)
        setAuthorId(author)
        setIsOpen(true)
    }

    return ( 
        <div className='text-white mt-20 mb-40'>
            {allPosts.map((item)=> (
                <div>
                    {item.length != 0 && 
                        <div className='py-5'>
    
                            <div onClick={()=> navigate("/profile", {state: {userInfo: [item.author]}})} className='flex gap-3 items-center px-5'>
                                <img className='size-10 rounded-full' src={"./profiles/"+item.author.profile} />
                                <p className='font-[600]'>{item.author.username}</p>
                                <p className='text-gray-500'>12h</p>
                            </div>

                            <div className='px-5'>
                                <div className='my-2'>{item.content.text}</div>
                                {/* dont show the image tag if the type is just text */}
                                {item.type === "text" ? "" : <>{item.type.match(/image/) ? <img className='rounded-2xl w-screen' src={"./posts/"+item.content.file}  /> : <video controls autoPlay={true} className='rounded-2xl' src={"./posts/"+item.content.file} />}</>}
                            </div>

                            <div className='flex justify-around mt-4 items-center'>
                                <div><FaRegComment onClick={()=> openComments(item._id, item.author._id)}/></div>
                                <div><BiRepost className='text-[23px]'/></div>
                                <div onClick={()=> like(item._id, item.author._id)}>{item.likes.includes(user.userInfo[0]._id) ? <FaHeart className='text-red-500' /> : <FaRegHeart />}</div>
                                <div onClick={()=> bookmark(item._id)}>{item.bookmarks.includes(user.userInfo[0]._id) ? <IoBookmark /> : <FaRegBookmark />}</div>
                            </div>
                        </div>
                    }
                </div>
            ))}

            {isOpen && <div onClick={()=> setIsOpen(false)} className='bg-gray-700/50 w-screen h-screen absolute top-0'></div>}
            {isOpen && <Comments PostId={postId} isOpen={isOpen} authorId={authorId} />}
        </div>
    );
}
 
export default Posts;