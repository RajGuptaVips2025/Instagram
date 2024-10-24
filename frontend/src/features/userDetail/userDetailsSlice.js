import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: {
    fullName: null,
    usrname: null,
    email: null,
    id: null,
    profilePic:null
  },
  selectedPost: null,
  savedPosts: [],
  following: [],
  followers: [],
  socket: null,
  onlineUsers:[],
  followingUsers:[],
  watchHistory:[],
  messages:[],
  rtmNotification:[],
  suggestedUser:null
};

export const userDetailsSlice = createSlice({
  name: 'user', 
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.userDetails = {
        fullName: action.payload.fullName,
        username: action.payload.username,
        email: action.payload.email,
        id: action.payload.id,
        profilePic: action.payload.profilePic,
      };
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setSavedPosts: (state, action) => {
      state.savedPosts = action.payload; 
    },
    setFollowing: (state, action) => {
      state.following = action.payload; 
    },
    setFollower: (state, action) => {
      state.followers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setFollowingUsers: (state, action) => {
      // state.followingUsers = Array.isArray(state.followingUsers)? [...state.followingUsers, ...action.payload]:[ ...action.payload] ;
      state.followingUsers = action.payload ;
    },
    setSuggestedUser: (state, action) => {
      state.suggestedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setWatchHistory: (state, action) => {
      state.watchHistory = action.payload;
    },
    setRtmNotification: (state, action) => {
      if(action.payload.likeType==='like'){
        // state.rtmNotification.push(action.payload);
        state.rtmNotification=Object.values(state.rtmNotification)
        state.rtmNotification = [...state.rtmNotification, action.payload];

      }else if(action.payload.likeType==='dislike'){
        
        state.rtmNotification=Object.values(state.rtmNotification)
        state.rtmNotification=state.rtmNotification.filter((item)=>item.id!==action.payload.id)
        
      }
    },
  },
});

export const { addUser, setSelectedPost, setSavedPosts, setFollower, setFollowing, setSocket,setOnlineUsers,setFollowingUsers,setSuggestedUser, setMessages,setWatchHistory, setRtmNotification } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
