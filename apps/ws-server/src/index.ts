import { configDotenv } from "dotenv";
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url"
import { extractAuthUser } from "./auth";

configDotenv()

const port = Number(process.env.PORT)
const wss = new WebSocketServer({ port })

const gameManager = new GameManager();


wss.on("connection", function connection(ws, req) {
    //@ts-ignore
    const token: string = url.parse(req.url, true).query.token
    const user = extractAuthUser(token, ws);
    gameManager.addUser(user);

    ws.on('close', () => {
        gameManager.removeUser(ws);
    });

})