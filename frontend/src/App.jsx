import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { setOnlineUsers } from './features/userDetail/userDetailsSlice';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import BottomNavigation from './components/BottomNavigation';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Explore from './components/Explore/Explore';
import ReelSection from './components/Explore/ReelSection';
import { ProfileEdit } from './components/Profile/profile-edit';
import { ChatComponent } from './components/Chat/instagram-chat';
import Dashboard from './components/Profile/user-dashboard';
import { VideoCallProvider } from './hooks/VideoCallContext';
import VideoCall from './components/Chat/VideoCall';

function App() {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();
  const socketRef = useRef(null); // Use ref to hold socket connection
  
  useEffect(() => {
    // Initialize socket only when userDetails is available
    if (userDetails.id) {
      const socket = io('http://localhost:5000', {
        query: { userId: userDetails.id },
      });
  
      socketRef.current = socket; // Assign socket instance to ref
  
      // Listen for 'getOnlineUsers' event and dispatch online users to Redux
      socket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
  
      // Clean up socket connection when component unmounts
      return () => {
        socket.disconnect();
        dispatch(setOnlineUsers([])); // Reset online users
      };
    }
  }, [userDetails, dispatch]);
  
  return (
    <Router>
      <Navbar />
      {/* <VideoCallProvider socketRef={socketRef}> */}

      <Routes>
        <Route path="/" element={<ProtectedRoute><Home socketRef={socketRef}/></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/profile/:username/:reelId" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/direct/inbox" element={<ProtectedRoute><ChatComponent socketRef={socketRef} /></ProtectedRoute>} />
        <Route path="/explore/" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/reels/" element={<ProtectedRoute><ReelSection /></ProtectedRoute>} />
        <Route path="/call/:remoteUserId/" element={<ProtectedRoute><VideoCall  userId={userDetails?.id} socketRef={socketRef} /></ProtectedRoute>} />
        <Route path="/accounts/edit/:id" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        <Route path="/admindashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {/* </VideoCallProvider> */}

      <BottomNavigation />
    </Router>
  );
}

export default App;