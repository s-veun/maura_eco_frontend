export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, name: 'Product 1', price: 100, category: 'Category 1' },
      { id: 2, name: 'Product 2', price: 200, category: 'Category 2' },
    ]);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}