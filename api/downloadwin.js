export default async function handler(req, res) {
  try {
    // 1️⃣ Obtener la última release
    const releaseRes = await fetch(
      "https://api.github.com/repos/vicggit/net.vicdev.patatalandupd/releases/latest",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const release = await releaseRes.json();

    const asset = release.assets.find(a => a.name.endsWith(".exe"));
    if (!asset) return res.status(404).send("Asset no encontrado");

    // 2️⃣ Descargar el asset
    const fileRes = await fetch(asset.url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/octet-stream",
      },
    });

    const buffer = Buffer.from(await fileRes.arrayBuffer());

    // 3️⃣ Enviar al cliente
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asset.name}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);

  } catch (err) {
    console.error("Error en /api/download:", err);
    res.status(500).send("Error descargando la release");
  }
}
