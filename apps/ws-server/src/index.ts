import { configDotenv } from 'dotenv';
import { WebSocketServer } from 'ws';


configDotenv()

const port = Number(process.env.PORT)
const wss = new WebSocketServer({ port })

wss.on('connection', function connection(ws, req) {
  
});

console.log(`Websocket server running on port ${port}`);
