import { IoReorderThree } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";


const ExploreTop = ({openNav}) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const debounceTimeout = useRef(null)
    const navigate = useNavigate()

    useEffect(()=> {
        if(!query) {
            setResults([])
            return
        }

        //debounce api calls by 300ms
        if(debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(()=> {
            setLoading(true)
            fetch(`http://localhost:3000/api/account/liveSearch?q=${encodeURIComponent(query)}`)
            .then((res)=> res.json())
            .then((data)=> {
                setResults(data)
                setLoading(false)
            })
            .catch(()=> {
                setResults([])
                setLoading(false)
            })
        }, 300)

        return ()=> clearTimeout(debounceTimeout.current)
    }, [query])

    const open = ()=> {
        openNav(true)
    }

    const search = (e)=> {
        e.preventDefault()
        navigate(`/search?${query}`)
    }

    return ( 
        <div className="fixed top-0 left-0 right-0 topNav bg-black/30 backdrop-blur-2xl">
            <div className="flex gap-5 px-5 py-5 text-white">
                <IoReorderThree onClick={open} className="text-3xl"/>
                <form onSubmit={search} className="relative w-[66%] ml-10">
                    <div className="bg-gray-300 text-xl text-black h-max w-max p-[6px] rounded-full absolute top-0"><FiSearch onClick={search} /></div>
                    <input onChange={(e)=> setQuery(e.target.value)} type="search" className="bg-white text-black w-[100%] rounded-full ml-auto mr-auto p-1 pl-10" />
                    <div className="bg-white  rounded-2xl mt-1 absolute left-0 right-0">
                        {results.map((item)=> (
                            <div onClick={()=> navigate("/profile", {state: {userInfo: [item]}})} className="flex gap-3 p-2">
                                <img src={"./profiles/"+item.profile} className="size-8 rounded-full"  />
                                <p className="text-black font-[700]">{item.username}</p>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default ExploreTop;