import { encodeItemsFromJson } from "../items/items_encoder.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const jsonData = req.body;
  const result = encodeItemsFromJson(jsonData);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(200).json({
    message: "Encoded successfully",
    data: result.result,
    hash: result.hash
  });
}