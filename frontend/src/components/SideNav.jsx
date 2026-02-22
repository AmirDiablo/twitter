import { IoPersonOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/userContext";

const SideNav = () => {
const { user } = useUser()
const navigate = useNavigate()

// اضافه کردن console.log برای دیباگ
console.log("SideNav user:", user);

const open = (page) => {
if (user?.userInfo?.[0]?._id) {
navigate(`/${page}/?userId=${user.userInfo[0]._id}`);
} else {
// اگر user نبود، به صفحه لاگین هدایت شود
navigate('/login');
}
}

// اگر user وجود نداشت، یک منوی پیش‌فرض نمایش بده
if (!user || !user.userInfo || !user.userInfo[0]) {
    return (
        <div className="sideNav text-white bg-gray-950 h-full overflow-y-auto p-4">
            <p className="text-center text-gray-400 mt-10">لطفا وارد شوید</p>
            <div onClick={()=> navigate('/login')} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors mt-4">
                <IoPersonOutline />
                <p>ورود / ثبت نام</p>
            </div>
            <div onClick={()=> navigate('/')} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <GoHome />
                <p>Home</p>
            </div>
            <div onClick={()=> navigate("/explore")} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <FiSearch />
                <p>Search</p>
            </div>
        </div>
    );
}

return (
    <div className="sideNav text-white bg-gray-950 h-full overflow-y-auto">
        <div className="px-4 py-6 border-b border-gray-800">
            <img 
                src={"http://localhost:3000/uploads/profiles/"+user.userInfo[0].profile} 
                className="size-12 rounded-full object-cover mb-3" 
                alt={user.userInfo[0].username}
                onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48?text=User';
                }}
            />
            <p className="font-[700] text-lg">{user.userInfo[0].username}</p>
            <div className="flex gap-4 mt-2 text-sm">
                <div> 
                    <span className="text-gray-500 ml-1">following</span> 
                    <span className="font-[600]">{user.userInfo[0].followings?.length || 0}</span>
                </div>
                <div> 
                    <span className="text-gray-500 ml-1">followers</span> 
                    <span className="font-[600]">{user.userInfo[0].followers?.length || 0}</span>
                </div>
            </div>
        </div>

        <nav className="p-2">
            <div onClick={()=> open("profile")} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <IoPersonOutline />
                <p>Profile</p>
            </div>
            <div onClick={()=> open("bookmarks")} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <IoBookmarkOutline />
                <p>Bookmarks</p>
            </div>
            <div className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                <IoSettingsOutline />
                <p>Settings</p>
            </div>
            <div onClick={()=> navigate('/')} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors max-md:hidden">
                <GoHome />
                <p>Home</p>
            </div>
            <div onClick={()=> navigate("/explore")} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors max-md:hidden">
                <FiSearch />
                <p>Search</p>
            </div>
            <div onClick={()=> navigate('/notification')} className="flex items-center gap-3 text-lg font-[500] py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors max-md:hidden">
                <IoNotificationsOutline />
                <p>Notifications</p>
            </div>
        </nav>
    </div>
);
}

export default SideNav;