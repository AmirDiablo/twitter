import { RiQuillPenAiLine } from "react-icons/ri";
import { Link } from "react-router";

const Create = () => {
    
    return ( 
        <Link to="/createPost">
            <div className="bg-blue-400 text-white p-5 rounded-full w-max fixed bottom-20 right-5">
                <RiQuillPenAiLine className="text-2xl" />
            </div>
        </Link>
    );
}
 
export default Create;