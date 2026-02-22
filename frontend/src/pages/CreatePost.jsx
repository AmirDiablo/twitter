import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from "../contexts/userContext";
import { IoEarth } from "react-icons/io5";
import RaisingPermissions from "../components/RaisingPermissions";
import { useState, useRef, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { MdOutlinePoll } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import Schedule from "../components/Schedule";
import SideNav from "../components/SideNav";

const CreatePost = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const [permission, setPermission] = useState("Everyone")
    const [text, setText] = useState('')
    const [file, setFile] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [scheduledTime, setScheduledTime] = useState('')
    const [openSchedule, setOpenSchedule] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const fileInputRef = useRef(null)
    const textareaRef = useRef(null)

    // تنظیم خودکار ارتفاع textarea
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
    }, [text])

    // پیش‌نمایش فایل انتخاب شده
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setPreviewUrl(null)
        }
    }, [file])

    const changePermission = (value) => {
        setPermission(value)
        setOpen(false)
    }

    const Data = (month, day, hour, minute, AMPM) => {
        try {
            const year = new Date().getFullYear()
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ]

            let numericMonth = months.indexOf(month)
            if (numericMonth === -1) {
                throw new Error('ماه نامعتبر است')
            }

            let hr24 = parseInt(hour, 10)
            if (AMPM === "PM" && hr24 !== 12) {
                hr24 += 12
            } else if (AMPM === "AM" && hr24 === 12) {
                hr24 = 0
            }

            const dt = new Date(year, numericMonth, parseInt(day, 10), hr24, parseInt(minute, 10))

            if (isNaN(dt.getTime())) {
                throw new Error('تاریخ نامعتبر است')
            }

            setScheduledTime(dt)
            setOpenSchedule(false)
        } catch (error) {
            console.error('خطا در تنظیم زمان:', error)
            setError('زمان وارد شده معتبر نیست')
        }
    }

    const closeSchedule = (isOpen) => {
        setOpenSchedule(isOpen)
    }

    const removeFile = () => {
        setFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const post = async (e) => {
        e.preventDefault()

        if (!text.trim() && !file) {
            setError('لطفاً متن یا تصویری وارد کنید')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            if (file) {
                formData.append("file", file)
            }
            formData.append("text", text)
            formData.append("permission", permission)
            formData.append("user", user.userInfo[0]._id)
            if (scheduledTime) {
                formData.append("scheduledTime", scheduledTime.toISOString())
            }

            const response = await fetch("http://localhost:3000/api/post", {
                method: "POST",
                body: formData,
                headers: {
                "authorization": `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (!response.ok) {
                throw new Error(json.error || 'خطا در ارسال پست')
            }

            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
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
    <div className="flex-1 max-w-2xl mx-auto w-full mt-5">
        {/* هدر */}
        <div className="sticky top-0 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 z-10">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <IoMdArrowRoundBack className="text-2xl" />
                </button>

                <h1 className="font-bold text-xl">ایجاد پست جدید</h1>

                <button
                    onClick={post}
                    disabled={(!text.trim() && !file) || isLoading}
                    className={`
                    px-5 py-1.5 rounded-full font-medium transition-all
                    ${(text.trim() || file) && !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-500/50 text-white/50 cursor-not-allowed'
                    }
                    `}
                >
                    {isLoading ? 'در حال ارسال...' : 'ارسال'}
                </button>
            </div>
        </div>

        {/* فرم اصلی */}
        <div className="p-4">
            {/* خطا */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* پروفایل و متن */}
            <div className="flex gap-3">
                <img
                    src={"http://localhost:3000/uploads/profiles/" + user.userInfo[0].profile}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt={user.userInfo[0].username}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40?text=User'
                    }}
                />

                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        className="w-full bg-transparent text-white text-lg outline-none resize-none overflow-hidden"
                        placeholder="چه خبر؟"
                        rows={1}
                    />

                    {/* پیش‌نمایش فایل */}
                    {previewUrl && (
                        <div className="relative mt-3 inline-block">
                            {file?.type?.startsWith('image/') ? (
                                <img
                                    src={previewUrl}
                                    className="max-h-80 rounded-2xl border border-gray-700"
                                    alt="پیش‌نمایش"
                                />
                            ) : (
                                <video
                                    src={previewUrl}
                                    controls
                                    className="max-h-80 rounded-2xl border border-gray-700"
                                />
                            )}
                            <button
                                onClick={removeFile}
                                className="absolute top-2 right-2 bg-gray-900/80 p-1 rounded-full hover:bg-gray-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* تنظیمات دسترسی */}
            <div className="mt-4">
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 text-blue-500 hover:bg-blue-500/10 px-3 py-2 rounded-full transition-colors"
                >
                    <IoEarth className="text-lg" />
                    <span className="text-sm font-medium">{permission} می‌توانند پاسخ دهند</span>
                </button>
            </div>

            {/* آیکون‌های ابزار */}
            <div className="mt-4 flex items-center gap-1 text-blue-500">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-blue-500/20 rounded-full transition-colors relative"
                    title="افزودن تصویر"
                >
                    <input
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                    />
                    <CiImageOn className="text-2xl" />
                </button>

                <button className="p-2 hover:bg-blue-500/20 rounded-full transition-colors" title="GIF">
                    <MdOutlineGifBox className="text-2xl" />
                </button>

                <button className="p-2 hover:bg-blue-500/20 rounded-full transition-colors" title="نظرسنجی">
                    <MdOutlinePoll className="text-2xl" />
                </button>

                <button
                    onClick={() => setOpenSchedule(true)}
                    className="p-2 hover:bg-blue-500/20 rounded-full transition-colors relative"
                    title="زمان‌بندی"
                >
                    <RiCalendarScheduleLine className="text-2xl" />
                    {scheduledTime && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                    )}
                </button>
            </div>

            {/* نمایش زمان زمان‌بندی شده */}
            {scheduledTime && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-gray-300">
                         زمان‌بندی شده برای: {new Date(scheduledTime).toLocaleDateString('fa-IR')} - {new Date(scheduledTime).toLocaleTimeString('fa-IR')}
                    </p>
                    <button
                        onClick={() => setScheduledTime('')}
                        className="text-red-500 hover:text-red-400 text-sm"
                    >
                         لغو
                    </button>
                </div>
            )}
        </div>
    </div>

    {/* مودال‌ها */}
    {open && (
        <>
            <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <RaisingPermissions changePermission={changePermission} />
            </div>
        </>
    )}

    {openSchedule && (
        <Schedule Data={Data} closeSchedule={closeSchedule} />
    )}
</div>
)
}
export default CreatePost