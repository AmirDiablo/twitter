import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";


const Login = () => {
    const { loginAccount, isLoading, error } = useLogin()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async(e)=> {
        e.preventDefault()
        await loginAccount(email, password)
    }

    return ( 
        <div>
            <FaXTwitter className="text-white mx-auto mt-10 text-3xl"/>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-5 p-10">
                <h2 className="text-2xl font-[600] text-white">Login to your account</h2>
                <div className="input-group relative w-[80%]">
                    <input onChange={(e)=> setEmail(e.target.value)} value={email} className="text-white border-1 w-[100%] border-blue-400 rounded-md p-1 peer placeholder:text-transparent outline-none" placeholder="email" id="email" type="text"/>
                    <label className="text-white absolute left-[5px] top-[5px] bg-black transition-all duration-75 ease-in peer-focus:-translate-y-[20px] select-none" htmlFor="email">email</label>
                </div>
                <div className="input-group relative w-[80%]">
                    <input onChange={(e)=> setPassword(e.target.value)} value={password} className="text-white border-1 w-[100%] border-blue-400 rounded-md p-1 peer placeholder:text-transparent outline-none" placeholder="password" id="password" type="text"/>
                    <label className="text-white absolute left-[5px] top-[5px] bg-black transition-all duration-75 ease-in peer-focus:-translate-y-[20px] select-none" htmlFor="password">password</label>
                </div>
                <button disabled={isLoading} className="bg-white font-[600] p-2 w-[80%] rounded-full">Login</button>
                <Link className="text-blue-500" to='/signup'>dont have an account?</Link>
            </form>

            {error && <div className="text-white bg-red-500 p-5 w-[80%] rounded-2xl mx-auto text-center">{error}</div>}
        </div>
    );
}
 
export default Login;