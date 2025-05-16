import { GoHomeFill } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import { useRef, useState } from "react";

const BottomNav = () => {
    const navigate = useNavigate()
    const path = useRef()

    path.current = useLocation().pathname

    console.log(path)

    return (  
        <div className="flex justify-between px-10 py-3 bg-black text-white fixed bottom-0 left-0 right-0">
            {path.current === '/' ? <GoHomeFill className="text-3xl" />  : <GoHome onClick={()=> navigate('/')} className="text-3xl" />}
            <FiSearch onClick={()=> navigate("/explore")} className="text-3xl" />
            {path.current === '/notification' ? <IoNotificationsSharp className="text-3xl" /> : <IoNotificationsOutline onClick={()=> navigate('/notification')} className="text-3xl" />}
        </div>
    );
}
 
export default BottomNav;