import { GAME_OVER, INIT_GAME, MOVE, MoveType } from "@repo/common/config";
import { Chess } from "chess.js";
import { WebSocket } from "ws";


export class Game {
    public player1 : WebSocket;
    public player2 : WebSocket;

    private board  : Chess
    private startTime : Date;
    private moveCount = 0;

    constructor(player1 : WebSocket, player2 : WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : "white"
            }
        }))

        this.player2.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : "black"
            }
        }))
    }

    makeMove(socket : WebSocket, move : MoveType) {

        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Wrong person, should be made bt white");
            return
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("wrong person should be made by black");
            return;
        }

        try {
            this.board.move(move)
        } catch (e) {
            console.log(e);
            return
        }

        if (this.board.isGameOver()) {
            // send both players that game over
            this.player1.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === "w" ? "black" : "white"
                }
            }))

            this.player2.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === "w" ? "black" : "white"
                }
            }))
        }

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }
        this.moveCount++
    }
}