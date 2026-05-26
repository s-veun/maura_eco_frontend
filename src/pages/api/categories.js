export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ]);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}