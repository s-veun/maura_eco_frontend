export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    res.status(200).json({ id, items: [] });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}