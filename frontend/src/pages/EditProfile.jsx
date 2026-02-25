import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import SideNav from "../components/SideNav";


const EditProfile = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user, token, setUser } = useUser()
    const [headerFile, setHeaderFile] = useState(user.header ? user.header : null)
    const [headerPreview, setHeaderPreview] = useState(null)
    const [profile, setProfile] = useState(user.profile ? user.profile : null)
    const [profilePreview, setProfilePreview ] = useState(null)
    const [username, setUsername] = useState(user.username)

    const myId = user._id
    const userId = useLocation()?.search?.split("=")[1]

    useEffect(() => {
        setLoading(false)
    }, [userId])

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

    /* if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'user not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Back
                    </button>
                </div>
            </div>
        )
    } */

    const handleHeaderChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
            setHeaderFile(selectedFile);
            
            // ایجاد preview با FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeaderPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleProfileChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
            setProfile(selectedFile);
            
            // ایجاد preview با FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    const applyChanges = async ()=> {
        if(!profilePreview && !headerPreview && username == user.username) {
            setError('Nothing changed')
            return 
        }

        const formData = new FormData()
        formData.append('profile', profile)
        formData.append('header', headerFile)
        formData.append("username", username)
        const response = await fetch("http://localhost:3000/api/account/changeProfile", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setUser(json.userInfo)
            navigate(-1)
        }

        if(!response.ok) {
            setError(json.message)
        }
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
            <div className="sticky top-0 flex flex-row items-center justify-between bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 z-10">
                <div className="flex items-center gap-5 px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <IoMdArrowRoundBack className="text-2xl" />
                    </button>
                    Edit profile
                </div>
                <button onClick={applyChanges} className="bg-blue-500 p-2 hover:cursor-pointer rounded-full px-7 md:px-10 mr-3 disabled:cursor-not-allowed disabled:opacity-50" disabled={(!profilePreview && !headerPreview && username == user.username) ? true : false }>
                    Save
                </button>
            </div>

            <div >
                    {/* کاور و پروفایل */}
                    <div className="relative">
                        {/* کاور */}
                        <div className="h-32 relative bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
                            <input className="absolute left-0 top-0 bottom-0 right-0 opacity-0" type="file" onChange={handleHeaderChange} name="header" />
                            {headerPreview ?
                                <img
                                    src={headerPreview}
                                    className="w-full h-full object-cover"
                                    alt="cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x200?text=Cover'
                                    }}
                                />
                                : <>{user.header ? (
                                <img
                                    src={"http://localhost:3000/uploads/headers/"+headerFile}
                                    className="w-full h-full object-cover"
                                    alt="cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x200?text=Cover'
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900"></div>
                            )}</>
                            }
                        </div>

                        {/* عکس پروفایل */}
                        <div className="absolute -bottom-12 left-5">
                            <div className="relative">
                                <input className="absolute top-0 left-0 bottom-0 right-0 rounded-full opacity-0" type="file" onChange={handleProfileChange} name="profile" />
                                {profilePreview ?
                                    <img
                                        src={profilePreview}
                                        className="w-24 h-24 rounded-full border-4 border-gray-950 object-cover"
                                        alt={user.username}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/96?text=User'
                                        }}
                                    /> :
                                    <img
                                        src={'http://localhost:3000/uploads/profiles/' + profile}
                                        className="w-24 h-24 rounded-full border-4 border-gray-950 object-cover"
                                        alt={user.username}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/96?text=User'
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    {/* اطلاعات کاربر */}
                    <div className="px-5 pt-16 pb-4 border-b border-gray-800">
                        <input type="text" className="border-gray-500 border-2 rounded-2xl p-2 outline-none focus:border-blue-500" onChange={(e)=> setUsername(e.target.value)} value={username} />
                        <p className="text-gray-400 text-sm mt-1">@{username?.toLowerCase()}</p>
                    </div>

                </div>



                {error && (
                    <div className="mt-4 mx-2 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

        </div>
    </div>
)
}

export default EditProfile