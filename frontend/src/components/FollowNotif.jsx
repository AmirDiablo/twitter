import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router";

const FollowNotif = ({notifs}) => {
    const { user, updateFollowings, followings } = useUser()
    const navigate = useNavigate()

    const myId = user.userInfo[0]._id

    const follow = async(userId)=> {
        const response = await fetch("http://localhost:3000/api/account/follow", {
            method: "PUT",
            body: JSON.stringify({followWho: userId, follower: myId, eventType: "follow"}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            updateFollowings(userId)
        }
    }

    return ( 
        <div>

            {notifs.map((item)=> (
                <div>
                    {item.eventType === "follow" && 
                        <div className="text-white p-5 w-screen">
                            <div className="flex items-center relative">
                                <div onClick={()=> navigate("/profile", {state: {userInfo: [item.who]}})} className="flex items-center gap-3 w-[75%]">
                                    <img src={"./profiles/"+item.who.profile} className="size-18 rounded-full" />
                                    <div className="text-xl"><p className="font-[700] inline">{item.who.username}</p> started following you</div>
                                </div>
                                {followings.includes(item.who._id) === true ? <div className="border-1 border-gray-500 text-white w-max rounded-full py-1 px-3 absolute right-3" onClick={()=> follow(item.who._id)}>unFollow</div> : <button onClick={()=> follow(item.who._id)} className="bg-white text-black border-1 border-gray-500 rounded-full py-1 absolute right-3 px-5">Follow</button>}
                            </div>
                        </div>
                    }
                </div>
            ))}

        </div>
    );
}
 
export default FollowNotif;