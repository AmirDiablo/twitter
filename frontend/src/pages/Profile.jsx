import { IoMdArrowRoundBack } from "react-icons/io";
import { CgCalendarDates } from "react-icons/cg";
import { useEffect, useState } from "react";
import {format} from 'date-fns'
import { useLocation, useNavigate } from "react-router-dom";
import Posts from "../components/Posts";
import { useUser } from "../contexts/userContext";

const Profile = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { userInfo } = state
    const [posts, setPosts] = useState([])

    const { user, updateFollowings, followings } = useUser()

    console.log(followings)

    const myId = user.userInfo[0]._id
    const userId = userInfo[0]._id

    const fetchPosts = async()=> {
        const response = await fetch("http://localhost:3000/api/post/userPosts/"+userId)
        const json = await response.json()

        if(response.ok) {
            setPosts(json)
        }
    }

    useEffect(()=> {
        fetchPosts()
    }, [])

    //we need to create a context to show user follow the user in a seccond after it happened
    const follow = async()=> {
        const response = await fetch("http://localhost:3000/api/account/follow", {
            method: "PUT",
            body: JSON.stringify({followWho: userId, follower: myId}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            console.log("followed")
            updateFollowings(userInfo[0]._id)
        }
    }

    return ( 
        <div className="text-white">

            {userInfo.map((item)=> (
                <div>

                    <div className="flex items-center gap-5 px-3" >
                        <IoMdArrowRoundBack onClick={()=> navigate(-1)} className="text-2xl"/>
                        <div>
                            <p className="">{item.username}</p>
                            <p className="text-[12px] text-gray-400">100 posts</p>
                        </div>
                    </div>

                    <div className="header relative">
                        {item.header ? <img src={"./headers/"+item.header} className="h-25" /> : <div className="h-25 bg-gray-700"></div>}
                        <img src={'./profiles/'+item.profile} className="absolute -bottom-10 left-5 rounded-full size-19" />
                    </div>

                    <div className="px-5 pt-15 relative">
                        <p className="font-[700]">{item.username}</p>
                        <p className="text-gray-500 flex items-center gap-1"><CgCalendarDates /> Joiend {format(new Date(item.createdAt), "yyyy-mm-dd")}</p>
                        <div className="flex gap-6">
                            <div className="flex gap-1">
                                <p>{item.followings.length}</p>
                                <p className="text-gray-500">followings</p>
                            </div>
                            <div className="flex gap-1">
                                <p>{item.followers.length}</p>
                                <p className="text-gray-500">followers</p>
                            </div>
                        </div>

                        {userId === myId ? <button className=" border-1 border-gray-500 rounded-full py-1 absolute top-3 right-3 px-5">Edit profile</button> : <>{followings.includes(userInfo[0]._id) === true ? <div className="border-1 border-gray-500 text-white w-max rounded-full py-1 px-3 absolute top-3 right-3" onClick={follow}>unFollow</div> : <button onClick={follow} className="bg-white text-black border-1 border-gray-500 rounded-full py-1 absolute top-3 right-3 px-5">Follow</button>}</>}
                    </div>

                    <Posts allPosts={posts}/>

                </div>
            ))}

        </div>
    );
}
 
export default Profile;