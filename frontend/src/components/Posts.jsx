import { format } from 'date-fns'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { useNavigate } from 'react-router';
import { useUser } from "../contexts/userContext";
import { useState, useEffect } from 'react';
import Comments from './Commnets';

const Posts = ({ allPosts }) => {
const { user } = useUser()
const [isOpen, setIsOpen] = useState(false)
const [postId, setPostId] = useState()
const [authorId, setAuthorId] = useState()
const [posts, setPosts] = useState([])
const navigate = useNavigate()

// آپدیت کردن posts وقتی allPosts تغییر میکنه
useEffect(() => {
setPosts(allPosts)
}, [allPosts])

const like = async (postId, postOwner) => {
// آپدیت اول UI
setPosts(prevPosts =>
prevPosts.map(post => {
if (post._id === postId) {
const isLiked = post.likes.includes(user._id)
return {
...post,
likes: isLiked
? post.likes.filter(id => id !== user._id)
: [...post.likes, user._id]
}
}
return post
})
)

// بعد درخواست به سرور
const response = await fetch("http://localhost:3000/api/post/like", {
method: "PUT",
body: JSON.stringify({ postId, userId: user._id, postOwner, eventType: "like" }),
headers: {
"Content-Type": "application/json"
}
})

// اگه خطایی رخ داد، برگردون به حالت قبل
if (!response.ok) {
const json = await response.json()
console.log(json.error)
setPosts(allPosts)
}
}

const bookmark = async (postId) => {
// آپدیت اول UI
setPosts(prevPosts =>
prevPosts.map(post => {
if (post._id === postId) {
const isBookmarked = post.bookmarks.includes(user._id)
return {
...post,
bookmarks: isBookmarked
? post.bookmarks.filter(id => id !== user._id)
: [...post.bookmarks, user._id]
}
}
return post
})
)

// بعد درخواست به سرور
const response = await fetch("http://localhost:3000/api/post/bookmark", {
method: "PUT",
body: JSON.stringify({ postId, userId: user._id }),
headers: {
"Content-Type": "application/json"
}
})

// اگه خطایی رخ داد، برگردون به حالت قبل
if (!response.ok) {
const json = await response.json()
console.log(json.error)
setPosts(allPosts)
}
}

const openComments = (postId, author) => {
setPostId(postId)
setAuthorId(author)
setIsOpen(true)
}

// محاسبه زمان نسبی
const getRelativeTime = (date) => {
const now = new Date()
const postDate = new Date(date)
const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

if (diffInHours < 1) {
const diffInMinutes = Math.floor((now - postDate) / (1000 * 60))
return `${diffInMinutes} دقیقه پیش`
} else if (diffInHours < 24) {
return `${diffInHours} ساعت پیش`
} else {
const diffInDays = Math.floor(diffInHours / 24)
return `${diffInDays} روز پیش`
}
}

return (
<div className='text-white mt-5 mb-40 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-4xl mx-auto'>
{posts.map((item) => (
<div key={item._id} className='mb-6'>
{item.length !== 0 &&
<div className='py-4 border-b border-gray-800 last:border-b-0'>
{/* هدر پست */}
<div
onClick={() => navigate(`/profile/?userId=${item.author._id}`)}
className='flex items-center gap-3 px-4 sm:px-5 cursor-pointer hover:bg-gray-900/50 py-2 rounded-lg transition-colors'
>
<img
className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover'
src={"http://localhost:3000/uploads/profiles/" + item.author.profile}
alt={item.author.username}
onError={(e) => {
e.target.src = 'https://via.placeholder.com/48?text=User'
}}
/>
<div className='flex-1'>
<p className='font-[600] text-sm sm:text-base'>{item.author.username}</p>
<p className='text-gray-500 text-xs sm:text-sm'>{getRelativeTime(item.createdAt)}</p>
</div>
</div>

{/* محتوای پست */}
<div className='px-4 sm:px-5 mt-3'>
{item.content.text && (
<div className='my-2 text-sm sm:text-base leading-relaxed'>
{item.content.text}
</div>
)}

{/* مدیا (تصویر یا ویدیو) */}
{item.type !== "text"&& (
<div className='mt-3 rounded-xl overflow-hidden'>
{item.type.match(/image/) ? (
<img
className='w-full h-auto max-h-96 object-contain bg-gray-900'
src={"http://localhost:3000/uploads/posts/" + item.content.file}
alt="پست"
/>
) : (
<video
controls
autoPlay={false}
className='w-full h-auto max-h-96 object-contain bg-gray-900'
src={"http://localhost:3000/uploads/posts/" + item.content.file}
/>
)}
</div>
)}
</div>

{/* دکمه‌های تعامل */}
<div className='flex justify-around mt-4 px-4 sm:px-5 py-2 border-t border-gray-800'>
<button
onClick={() => openComments(item._id, item.author._id)}
className='flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors'
>
<FaRegComment className='text-lg sm:text-xl' />
<span className='text-xs sm:text-sm hidden sm:inline'>نظر</span>
</button>

<button className='flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors'>
<BiRepost className='text-xl sm:text-2xl' />
<span className='text-xs sm:text-sm hidden sm:inline'>بازنشر</span>
</button>

<button
onClick={() => like(item._id, item.author._id)}
className='flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors'
>
{item.likes.includes(user._id) ? (
<FaHeart className='text-red-500 text-lg sm:text-xl' />
) : (
<FaRegHeart className='text-lg sm:text-xl' />
)}
<span className='text-xs sm:text-sm hidden sm:inline'>
{item.likes.length}
</span>
</button>

<button
onClick={() => bookmark(item._id)}
className='flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors'
>
{item.bookmarks.includes(user._id) ? (
<IoBookmark className='text-lg sm:text-xl' />
) : (
<FaRegBookmark className='text-lg sm:text-xl' />
)}
<span className='text-xs sm:text-sm hidden sm:inline'>ذخیره</span>
</button>
</div>
</div>
}
</div>
))}

{/* کامپوننت کامنت */}
{isOpen && (
<>
<div
onClick={() => setIsOpen(false)}
className='fixed inset-0 bg-black/70 z-40 transition-opacity'
/>
<Comments
PostId={postId}
isOpen={isOpen}
authorId={authorId}
onClose={() => setIsOpen(false)}
/>
</>
)}
</div>
);
}

export default Posts;