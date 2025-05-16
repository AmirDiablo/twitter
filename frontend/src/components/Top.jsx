import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { IoReorderThree } from "react-icons/io5";

const Top = ({openNav}) => {

    const open = ()=> {
        openNav(true)
    }

    return ( 
        <div className="flex px-5 py-5 justify-between fixed top-0 left-0 right-0 bg-black/60 text-white topNav">
            <IoReorderThree onClick={open} className="text-3xl"/>
            <FaXTwitter className="text-3xl" />
        </div>
    );
}
 
export default Top;