import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
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

    const asset = release.assets.find(a => a.name.endsWith(".dmg"));
    if (!asset) return res.status(404).send("Asset no encontrado");

    const fileRes = await fetch(asset.url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/octet-stream",
      },
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asset.name}"`
    );

    fileRes.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error descargando la release");
  }
}
