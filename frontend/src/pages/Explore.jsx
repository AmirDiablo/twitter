import { useEffect, useState } from "react";
import ExploreTop from "../components/ExploreTop";
import SideNav from "../components/SideNav";
import Posts from "../components/Posts";

const Explore = () => {
    const [open, setOpen] = useState(false)
    const [posts, setPosts] = useState([])

    const openNav = (status)=> {
        setOpen(status)
    } 

    const fetchPosts = async()=> {
        const response = await fetch("http://localhost:3000/api/post/all")
        const json = await response.json()

        if(response.ok) {
            setPosts(json)
        }
    }

    useEffect(()=> {
        fetchPosts()
    }, [])

    return ( 
        <div className="text-white">
            <ExploreTop openNav={openNav}/>
            <Posts allPosts={posts} />
            {open === true ? <div><div onClick={()=> setOpen(false)} className="bg-gray-400/30 w-screen h-screen absolute top-0"></div> <SideNav /></div> : ""}
        </div>
    );
}
 
export default Explore;