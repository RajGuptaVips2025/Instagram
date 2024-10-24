import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Create VideoCall context
const VideoCallContext = createContext();

// VideoCall Provider Component
export const VideoCallProvider = ({ children, socketRef }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);

    useEffect(() => {
        if (!socketRef.current) return;

        // Listen for incoming video call offer
        socketRef.current.on('videoCallOffer', async ({ from, offer }) => {
            console.log(from, offer)
            await handleVideoCallOffer(from, offer);
        });

        // Listen for incoming video call answer
        socketRef.current.on('videoCallAnswer', async ({ from, answer }) => {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Listen for ICE candidates
        socketRef.current.on('iceCandidate', async ({ from, candidate }) => {
            // await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(candidate)
        if (!peerConnection.current) {
            console.error("Peer connection is not initialized");
            return;
          }
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("ICE candidate added successfully");
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        });

        return () => {
            // Cleanup
            socketRef.current.disconnect();
        };
    }, []);

    const startCall = async (remoteUserId) => {
        peerConnection.current = new RTCPeerConnection();

        // Get local video and audio
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));

        // Display remote video stream
        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('iceCandidate', { to: remoteUserId, candidate: event.candidate });
            }
        };

        // Create SDP offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socketRef.current.emit('videoCallOffer', { to: remoteUserId, offer });
    };

    const handleVideoCallOffer = async (from, offer) => {
        peerConnection.current = new RTCPeerConnection();

        // Get local video and audio
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));

        // Display remote video stream
        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('iceCandidate', { to: from, candidate: event.candidate });
            }
        };

        // Set the remote description with the received offer
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

        // Create SDP answer
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        // Send the answer back to the caller
        socketRef.current.emit('videoCallAnswer', { to: from, answer });
    };

    // Provide the video call functionality and refs to all children components
    return (
        <VideoCallContext.Provider value={{ startCall, localVideoRef, remoteVideoRef }}>
            {children}
        </VideoCallContext.Provider>
    );
};

// Custom hook to use VideoCallContext
export const useVideoCall = () => useContext(VideoCallContext);
