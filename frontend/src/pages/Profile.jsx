import { IoMdArrowRoundBack } from "react-icons/io";
import { CgCalendarDates } from "react-icons/cg";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useLocation, useNavigate } from "react-router-dom";
import Posts from "../components/Posts";
import { useUser } from "../contexts/userContext";
import SideNav from "../components/SideNav";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";

const Profile = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('posts') // 'posts', 'replies', 'media'

    const { user, updateFollowings, followings } = useUser()

    const myId = user._id
    const userId = useLocation()?.search?.split("=")[1]

    const fetchUserInfo = async () => {
    try {
    const response = await fetch("http://localhost:3000/api/account/profile/" + userId)
    const json = await response.json()

    if (response.ok) {
    setUserInfo(json)
    } else {
    setError('خطا در دریافت اطلاعات کاربر')
    }
    } catch (err) {
    setError('خطا در ارتباط با سرور')
    }
    }

    const fetchPosts = async () => {
    try {
    const response = await fetch("http://localhost:3000/api/post/userPosts/" + userId)
    const json = await response.json()

    if (response.ok) {
    setPosts(json)
    }
    } catch (err) {
    setError('خطا در دریافت پست‌ها')
    } finally {
    setLoading(false)
    }
    }

    useEffect(() => {
        setLoading(true)
        fetchUserInfo()
        fetchPosts()
    }, [userId])

    const follow = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/account/follow", {
                method: "PUT",
                body: JSON.stringify({ eventType: "follow", followWho: userId, follower: myId }),
                headers: {
                "Content-Type": "application/json"
                }
            })
            const json = await response.json()

            if (!response.ok) {
                console.log(json.error)
            }
            if (response.ok) {
                updateFollowings(userInfo[0]._id)
                setUserInfo(prev => [{
                    ...prev[0],
                    followers: json.followers
                }])
            }
        } catch (err) {
            console.error('خطا در دنبال کردن:', err)
        }
    }

    if (loading) {
        return (
                <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">در حال بارگذاری...</p>
                    </div>
                </div>
            )
    }

    if (error || !userInfo.length) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'کاربر یافت نشد'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        بازگشت
                    </button>
                </div>
            </div>
        )
    }

return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
        {/* SideNav برای دسکتاپ */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
            <div className="sticky top-0 h-screen">
                <SideNav />
            </div>
        </div>

        {/* بخش اصلی */}
        <div className="flex-1 max-w-2xl mx-auto w-full">
            {/* هدر با بازگشت */}
            <div className="sticky top-0 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 z-10">
                <div className="flex items-center gap-5 px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <IoMdArrowRoundBack className="text-2xl" />
                    </button>
                    {userInfo.map((item) => (
                        <div key={item._id}>
                        <p className="font-bold text-lg">{item.username}</p>
                        <p className="text-xs text-gray-400">{posts.length} پست</p>
                        </div>
                    ))}
                </div>
            </div>

            {userInfo.map((item) => (
                <div key={item._id}>
                    {/* کاور و پروفایل */}
                    <div className="relative">
                        {/* کاور */}
                        <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                            {item.header ? (
                                <img
                                    src={"http://localhost:3000/uploads/headers/" + item.header}
                                    className="w-full h-full object-cover"
                                    alt="cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x200?text=Cover'
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900"></div>
                            )}
                        </div>

                        {/* عکس پروفایل */}
                        <div className="absolute -bottom-12 left-5">
                            <div className="relative">
                                <img
                                    src={'http://localhost:3000/uploads/profiles/' + item.profile}
                                    className="w-24 h-24 rounded-full border-4 border-gray-950 object-cover"
                                    alt={item.username}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/96?text=User'
                                    }}
                                />
                            </div>
                        </div>

                        {/* دکمه اکشن */}
                        <div className="absolute top-4 right-4">
                            {userId === myId ? (
                                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-full py-2 px-5 transition-colors text-sm font-medium">
                                ویرایش پروفایل
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                                        <BiMessageDetail className="text-xl" />
                                    </button>
                                    <button
                                        onClick={follow}
                                        className={`flex items-center gap-2 rounded-full py-2 px-5 transition-colors text-sm font-medium ${
                                        followings?.includes(item._id)
                                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                                            : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    >
                                        {followings?.includes(item._id) ? (
                                            <>
                                            <FaUserCheck className="text-lg" />
                                            دنبال شده
                                            </>
                                        ) : (
                                            <>
                                            <FaUserPlus className="text-lg" />
                                            دنبال کردن
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* اطلاعات کاربر */}
                    <div className="px-5 pt-16 pb-4 border-b border-gray-800">
                        <p className="font-bold text-xl">{item.username}</p>
                        <p className="text-gray-400 text-sm mt-1">@{item.username?.toLowerCase()}</p>

                        <p className="text-gray-400 flex items-center gap-1 mt-3 text-sm">
                            <CgCalendarDates className="text-lg" />
                           Joined {format(new Date(item.createdAt), "yyyy-MM-dd")}
                        </p>

                        <div className="flex gap-6 mt-4">
                            <div className="flex gap-1 items-center">
                                <span className="font-bold">{item.followings?.length || 0}</span>
                                <span className="text-gray-400 text-sm">دنبال‌شونده</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="font-bold">{item.followers?.length || 0}</span>
                                <span className="text-gray-400 text-sm">دنبال‌کننده</span>
                            </div>
                        </div>
                    </div>

                    {/* تب‌ها */}
                    <div className="flex border-b border-gray-800">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                            activeTab === 'posts'
                                ? 'text-blue-500'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            پست‌ها
                            {activeTab === 'posts' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('replies')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                            activeTab === 'replies'
                                ? 'text-blue-500'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            پاسخ‌ها
                            {activeTab === 'replies' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                            activeTab === 'media'
                                ? 'text-blue-500'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            رسانه
                            {activeTab === 'media' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                    </div>

                    {/* محتوای تب‌ها */}
                    <div className="py-4">
                        {activeTab === 'posts' && <Posts allPosts={posts} />}
                        {activeTab === 'replies' && (
                        <div className="text-center text-gray-500 py-16">
                             هیچ پاسخی وجود ندارد
                        </div>
                        )}
                        {activeTab === 'media' && (
                            <div className="text-center text-gray-500 py-16">
                            هیچ رسانه‌ای وجود ندارد
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
}

export default Profile