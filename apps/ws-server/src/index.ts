import { configDotenv } from "dotenv";
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";


configDotenv()

const port = Number(process.env.PORT)
const wss = new WebSocketServer({ port })

const gameManager = new GameManager()

wss.on("connection", function connection(ws) {
    gameManager.addUser(ws)
})