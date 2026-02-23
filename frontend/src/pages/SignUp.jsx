import { useState, useRef, useEffect } from "react";
import { useSignUp } from "../hooks/useSignUp";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { sign, isLoading, error } = useSignUp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Refs برای بررسی پر بودن فیلدها
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sign(username, email, password);
  };

  // تابع بررسی پر بودن فیلد
  const isFieldFilled = (value) => {
    return value.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <FaXTwitter className="text-white mx-auto mb-6 text-4xl md:text-5xl" />
        
        <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Create your account
          </h2>
          
          <div className="space-y-6">
            {/* فیلد username */}
            <div className="input-group relative">
              <input
                ref={usernameRef}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className={`
                  w-full px-4 py-3 text-white bg-transparent 
                  border-2 rounded-lg outline-none transition-all duration-200
                  peer placeholder:text-transparent
                  ${isFieldFilled(username) ? 'border-blue-500' : 'border-gray-600'}
                  focus:border-blue-500
                `}
                placeholder="username"
                id="username"
                type="text"
              />
              <label
                htmlFor="username"
                className={`
                  absolute left-4 px-1 bg-black transition-all duration-200
                  ${isFieldFilled(username) || usernameRef.current === document.activeElement
                    ? '-top-3 text-sm text-blue-500'
                    : 'top-3 text-gray-400'
                  }
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500
                  cursor-text select-none
                `}
              >
                Username
              </label>
            </div>

            {/* فیلد email */}
            <div className="input-group relative">
              <input
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={`
                  w-full px-4 py-3 text-white bg-transparent 
                  border-2 rounded-lg outline-none transition-all duration-200
                  peer placeholder:text-transparent
                  ${isFieldFilled(email) ? 'border-blue-500' : 'border-gray-600'}
                  focus:border-blue-500
                `}
                placeholder="email"
                id="email"
                type="email"
              />
              <label
                htmlFor="email"
                className={`
                  absolute left-4 px-1 bg-black transition-all duration-200
                  ${isFieldFilled(email) || emailRef.current === document.activeElement
                    ? '-top-3 text-sm text-blue-500'
                    : 'top-3 text-gray-400'
                  }
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500
                  cursor-text select-none
                `}
              >
                Email
              </label>
            </div>

            {/* فیلد password */}
            <div className="input-group relative">
              <input ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={`
                  w-full px-4 py-3 text-white bg-transparent 
                  border-2 rounded-lg outline-none transition-all duration-200
                  peer placeholder:text-transparent
                  ${isFieldFilled(password) ? 'border-blue-500' : 'border-gray-600'}
                  focus:border-blue-500
                `}
                placeholder="password"
                id="password"
                type="password"
              />
              <label
                htmlFor="password"
                className={`
                  absolute left-4 px-1 bg-black transition-all duration-200
                  ${isFieldFilled(password) || passwordRef.current === document.activeElement
                    ? '-top-3 text-sm text-blue-500'
                    : 'top-3 text-gray-400'
                  }
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500
                  cursor-text select-none
                `}
              >
                Password
              </label>
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full mt-8 bg-white text-black font-bold py-3 px-4 rounded-full
                     hover:bg-gray-200 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-6">
            <Link to='/login' className="text-blue-500 hover:underline text-sm md:text-base">
              Already have an account? Log in
            </Link>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;