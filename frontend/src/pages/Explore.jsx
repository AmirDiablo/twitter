import { useCallback, useEffect, useRef, useState } from "react";
import ExploreTop from "../components/ExploreTop";
import SideNav from "../components/SideNav";
import Posts from "../components/Posts";
import Loader from "../components/Loader"

const POSTS_API_URL = "http://localhost:3000/api/post/all"

const Explore = () => {
    const [open, setOpen] = useState(false)
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [error, setError] = useState(null);
    const loadingRef = useRef(false); // نگهداری وضعیت loading بدون رندر اضافی

    const openNav = (status)=> {
        setOpen(status)
    } 

  // تابع برای گرفتن داده‌ها از سرور
  const fetchPosts = useCallback(async (pageNum) => {
    if (loadingRef.current) return; // اگر در حال لود است، خروج
    loadingRef.current = true;
    setError(null);

    try {
      const response = await fetch(`${POSTS_API_URL}?page=${pageNum}&limit=5`);
      if (!response.ok) {
        throw new Error('خطا در دریافت داده‌ها');
      }
      const data = await response.json();

      // جلوگیری از افزودن پست تکراری
      setPosts(prevPosts => {
        const existingIds = new Set(prevPosts.map(p => p._id));
        const newPosts = data.posts.filter(p => !existingIds.has(p._id));
        return [...prevPosts, ...newPosts];
      });

      setTotalPages(data.totalPages);

      // فقط وقتی پست جدید دریافت شد صفحه را افزایش دهیم
      if (data.posts.length > 0) {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // load اولیه
  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // فقط یک بار اجرا در ابتدا

  // چک کردن رسیدن به پایین صفحه برای بارگذاری بعدی
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (totalPages && page > totalPages) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchPosts(page);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchPosts, page, totalPages]);

    return ( 
        <div className="text-white">
            <ExploreTop openNav={openNav}/>
            <Posts allPosts={posts} />
            {loadingRef.current && <Loader />}
            {open === true ? <div><div onClick={()=> setOpen(false)} className="bg-gray-400/30 w-screen h-screen absolute top-0"></div> <SideNav /></div> : ""}
        </div>
    );
}
 
export default Explore;