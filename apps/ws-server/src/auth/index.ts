import { WebSocket } from "ws";
import { User } from "../SocketManager";
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv";


configDotenv()

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export interface UserJwtClaims {
    userId : string;
    name   : string;
    isGuest?: boolean
}

export const extractAuthUser = (token : string, ws : WebSocket) : User => {
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtClaims
    return new User(ws, decoded)
}