import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '@/features/userDetail/userDetailsSlice';


const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/register', { fullName, username, email, password });
            const profilePic = response?.data?.newUser?.profilePicture
            dispatch(addUser({
                fullName: response?.data?.newUser?.fullName,
                username: response?.data?.newUser?.username,
                email: response?.data?.newUser?.email,
                id: response?.data?.newUser?._id,
                profilePic: profilePic
            }));
            // navigate(`/profile/${username}`);
            navigate(`/profile/${response?.data?.newUser?.username}`);

        } catch (err) {
            if (err.response.statusText === "Unauthorized") navigate('/login')
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center flex-col p-3 bg-white">
                <div className="bg-white rounded-sm p-8 w-[350px] flex flex-col border-[.1px] border-gray-200">
                    <div className="flex flex-col justify-center items-center">
                        {/* <h1 className="text-3xl font-bold mb-4 text-center">Instagram</h1> */}
                        <span
                            className="w-[175px] h-[51px] cursor-pointer mb-4"
                            role="img"
                            style={{
                                backgroundImage: 'url(https://static.cdninstagram.com/rsrc.php/v3/yM/r/8n91YnfPq0s.png)',
                                backgroundPosition: '0px -52px',
                                backgroundSize: 'auto',
                                width: '175px',
                                height: '51px',
                                backgroundRepeat: 'no-repeat',
                                display: 'inline-block',
                            }}
                        ></span>

                        <p className="text-gray-600 font-semibold text-center mb-6 w-64">
                            Sign up to see photos and videos from your friends.
                        </p>
                    </div>
                    <button className="bg-[#44a0f5] hover:bg-[#1877f2] flex justify-center gap-2 items-center text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                        <div className="svg">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="white"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                                />
                            </svg>
                        </div>
                        <p>Log in with Facebook</p>
                    </button>
                    <p className="text-center text-gray-600 mt-4">OR</p>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-sm text-[12px] outline-none bg-[#fafafa]"
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-sm text-[12px] mt-2 outline-none bg-[#fafafa]"
                            placeholder="Full Name"
                        />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded-sm text-[12px] mt-2 outline-none bg-[#fafafa]"
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-sm text-[12px] mt-2 outline-none bg-[#fafafa]"
                            placeholder="Password"
                        />
                        <button
                            type="submit"
                            className="bg-[#44a0f5] hover:bg-[#1877f2] text-sm text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full"
                        >
                            Sign up
                        </button>
                    </form>
                    <p className="text-gray-600 text-center text-[13px] mt-4">
                        People who use our service may have uploaded your contact information to Instagram.{' '}
                        <Link to="#" className="text-blue-500">
                            Learn More
                        </Link>
                    </p>
                    <p className="text-center text-[13px] text-gray-600 mt-4">
                        By signing up, you agree to our{' '}
                        <Link to="#" className="text-blue-500">
                            Terms
                        </Link>
                        ,{' '}
                        <Link to="#" className="text-blue-500">
                            Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link to="#" className="text-blue-500">
                            Cookies Policy
                        </Link>
                        .
                    </p>
                </div>
                <div className="bg-white mt-4 rounded-sm p-8 justify-center items-center w-[350px] flex flex-col border-[.1px] border-gray-200">
                    <p className='text-center'>Have an account? <span className='text-blue-600 font-semibold'><Link to='/login'>Log in</Link></span></p>
                </div>
            </div>
        </>
    );
};

export default Register;
