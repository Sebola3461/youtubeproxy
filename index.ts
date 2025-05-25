import express, { Request, Response } from "express";
import { exec } from "youtube-dl-exec";

const app = express();
const PORT = 3000;

app.get("/video", async (req: Request, res: Response) => {
  const videoUrl = req.query.url as string;

  if (!videoUrl) {
    res.status(400).json({ error: "URL inválida do YouTube." });
    return;
  }

  try {
    // Executa o yt-dlp como subprocesso e retorna o stream diretamente
    const child = exec(
      videoUrl,
      {
        output: "-", // saída para stdout
        format: "bestvideo+bestaudio",
        cookies: "./cookies.txt",
        quiet: true,
      },
      {
        stdio: ["ignore", "pipe", "ignore"],
      }
    );

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'inline; filename="video.mp4"');

    // ✅ Agora sim temos o .stdout como ReadableStream
    child.stdout!.pipe(res);
  } catch (err) {
    console.error("Erro ao iniciar o stream:", err);
    res.status(500).json({ error: "Erro ao processar vídeo com yt-dlp." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/video?url=...`);
});
