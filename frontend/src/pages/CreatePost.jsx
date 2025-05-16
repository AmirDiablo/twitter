import { IoMdArrowRoundBack } from "react-icons/io";
import { useUser } from "../contexts/userContext";
import { IoEarth } from "react-icons/io5";
import RaisingPermissions from "../components/RaisingPermissions";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { MdOutlinePoll } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import Schedule from "../components/Schedule";

const CreatePost = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const [permission, setPermission] = useState("Everyone")
    const [text, setText] = useState('')
    const [file, setFile] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [scheduledTime, setsCheduledTime] = useState('')
    const [openSchedule, setOpenShedule] = useState(false)

    const changePermission = (value)=> {
        setPermission(value)
        setOpen(false)
    }

    const Data = (month, day, hour, minute, AMPM)=> {
        const year = "2025"
        const y = parseInt(year, 10)
        const m = parseInt(month, 10)
        const d= parseInt(day, 10)
        const h = parseInt(hour, 10)
        const min = parseInt(minute, 10)

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let numericMonth;

        for(let i=0; i<12; i++) {
            if(month == months[i]) {
                numericMonth = i
                console.log("month is: ", i)
            }
        }

        let hr24 = Number(hour)
        if(AMPM === "PM" && hr24 !== 12) {
            hr24 += 12 
        } else if(AMPM === "AM" && hr24 === 12) {
            hr24 = 0
        }

        
        /* const dt = new Date(`${month} ${day} ${year} ${hr24}:${minute}`) */
        const dt = new Date(y, numericMonth, d, hr24, min)

        console.log(y, numericMonth, parseInt(day, 10), hr24, min)
            
        setsCheduledTime(dt)
        setOpenShedule(false)
    }

    const closeSchedule = (isOpen)=> {
        setOpenShedule(isOpen)
    }

    const post = async(e)=> {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("text", text)
        formData.append("permission", permission)
        formData.append("user", user.userInfo[0]._id)
        formData.append("scheduledTime", scheduledTime)
        const response = await fetch("http://localhost:3000/api/post", {
            method: "POST",
            body: formData,
            headers: {
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }
        if(response.ok) {
            setError(null)
            navigate('/')
        }
    }

    return ( 
        <div>
            
            <div className="px-5 flex justify-between py-3">
                <IoMdArrowRoundBack onClick={()=> navigate(-1)} className="text-white text-2xl"/>
                <button onClick={post} disabled={(text === '' && file === null) && true} className={text || file ? "text-white py-1 px-5 bg-blue-500 rounded-full" : "text-white py-1 px-5 bg-blue-300 rounded-full"}>Post</button>
            </div>

            <div className="flex items-start gap-3 px-5 mt-5">
                <img src={"./profiles/"+user.userInfo[0].profile} className="size-10 rounded-full" />
                <textarea onChange={(e)=> setText(e.target.value)} value={text} className="text-white outline-none w-[100%] h-30 resize-none wrap-break-word" placeholder="what's happening?" />
            </div>

            <div onClick={()=> setOpen(true)} className="flex items-center px-5 gap-2 text-blue-500"><IoEarth /> {permission} can reply</div>

            <div className="text-blue-500 flex gap-2 px-5 py-5 text-xl *:hover:bg-blue-200/20 *:hover:cursor-pointer">
                <div className="p-2 rounded-full relative"><input onChange={(e)=> setFile(e.target.files[0])} type="file" name="file" id="file" className="w-5 rounded-full absolute z-1 opacity-0 size-5" /><CiImageOn /></div>
                <div className="p-2 rounded-full"><MdOutlineGifBox /></div>
                <div className="p-2 rounded-full"><MdOutlinePoll /></div>
                <div onClick={()=> setOpenShedule(true)} className="p-2 rounded-full"><RiCalendarScheduleLine /></div>
            </div>

            {openSchedule && <Schedule Data={Data} closeSchedule={closeSchedule} />}
            {open ? <div onClick={()=> setOpen(false)} className="bg-gray-500/30 h-screen w-screen absolute top-0 z-1"></div> : ""}
            {open ? <RaisingPermissions changePermission={changePermission}/> : ""}
        </div>
    );
}
 
export default CreatePost;