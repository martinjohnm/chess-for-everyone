
import { WebSocketServer } from "ws";
import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session"
import { COOKIE_MAX_AGE } from "./consts";
import cors from "cors"
import { initPassport } from "./passport";
import passport from "passport";
import authRoute from "./router/auth"


const app = express();
configDotenv()







app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: process.env.COOKIE_SECRET || "cookie-secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure : false, maxAge : COOKIE_MAX_AGE }
    })
);

initPassport();
app.use(passport.initialize());
app.use(passport.authenticate('session'));

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(',')
  : [];

app.use(
    cors({
        origin : allowedHosts,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    })
);


app.use('/auth', authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

