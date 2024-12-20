import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import db from "@repo/db/client"
import { COOKIE_MAX_AGE } from "../consts";
import { v4 as uuidv4 } from "uuid"
import passport from "passport";

const router = Router()

const CLIENT_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';


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



router.get('/refresh', async (req: Request, res: Response) => {
    if (req.user) {
      const user = req.user as UserDetails;
      const userDb = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });
  
      const token = jwt.sign({ userId: user.id, name: userDb?.name }, JWT_SECRET);

      res.json({
        token ,
        id: user.id,
        name: userDb?.name,
      });
    }else if (req.cookies && req.cookies.guest) {
        const decoded = jwt.verify(req.cookies.guest, JWT_SECRET) as userJwtClaims;
        const token = jwt.sign(
          { userId: decoded.userId, name: decoded.name, isGuest: true },
          JWT_SECRET,
        );
        let User: UserDetails = {
          id: decoded.userId,
          name: decoded.name,
          token: token,
          isGuest: true,
        };
        res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
        res.json(User);
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});


router.post('/guest', async (req: Request, res: Response) => {
    const bodyData = req.body;

    let guestUUID = 'guest-' + uuidv4();
  
    const user = await db.user.create({
      data: {
        username: guestUUID,
        email: guestUUID + '@chessforeveryone.com',
        name: bodyData.name || guestUUID,
        provider: 'GUEST',
      },
    });
  
    const token = jwt.sign(
      { userId: user.id, name: user.name, isGuest: true },
      JWT_SECRET,
    );
    const UserDetails: UserDetails = {
      id: user.id,
      name: user.name!,
      token: token,
      isGuest: true,
    };
    res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
    res.json(UserDetails);
});
  

router.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('guest');
    req.logout((err) => {
      if (err) {
        console.error('Error logging out:', err);
        res.status(500).json({ error: 'Failed to log out' });
      } else {
        res.clearCookie('jwt');
        res.redirect(CLIENT_URL);
      }
    });
});


router.get(
    '/google',
    passport.authenticate('google', {
         scope: ['profile', 'email'] 
}),
);

router.get(
'/google/callback',
passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
}),
);

router.get("/test",(req: Request, res: Response) => {
  res.json({
    'test' : "success"
  });
  
}
)

export default router;