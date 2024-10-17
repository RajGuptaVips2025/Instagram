import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '@/features/userDetail/userDetailsSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await axios.post('/api/auth/login', { email, password });
      const profilePic = response?.data?.user?.profilePicture
      dispatch(addUser({
        fullName: response?.data?.user?.fullName,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        id: response?.data?.user?._id,
        profilePic: profilePic
      }));
      navigate(`/profile/${response?.data?.user?.username}`);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col p-3 min-h-screen bg-gray-100">
      <div className="bg-white rounded-sm p-8 w-[350px] flex flex-col border border-gray-200 shadow-md">
        <div className="flex justify-center mb-4">
          <span
            className="w-[175px] h-[51px] cursor-pointer"
            role="img"
            aria-label="Instagram logo"
            style={{
              backgroundImage: 'url(https://static.cdninstagram.com/rsrc.php/v3/yM/r/8n91YnfPq0s.png)',
              backgroundPosition: '0px -52px',
              backgroundSize: 'auto',
              backgroundRepeat: 'no-repeat',
              display: 'inline-block',
            }}
          ></span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-sm text-sm outline-none bg-gray-50"
            placeholder="Email"
            aria-label="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-sm text-sm mt-2 outline-none bg-gray-50"
            placeholder="Password"
            aria-label="Password"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">OR</p>
        <button
          className="flex justify-center gap-1 text-sm font-semibold items-center text-blue-600 py-2 px-4 border border-blue-600 rounded"
          aria-label="Log in with Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" className="mr-1">
            <rect width="80" height="80" rx="8" fill="#1877F2" />
            <path fill="#FFF" d="M29 15h-4c-2.2 0-4 1.8-4 4v3h-3v4h3v12h5V26h4l1-4h-5v-3c0-.6.4-1 1-1h4v-4z" />
          </svg>
          <span>Log in with Facebook</span>
        </button>
      </div>
      <div className="bg-white mt-4 rounded-sm p-8 w-[350px] flex justify-center items-center border border-gray-200 shadow-md">
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
