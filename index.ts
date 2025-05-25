import express, { Request, Response } from "express";
import ytdl from "@distube/ytdl-core";

const app = express();
const PORT = 3000;

// ✅ Nenhum overload problemático aqui
app.get("/video", async (req: Request, res: Response): Promise<void> => {
  const videoUrl = req.query.url as string;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    res.status(400).json({ error: "URL inválida do YouTube." });
    return;
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: "audioandvideo",
    });

    if (!format || !format.url) {
      res
        .status(500)
        .json({ error: "Não foi possível encontrar um formato compatível." });
      return;
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'inline; filename="video.mp4"');

    ytdl.downloadFromInfo(info, { format }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar vídeo do YouTube." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/video?url=...`);
});
