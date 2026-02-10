export default async function handler(req, res) {
  try {
    const nombre = req.query.nombre || "anónimo";

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const baseUrl = `${proto}://${host}`;

    const response = await fetch(
      `${baseUrl}/api/procesar?nombre=${encodeURIComponent(nombre)}`
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({
        error: "Fallo llamando a /api/procesar",
        status: response.status,
        detalle: text
      });
    }

    const data = await response.json();

    res.status(200).json({
      entrada: nombre,
      resultado: data.resultado,
      timestamp: data.timestamp,
      flujo: "entrada -> procesar"
    });
  } catch (err) {
    res.status(500).json({
      error: "entrada crashed",
      detalle: String(err)
    });
  }
}
