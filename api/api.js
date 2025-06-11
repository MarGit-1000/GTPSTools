import express from "express";
import cors from "cors";
import { encodeItems } from "encoder.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // biar bisa kirim file besar

app.post("/encode", (req, res) => {
  try {
    const result = encodeItems(req.body);
    res.setHeader("Content-Disposition", "attachment; filename=items.dat");
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(result.buffer));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to encode items.dat" });
  }
});

app.listen(3000, () => {
  console.log("API jalan di http://localhost:3000");
});