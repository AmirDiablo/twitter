import { useLocation } from "react-router";
import Posts from "../components/Posts";
import { IoIosArrowBack } from "react-icons/io";

const OpenedPost = () => {
    const {state} = useLocation()
    const {postInfo} = state

    return ( 
        <div className="text-white">

            <div className="flex items-center gap-3 p-5 absolute left-0 right-0 top-0">
                <div className="text-4xl"><IoIosArrowBack /></div>
                <p className="font-[700] text-2xl">Post details</p>
            </div>

            <Posts allPosts={postInfo} />
            
        </div>
    );
}
 
export default OpenedPost;