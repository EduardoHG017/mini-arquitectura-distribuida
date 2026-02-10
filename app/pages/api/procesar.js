export default function handler(req, res) {
  const nombre = req.query.nombre || "anónimo";

  if (nombre === "error") {
    return res.status(500).json({ error: "Error simulado" });
  }

  res.status(200).json({
    resultado: `Nombre procesado: ${nombre.toUpperCase()}`,
    timestamp: new Date().toISOString()
  });
}
