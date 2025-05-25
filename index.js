"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const youtube_dl_exec_1 = require("youtube-dl-exec");
const app = (0, express_1.default)();
const PORT = 3000;
app.get("/video", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        res.status(400).json({ error: "URL inválida do YouTube." });
        return;
    }
    try {
        // Executa o yt-dlp como subprocesso e retorna o stream diretamente
        const child = (0, youtube_dl_exec_1.exec)(videoUrl, {
            output: "-", // saída para stdout
            format: "bestvideo+bestaudio",
            cookies: "./cookies.txt",
            quiet: true,
        }, {
            stdio: ["ignore", "pipe", "ignore"],
        });
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Disposition", 'inline; filename="video.mp4"');
        // ✅ Agora sim temos o .stdout como ReadableStream
        child.stdout.pipe(res);
    }
    catch (err) {
        console.error("Erro ao iniciar o stream:", err);
        res.status(500).json({ error: "Erro ao processar vídeo com yt-dlp." });
    }
}));
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/video?url=...`);
});
