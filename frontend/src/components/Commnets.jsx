import { useEffect, useState, useRef } from "react";
import { useComment } from "../contexts/commnetContext";
import { IoSend } from "react-icons/io5";
import { useUser } from "../contexts/userContext";
import { MdOutlineReply } from "react-icons/md";

const Comments = ({ PostId, isOpen, authorId, onClose }) => {
const { fetchComments, addComment, comments } = useComment()
const { user } = useUser()
const [text, setText] = useState('')
const [replyTo, setReplyTo] = useState(null)
const [replies, setReplies] = useState([])
const [commentOwner, setCommentOwner] = useState()
const [main, setMain] = useState(null)
const [selectedCommentId, setSelectedCommentId] = useState(null)
const commentsEndRef = useRef(null)
const commentsContainerRef = useRef(null)
const prevCommentsLengthRef = useRef(0)
const isUserScrollingRef = useRef(false)
const scrollTimeoutRef = useRef(null)

useEffect(() => {
if (PostId) {
fetchComments(PostId)
}
}, [PostId, fetchComments])

// تشخیص اسکرول دستی کاربر
const handleScroll = () => {
isUserScrollingRef.current = true
  
// ریست کردن وضعیت بعد از 150 میلی‌ثانیه از آخرین اسکرول
if (scrollTimeoutRef.current) {
clearTimeout(scrollTimeoutRef.current)
}

scrollTimeoutRef.current = setTimeout(() => {
isUserScrollingRef.current = false
}, 150)
}

// اضافه کردن event listener برای اسکرول
useEffect(() => {
const container = commentsContainerRef.current
if (container) {
container.addEventListener('scroll', handleScroll)
}

return () => {
if (container) {
container.removeEventListener('scroll', handleScroll)
}
if (scrollTimeoutRef.current) {
clearTimeout(scrollTimeoutRef.current)
}
}
}, [])

// اسکرول به پایین فقط وقتی کامنت جدید اضافه میشه
useEffect(() => {
// اگه کاربر داره دستی اسکرول میکنه، اسکرول خودکار انجام نده
if (isUserScrollingRef.current) return

// اگه تعداد کامنت‌ها بیشتر شده (یعنی کامنت جدید اضافه شده)
if (comments.length > prevCommentsLengthRef.current) {
// یه تاخیر کوچیک بدید تا کامنت جدید رندر بشه
setTimeout(() => {
if (commentsEndRef.current && !isUserScrollingRef.current) {
commentsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
}
}, 100)
}

// آپدیت کردن تعداد قبلی
prevCommentsLengthRef.current = comments.length
}, [comments])

// اسکرول به پایین فقط اولین بار که کامنت‌ها باز میشن
useEffect(() => {
if (isOpen && comments.length > 0 && !isUserScrollingRef.current) {
// تاخیر برای اطمینان از رندر شدن کامل
setTimeout(() => {
if (commentsEndRef.current) {
commentsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
}
}, 200)
}
}, [isOpen])

const postComment = (userId) => {
if (!text.trim()) return
addComment(userId, text, PostId, replyTo, main, authorId, commentOwner)
setReplyTo(null)
setText("")
setMain(null)
setCommentOwner(null)
}

const fetchReplies = async (commentId) => {
if (selectedCommentId === commentId) {
setSelectedCommentId(null)
setReplies([])
return
}

const response = await fetch("http://localhost:3000/api/comment/replies/" + commentId)
const json = await response.json()

if (response.ok) {
setReplies(json)
setSelectedCommentId(commentId)
}
}

const cancelReply = () => {
setReplyTo(null)
setMain(null)
setCommentOwner(null)
}

return (
<div className={`
fixed inset-0 z-50 flex items-end justify-center
transition-opacity duration-300
${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
`}>
{/* لایه تیره پشت کامنت‌ها */}
<div
className="absolute inset-0 bg-black/70"
onClick={onClose}
/>

{/* باکس کامنت‌ها */}
<div className={`
relative bg-gray-900 w-full max-w-2xl h-[80vh] sm:h-[70vh] 
rounded-t-3xl sm:rounded-2xl shadow-2xl
transform transition-transform duration-300
${isOpen ? 'translate-y-0' : 'translate-y-full'}
sm:mb-0 sm:mx-4
`}>
{/* هدر */}
<div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 rounded-t-3xl sm:rounded-t-2xl">
<h3 className="text-center font-bold text-lg">نظرات</h3>
</div>

{/* لیست کامنت‌ها */}
<div
ref={commentsContainerRef}
className="overflow-y-auto h-[calc(80vh-120px)] sm:h-[calc(70vh-120px)] p-4"
>
{comments.length === 0 ? (
<p className="text-center text-gray-500 mt-10">هنوز نظری ثبت نشده</p>
) : (
comments.map((item) => (
<div key={item._id} className="relative flex gap-3 items-start mb-6 group">
<img
src={"http://localhost:3000/uploads/profiles/" + item.userId.profile}
className="w-10 h-10 rounded-full object-cover flex-shrink-0"
alt={item.userId.username}
onError={(e) => {
e.target.src = 'https://via.placeholder.com/40?text=User'
}}
/>

<div className="flex-1 min-w-0">
<div className="bg-gray-800 rounded-2xl p-3">
<p className="font-[700] text-sm mb-1">{item.userId.username}</p>
<p className="text-sm break-words">{item.text}</p>
</div>

{/* دکمه ریپلای */}
<button
onClick={() => {
setReplyTo(item._id)
setMain(item._id)
setCommentOwner(item.userId._id)
}}
className="text-xs text-gray-500 mt-1 mr-2 hover:text-blue-500 transition-colors"
>
پاسخ
</button>

{/* نمایش ریپلای‌ها */}
{item.repliesList?.length > 0 && (
<div className="mt-3 mr-6">
<button
onClick={() => fetchReplies(item._id)}
className="text-xs text-blue-500 hover:text-blue-400 transition-colors mb-2"
>
{selectedCommentId === item._id ? '▼' : '▶'} {item.repliesList.length} پاسخ
</button>

{selectedCommentId === item._id && replies.length > 0 && (
<div className="space-y-3">
{replies.map((rep) => (
<div key={rep._id} className="flex gap-2 items-start group/reply">
<img
src={"http://localhost:3000/uploads/profiles/" + rep.userId.profile}
className="w-6 h-6 rounded-full object-cover flex-shrink-0"
alt={rep.userId.username}
/>
<div className="flex-1 min-w-0">
<div className="bg-gray-800/80 rounded-xl p-2">
<p className="font-[700] text-xs mb-0.5">
{rep.userId.username}
{rep.replyTo?._id !== rep.mainComment && (
<span className="text-blue-500 text-xs mr-1">
پاسخی به {rep.replyTo?.userId?.username}
</span>
)}
</p>
<p className="text-xs break-words">{rep.text}</p>
</div>
<button
onClick={() => {
setReplyTo(rep._id)
setMain(item._id)
setCommentOwner(rep.userId._id)
}}
className="text-[10px] text-gray-500 mt-1 mr-2 hover:text-blue-500 transition-colors"
>
پاسخ
</button>
</div>
</div>
))}
</div>
)}
</div>
)}
</div>

<MdOutlineReply
onClick={() => {
setReplyTo(item._id)
setMain(item._id)
setCommentOwner(item.userId._id)
}}
className="absolute left-2 top-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-blue-500"
/>
</div>
))
)}
<div ref={commentsEndRef} />
</div>

{/* باکس ارسال کامنت */}
<div className="absolute bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-800 rounded-b-3xl sm:rounded-b-2xl">
{/* نمایش ریپلای */}
{replyTo !== null && (
<div className="flex items-center justify-between mb-2 px-2">
<p className="text-xs text-blue-500">
در حال پاسخ به این نظر...
</p>
<button
onClick={cancelReply}
className="text-xs text-gray-500 hover:text-gray-400"
>
لغو
</button>
</div>
)}

{/* فرم ارسال */}
<div className="flex items-center gap-2">
<input
onChange={(e) => setText(e.target.value)}
value={text}
type="text"
placeholder="نظر خود را بنویسید..."
className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
onKeyPress={(e) => {
if (e.key === 'Enter') {
postComment(user?._id)
}
}}
/>
<button
onClick={() => postComment(user?._id)}
disabled={!text.trim()}
className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
<IoSend className="text-xl" />
</button>
</div>
</div>
</div>
</div>
);
}

export default Comments;