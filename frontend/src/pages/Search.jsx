import { useEffect, useState } from "react";
import ExploreTop from "../components/ExploreTop";
import SideNav from "../components/SideNav";
import Accounts from "../components/Accounts";
import Posts from "../components/Posts";
import { useLocation } from "react-router";
import { FaUser, FaFileAlt } from "react-icons/fa";

const Search = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("people")
    const [error, setError] = useState(null)
    const [infos, setInfos] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const location = useLocation()
    const query = location.search.split("?")[1] || ""

    const openNav = () => {
        setIsMobileNavOpen(true)
    }

    const closeNav = () => {
        setIsMobileNavOpen(false)
    }

    const changeTab = (value) => {
        setInfos([])
        setActiveTab(value)
        setError(null)
    }

    const fetchPeople = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/api/account/${activeTab}?q=${query}`)
            const json = await response.json()

            if (!response.ok) {
                setError(json.error || 'خطا در دریافت اطلاعات')
                setInfos([])
                } else {
                setInfos(json)
                setError(null)
            }
        } catch (err) {
            setError('خطا در ارتباط با سرور')
            setInfos([])
        } finally {
            setLoading(false)
        }
    }

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/api/post/${activeTab}?q=${query}`)
            const json = await response.json()

            if (!response.ok) {
                setError(json.error || 'خطا در دریافت پست‌ها')
                setInfos([])
            } else {
                setInfos(json)
                setError(null)
            }
        } catch (err) {
            setError('خطا در ارتباط با سرور')
            setInfos([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!query) {
            setInfos([])
            setError(null)
            return
        }

        if (activeTab === "people") {
            fetchPeople()
        } else if (activeTab === "posts") {
            fetchPosts()
        }
    }, [activeTab, query])

    useEffect(() => {
        // استخراج کلمه جستجو از URL
        if (query) {
            setSearchTerm(decodeURIComponent(query))
        }
    }, [query])

    if (!query) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
                {/* SideNav برای دسکتاپ */}
                <div className="hidden md:block md:w-64 flex-shrink-0">
                    <div className="sticky top-0 h-screen">
                        <SideNav />
                    </div>
                </div>

                {/* منوی موبایل */}
                <div className="md:hidden">
                    <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeNav} />
                    <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 transform ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="w-[80vw] max-w-[300px] h-full bg-gray-950 shadow-2xl overflow-y-auto">
                            <SideNav />
                        </div>
                    </div>
                </div>

                {/* بخش اصلی */}
                <div className="flex-1">
                    <ExploreTop openNav={openNav} />
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                        <FaFileAlt className="text-6xl text-gray-700 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">جستجو کنید</h2>
                        <p className="text-gray-400">با جستجو می‌توانید افراد و پست‌های مورد نظر خود را پیدا کنید</p>
                    </div>
                </div>
            </div>
        )
    }

return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
        {/* SideNav برای دسکتاپ */}
        <div className="hidden md:block md:w-70 flex-shrink-0">
            <div className="sticky top-0 h-screen">
                <SideNav />
            </div>
        </div>

        {/* منوی موبایل */}
        <div className="md:hidden">
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeNav} />
            <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 transform ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-[80vw] max-w-[300px] h-full bg-gray-950 shadow-2xl overflow-y-auto">
                    <SideNav />
                </div>
            </div>
        </div>

        {/* بخش اصلی */}
        <div className="flex-1">
            <ExploreTop openNav={openNav} />

            {/* هدر جستجو */}
            <div className="sticky top-0 z-20 bg-black backdrop-blur-xl border-b border-gray-800 md:px-10 lg:px-20 xl:px-40">
                <div className="px-4 py-3">
                    <h1 className="text-xl font-bold">search results for  : "{searchTerm}"</h1>
                </div>

                {/* تب‌ها */}
                <div className="flex">
                    <button onClick={() => changeTab("people")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "people"
                            ? 'text-blue-500'
                            : 'text-gray-500 hover:text-gray-300'
                            }
                        `}
                    >
                        <FaUser className="text-lg" />
                        <span>افراد</span>
                        {activeTab === "people" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                        )}
                    </button>
                    <button
                        onClick={() => changeTab("posts")}
                        className={`
                        flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative
                        ${activeTab === "posts"
                        ? 'text-blue-500'
                        : 'text-gray-500 hover:text-gray-300'
                        }
                    `}
                    >
                        <FaFileAlt className="text-lg" />
                        <span>پست‌ها</span>
                        {activeTab === "posts" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* محتوای اصلی */}
            <div className="py-4 md:px-10 lg:px-20 xl:px-40">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                ) : infos.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <FaFileAlt className="text-5xl text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">نتیجه‌ای یافت نشد</p>
                        <p className="text-gray-500 text-sm mt-2">موردی با این مشخصات پیدا نکردیم</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "people" && <Accounts info={infos} />}
                        {activeTab === "posts" && <Posts allPosts={infos} />}
                    </>
                )}
            </div>
        </div>
    </div>
)
}

export default Search