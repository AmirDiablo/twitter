import Top from "../components/Top";
import SideNav from "../components/SideNav";
import { useEffect, useState } from "react";
import Posts from "../components/Posts";
import { useUser } from "../contexts/userContext";

const Home = () => {
    const [open, setOpen] = useState(false)
    const [posts, setPosts] = useState([])
    const { user, followings } = useUser()

    const openNav = (status)=> {
        setOpen(status)
    }

    const fetchPosts = async()=> {
        const response = await fetch("http://localhost:3000/api/post/homePosts", {
            method: "POST",
            body: JSON.stringify({followings}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
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
            <Top openNav={openNav} />
            <Posts allPosts={posts} />
            {open === true ? <div><div onClick={()=> setOpen(false)} className="bg-gray-400/30 w-screen h-screen absolute top-0"></div> <SideNav /></div> : ""}
        </div>
    );
}
 
export default Home;