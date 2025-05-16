import { useState } from "react";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { IoEarth } from "react-icons/io5";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { VscMention } from "react-icons/vsc";


const RaisingPermissions = ({changePermission}) => {

    const change = (value)=> {
        changePermission(value)
    }

    return ( 
        <div className="bg-black rounded-t-4xl pb-20 absolute bottom-0 z-10">

            <div className="px-3 pt-3 pb-5 leading-5" >
                <p className="font-[600] text-white">Who can reply?</p>
                <p className="text-gray-500">Choose who can reply to this post. Anyone mentioned can always reply.</p>
            </div>

            <div className="flex flex-col gap-5 px-3">

                <div className="flex items-center gap-3" onClick={()=> change("Everyone")}>
                    <div className="bg-blue-500 text-white text-xl p-2 rounded-full w-max">
                        <IoEarth />
                    </div> 
                    <p className="text-white">Everyone</p>
                </div>

                <div className="flex items-center gap-3" onClick={()=> change("Accounts you follow")}>
                    <div className="bg-blue-500 text-white text-xl p-2 rounded-full w-max">
                        <BsFillPersonCheckFill />
                    </div> 
                    <p className="text-white">Accounts you follow</p>
                </div>

                <div className="flex items-center gap-3" onClick={()=> change("Verified accounts")}>
                    <div className="bg-blue-500 text-white text-xl p-2 rounded-full w-max">
                        <RiVerifiedBadgeLine />
                    </div> 
                    <p className="text-white">Verified accounts</p>
                </div>

                <div className="flex items-center gap-3" onClick={()=> change("Only accounts you mention")}>
                    <div className="bg-blue-500 text-white text-xl p-2 rounded-full w-max">
                        <VscMention />
                    </div> 
                    <p className="text-white">Only accounts you mention</p>
                </div>
                
            </div>

        </div>
     );
}
 
export default RaisingPermissions;