import { useEffect, useState } from "react";
import ExploreTop from "../components/ExploreTop";
import SideNav from "../components/SideNav";
import Accounts from "../components/Accounts";
import { useLocation } from "react-router";
import Posts from "../components/Posts";

const Search = () => {
    const [open, setOpen] = useState(false)
    const [partition, setPartition] = useState("people")
    const [error, setError] = useState(null)
    const [infos, setInfos] = useState([])

    const query = useLocation().search.split("?")[1]

    const openNav = (status)=> {
        setOpen(status)
    } 

    const changePartition = (value)=> {
        setInfos([])
        setPartition(value)
    }

    const fetchInfos = async()=> {
        const response = await fetch(`http://localhost:3000/api/account/${partition}?q=${query}`)
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }
        
        if(response.ok) {
            setInfos(json)
        }
    }

    const fetchPostsInfos = async()=> {
        const response = await fetch(`http://localhost:3000/api/post/${partition}?q=${query}`)
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }
        
        if(response.ok) {
            setInfos(json)
        }
    }

    useEffect(()=> {
        if(partition === "people") {
            fetchInfos()
        }
        if(partition === "posts") {
            fetchPostsInfos()
        }
    }, [partition, query])

    return ( 
        <div className="text-white">
            <ExploreTop openNav={openNav} />
            {open === true ? <div><div onClick={()=> setOpen(false)} className="bg-gray-400/30 w-screen h-screen absolute top-0 z-11"></div> <SideNav /></div> : ""}

            <div className="flex justify-around *:pb-3 bg-black/80 -z-1 fixed top-17 right-0 left-0 border-b-1 border-gray-100/20">
                <button onClick={()=> changePartition("people")} className={partition === "people" ? "text-white border-b-3 border-blue-500" : "text-white"}>people</button>
                <button onClick={()=> changePartition("posts")} className={partition === "posts" ? "text-white border-b-3 border-blue-500" : "text-white"}>posts</button>
            </div>

            <div className="mt-27">
                {partition === "people" && <Accounts info={infos} />}
                {partition === "posts" && <Posts allPosts={infos} />}
            </div>

            {error && <div className="text-white mt-30">{error}</div>}

        </div>
    );
}
 
export default Search;