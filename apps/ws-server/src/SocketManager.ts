import { WebSocket } from "ws";
import { UserJwtClaims } from "./auth";
import { randomUUID } from 'crypto';


export class User {
    public socket   : WebSocket;
    public id       : string;
    public userId   : string;
    public name     : string;
    public isGuest? : boolean;

    constructor(socket : WebSocket, userJwtClaims : UserJwtClaims) {
        this.socket     = socket;
        this.userId     = userJwtClaims.userId;
        this.id         = randomUUID()
        this.name       = userJwtClaims.name;
        this.isGuest    = userJwtClaims.isGuest;
    }

}