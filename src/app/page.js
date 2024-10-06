"use client";  // Required to use client-side hooks like useState

import { useState } from 'react';
import SimplePeer from 'simple-peer';

export default function HomePage() {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [dataChannelReady, setDataChannelReady] = useState(false); // New state for tracking the ready state
  const [shareableLink, setShareableLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file

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

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Send the selected file over WebRTC DataChannel
  const sendFile = () => {
    if (dataChannelReady && selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        peer.send(fileData); // Send file data over the peer connection
        console.log('File sent:', selectedFile.name);
      };
      reader.readAsArrayBuffer(selectedFile); // Read the file as ArrayBuffer
    } else {
      console.error("DataChannel is not open yet or no file selected!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">P2P File Sharing</h1>

      {/* File Picker */}
      <input type="file" onChange={handleFileSelect} className="mt-4" />
      
      <button onClick={initPeerConnection} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Generate Share Link
      </button>

      {shareableLink && (
        <div className="mt-4">
          <p>Share this link with the receiver:</p>
          <a href={shareableLink} target="_blank" className="text-blue-600 underline">
            {shareableLink}
          </a>
        </div>
      )}

      <button onClick={sendFile} disabled={!dataChannelReady || !selectedFile} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Send File
      </button>
    </div>
  );
}
