"use client";  // Required to use client-side hooks like useState

import { useState } from 'react';
import SimplePeer from 'simple-peer';

export default function HomePage() {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [dataChannelReady, setDataChannelReady] = useState(false); // New state for tracking the ready state
  const [shareableLink, setShareableLink] = useState('');

  // Initialize WebRTC Peer connection
  const initPeerConnection = () => {
    const p = new SimplePeer({ initiator: true, trickle: false });
    setPeer(p);

    p.on('signal', (data) => {
      const sdpOffer = JSON.stringify(data);
      const encodedOffer = btoa(sdpOffer);  // Base64 encode the offer

      // Generate a shareable link
      const link = `${window.location.origin}/receive?offer=${encodedOffer}`;
      setPeerId(sdpOffer);
      setShareableLink(link);
    });

    p.on('connect', () => {
      console.log('Peer connected!');
      setDataChannelReady(true);  // Mark the DataChannel as ready once connected
    });

    p.on('data', (data) => {
      console.log('Received data:', data);
    });

    p.on('error', (err) => {
      console.error('Error with peer connection:', err);
    });
  };

  const sendFile = () => {
    if (dataChannelReady) {
      peer.send("Hello, this is a test message!");
    } else {
      console.error("DataChannel is not open yet!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">P2P File Sharing</h1>
      <button onClick={initPeerConnection}>Generate Share Link</button>
      {shareableLink && (
        <div>
          <p>Share this link with the receiver:</p>
          <a href={shareableLink} target="_blank" className="text-blue-600 underline">
            {shareableLink}
          </a>
        </div>
      )}
      <button onClick={sendFile} disabled={!dataChannelReady}>Send File</button>
    </div>
  );
}
