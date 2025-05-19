import { useNavigate } from "react-router";
import { useUser } from "../contexts/userContext";


const Accounts = ({info}) => {
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
        <div className="p-5">
            {info.map((item)=> (
                <div>
                    {item._id === myId ? '' : 
                        <div className="flex gap-3 items-center mb-3 relative">
                            <img onClick={()=> navigate("/profile", {state: {userInfo: [item]}})} src={"./profiles/"+item.profile} className="size-13 rounded-full"  />
                            <p onClick={()=> navigate("/profile", {state: {userInfo: [item]}})} className="font-[700]">{item.username}</p>
                            {followings.includes(item._id) === true ? <div className="border-1 border-gray-500 text-white w-max rounded-full py-1 px-3 absolute top-3 right-3" onClick={()=> follow(item._id)}>unFollow</div> : <button onClick={()=> follow(item._id)} className="bg-white text-black border-1 border-gray-500 rounded-full py-1 absolute top-3 right-3 px-5">Follow</button>}
                        </div>
                    }
                </div>
            ))}
        </div>
    );
}
 
export default Accounts;