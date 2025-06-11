import { convertItems } from "../GTPSTools/items/items.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "POST") {
    const data = req.body;
    const converted = convertItems(data);
    res.status(200).json({ success: true, converted });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}