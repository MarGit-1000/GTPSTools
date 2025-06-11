import { encodeItems } from "../items/encoder.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body; // JSON
    const { buffer, hash } = encodeItems(data);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=items.dat");
    res.setHeader("X-Hash", hash);

    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Encoding failed", details: e.message });
  }
}