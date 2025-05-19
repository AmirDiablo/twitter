import { IoPersonOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/userContext";

const SideNav = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    const open = (page)=> {
        navigate("/"+page, {state: {userInfo: user.userInfo}})
    }

    return ( 
        <div className="text-white fixed bg-black top-0 left-0 bottom-0 w-[60%] z-11">
            <div className="px-3 py-4">
                <img src={"./profiles/"+user.userInfo[0].profile} className="size-10 rounded-full "/>
                <p className="font-[700]">{user.userInfo[0].username}</p>
                <div className="flex gap-3">
                    <div> <p className="text-gray-500 inline">following</p> {user.userInfo[0].followings.length}</div>
                    <div> <p className="text-gray-500 inline">followers</p> {user.userInfo[0].followers.length}</div>
                </div>
            </div>
            <div onClick={()=> open("profile")} className="flex items-center gap-3 text-xl font-[500] py-2 px-3">
                <IoPersonOutline />
                <p>profile</p>
            </div>
            <div onClick={()=> open("bookmarks")} className="flex items-center gap-3 text-xl font-[500] py-2 px-3">
                <IoBookmarkOutline />
                <p>bookmarks</p>
            </div>
            <div className="flex items-center gap-3 text-xl font-[500] py-2 px-3">
                <IoSettingsOutline />
                <p>settings</p>
            </div>
        </div>
    );
}
 
export default SideNav;