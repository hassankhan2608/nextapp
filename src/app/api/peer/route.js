export default function handler(req, res) {
  const { peerId } = req.body;

  // For simplicity, store peerId in-memory for now.
  const peers = {};
  if (req.method === 'POST') {
    peers[peerId] = req.body.signalData;
    res.status(200).json({ message: 'Peer data saved.' });
  } else if (req.method === 'GET') {
    const signalData = peers[peerId];
    res.status(200).json({ signalData });
  }
}
