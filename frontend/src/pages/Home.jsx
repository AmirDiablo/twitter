import Top from "../components/Top";
import SideNav from "../components/SideNav";
import { useEffect, useRef, useState } from "react";
import Posts from "../components/Posts";
import { useUser } from "../contexts/userContext";

const Home = () => {
    const [open, setOpen] = useState(false)
    const [posts, setPosts] = useState([])
    const { token } = useUser()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);
    const observerRef = useRef();
    const lastPostRef = useRef();
    const [page, setPage] = useState(1);


    const openNav = () => {
        setIsMobileNavOpen(true);
        document.body.style.overflow = 'hidden';
  }

  const closeNav = () => {
    setIsMobileNavOpen(false);
    document.body.style.overflow = 'unset';
  }

    const fetchPosts = async()=> {
        const response = await fetch("http://localhost:3000/api/post/homePosts", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setPosts(json)
        }
    }

    useEffect(()=> {
        if(token) {
            fetchPosts()
        }
    }, [token])

    useEffect(() => {
            if (loadingRef.current) return;

            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                    fetchPosts(page);
                }
            }, {
                rootMargin: '100px', // 100px مانده به آخرین المان، لود بعدی شروع شود
                threshold: 0.1
            });

            if (lastPostRef.current) {
                observerRef.current.observe(lastPostRef.current);
            }

            return () => {
                if (observerRef.current) {
                    observerRef.current.disconnect();
                }
            };
    }, [hasMore, page, fetchPosts]);

    return ( 
        <div className="text-white flex min-h-screen">

            <div className="hidden md:block md:w-64 flex-shrink-0">
                <div className="sticky top-0 h-screen">
                    <SideNav />
                </div>
            </div>

            {/* منوی موبایل - کشویی از چپ */}
            <div className="md:hidden">
                {/* لایه تیره */}
                <div
                    className={`
                    fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
                    ${isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    onClick={closeNav}
                />
        
                {/* خود منو */}
                <div className={`
                    fixed top-0 left-0 h-full z-50
                    transition-transform duration-300 ease-in-out transform
                    ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="w-[80vw] max-w-[300px] h-full bg-gray-950 shadow-2xl overflow-y-auto">
                    <SideNav />
                    </div>
                </div>
            </div>



            {/* بخش اصلی محتوا*/}
                <div className="flex-1 flex flex-col min-h-screen bg-gray-950">
                    <Top openNav={openNav} />
                    <div className="flex-1 overflow-y-auto">
                      <Posts allPosts={posts} />
                      
                      {/* المان رصد کننده برای تشخیص رسیدن به انتهای صفحه */}
                      <div ref={lastPostRef} className="w-full h-10" />
                      
                      {/* نمایش لودر هنگام بارگذاری */}
                      {loadingRef.current && <Loader />}
                      
                      {/* نمایش پیام پایان پست‌ها */}
                      {!hasMore && posts.length > 0 && (
                        <div className="text-center text-gray-500 py-8">
                          🎉 You reached end of the posts
                        </div>
                      )}
                      
                      {/* نمایش خطا در صورت وجود */}
                      {error && (
                        <div className="text-center text-red-500 py-8">
                          خطا در بارگذاری: {error}
                          <button 
                            onClick={() => fetchPosts(page)} 
                            className="block mx-auto mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                          >
                            تلاش مجدد
                          </button>
                        </div>
                      )}
                    </div>
                </div>
            
        </div>
    );
}
 
export default Home;