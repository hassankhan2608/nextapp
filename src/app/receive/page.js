"use client";  // Required to use client-side hooks

import { useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';

export default function ReceivePage() {
  const [peer, setPeer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Waiting for connection...');

  // Extract the offer from the URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedOffer = urlParams.get('offer');

    if (encodedOffer) {
      const offer = JSON.parse(atob(encodedOffer));  // Decode the base64 offer

      // Initialize the peer connection
      const p = new SimplePeer({ initiator: false, trickle: false });

      p.on('signal', (data) => {
        // Send this answer back to the initiator manually or via a signaling server
        const answer = JSON.stringify(data);
        console.log('Generated answer:', answer);
        setConnectionStatus('Connection established. Ready to receive data.');
      });

      p.on('connect', () => {
        console.log('Peer connected!');
      });

      p.on('data', (data) => {
        console.log('Received data:', data);  // This is where the received file data will show
      });

      p.on('error', (err) => {
        console.error('Error with peer connection:', err);
      });

      p.signal(offer);  // Use the extracted offer to signal the peer
      setPeer(p);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Receive P2P File</h1>
      <p className="mt-4">{connectionStatus}</p>
    </div>
  );
}
