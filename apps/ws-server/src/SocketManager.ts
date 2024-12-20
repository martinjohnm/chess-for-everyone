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


class SocketManager {
    private static instance : SocketManager;
    private interestedSockets : Map<string, User[]>; // Maping socket Id with corresponding user object
    private userRoomMapping : Map<string, string>;   // Maping gameId with corresponding userId, userId => gameId

    private constructor() {
        this.interestedSockets = new Map<string, User[]>();
        this.userRoomMapping = new Map<string, string>()
    }

    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance
        }
        SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }
    addUser(user: User, roomId : string) {
        this.interestedSockets.set(roomId, [
            ...(this.interestedSockets.get(roomId) || []),
            user
        ]);
        this.userRoomMapping.set(user.userId, roomId)

    }
    broadcast(roomId : string, message : string) {
        const users = this.interestedSockets.get(roomId)
        if (!users) {
            console.error("No users in room");
            return;
        }
        

        users.forEach((user) => {
            user.socket.send(message)
        })
    }


    removeUser(user : User) {
        const roomId = this.userRoomMapping.get(user.userId)
        if (!roomId){
            console.error("User was not interested in any room?");
            return;
        }
        const room = this.interestedSockets.get(roomId) || []
        const remainingUsers = room.filter(u => 
            u.userId !== user.userId
        )
        this.interestedSockets.set(
            roomId, 
            remainingUsers
        );
        if (this.interestedSockets.get(roomId)?.length === 0) {
            this.interestedSockets.delete(roomId)
        }
        this.userRoomMapping.delete(user.userId)
    }
}

export const socketManager = SocketManager.getInstance()