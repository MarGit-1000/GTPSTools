import { encodeItems } from "./encoder.js";

export default async function handler(req, res) {
  // Tambahkan CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Handle OPTIONS method untuk CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validasi input
    if (!req.body || !req.body.items || !req.body.version) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Missing required fields: items or version"
      });
    }

    const data = req.body;
    const { buffer, hash } = encodeItems(data);

    // Set response headers
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=items.dat");
    res.setHeader("X-Hash", hash);

    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    console.error("Error details:", e);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: e.message,
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    });
  }
}