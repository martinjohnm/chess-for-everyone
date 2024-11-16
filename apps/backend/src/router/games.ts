import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "@repo/db/client"
import { COOKIE_MAX_AGE } from "../consts";



const router = Router()

interface userJwtClaims {
    userId: string;
    name: string;
    isGuest?: boolean;
}
interface UserDetails {
    id: string;
    token?: string;
    name: string;
    isGuest?: boolean;
}


const CLIENT_URL = process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.get('/get', async (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as UserDetails;
        const games = await db.game.findMany({
            where : {
                OR : [
                    {
                        blackPlayerId : user.id
                    }, 
                    {
                        whitePlayerId : user.id
                    }
                ]
            }
        })
    
    
        
        res.json({
            success : true,
            data : games
        });

      }else if (req.cookies && req.cookies.guest) {
        const decoded = jwt.verify(req.cookies.guest, JWT_SECRET) as userJwtClaims;

        const games = await db.game.findMany({
            where: {
                blackPlayerId: decoded.userId,
            },
        });
      
      
      } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      }
});

export default router