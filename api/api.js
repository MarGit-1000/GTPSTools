// Tambahkan error handling yang lebih baik
app.post("/encode", async (req, res) => {
  try {
    // Cek apakah ada data
    if (!req.body || !req.body.items) {
      return res.status(400).json({ 
        error: "Data items tidak ditemukan"
      });
    }

    // Cek versi
    if (!req.body.version) {
      return res.status(400).json({
        error: "Versi items.dat tidak valid"
      });
    }

    const result = encodeItems(req.body);
    
    // Kirim file
    res.setHeader("Content-Disposition", "attachment; filename=items.dat");
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(result.buffer));

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ 
      error: "Gagal membuat items.dat",
      detail: err.message 
    });
  }
});