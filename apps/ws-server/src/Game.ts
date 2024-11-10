import { Chess, Move, WHITE } from "chess.js";
import { GAME_ENDED, GAME_RESULT, GAME_STATUS, INIT_GAME, MOVE } from "@repo/common/messages"
import { randomUUID } from "crypto"
import { socketManager, User } from "./SocketManager";
import db from "@repo/db/client"

const GAME_TIME_MS = 10 * 60 * 60 * 1000;


export class Game {
    public gameId : string;
    public player1UserId : string;
    public player2UserId : string | null;
    public board : Chess;
    private moveCount = 0;
    private timer : NodeJS.Timeout | null = null;
    private moveTimer : NodeJS.Timeout | null = null;
    public result : GAME_RESULT | null = null;
    private player1TimeConsumed = 0;
    private player2TimeConsumed = 0;
    private startTime = new Date(Date.now())
    private lastMoveTime = new Date(Date.now())

    constructor(player1UserId : string, player2UserId : string | null, gameId? : string, startTime? : Date) {
        this.player1UserId = player1UserId;
        this.player2UserId = player2UserId
        this.board = new Chess()
        this.gameId = gameId ?? randomUUID()
        if (startTime) {
            this.startTime = startTime;
            this.lastMoveTime = startTime
        }
    }

    seedMoves(moves : {
        id : string;
        gameId : string;
        moveNumber : string;
        from : string;
        to : string;
        comments : string | null;
        timeTaken : number | null;
        createdAt : Date;
    }[]) {

        moves.forEach(move => {
            // check for promotion

            this.board.move({
                from : move.from,
                to : move.to
            })
        });

        this.moveCount = moves.length;
        if (moves[moves.length - 1]) {
            this.lastMoveTime = moves[moves.length - 1]?.createdAt ?? new Date(Date.now())
        }

        moves.map((move, index) => {
            if (move.timeTaken) {
                if (index %2 === 0 ) {
                    this.player1TimeConsumed += move.timeTaken
                } else {
                    this.player2TimeConsumed += move.timeTaken
                }
            }
        });

        // reset timers here


    }

    async updateSecondPlayer(player2UserId : string) {
        this.player2UserId = player2UserId;

        const users = await db.user.findMany({
            where : {
                id : {
                    in : [this.player1UserId, this.player2UserId ?? ""]
                },
            }
        })

        try {
            this.createGameInDb();
        } catch(e) {
            console.error(e);
            return;
        }

        const WhitePlayer = users.find((user) => user.id === this.player1UserId)
        const BlackPlayer = users.find((user) => user.id === this.player2UserId)

        socketManager.broadcast(
            this.gameId,
            JSON.stringify({
                type : INIT_GAME,
                payload : {
                    gameId : this.gameId,
                    whitePlayer : {
                        name : WhitePlayer?.name,
                        id : this.player1UserId,
                        isGuest : WhitePlayer?.provider === "GUEST"
                    },
                    blackPlayer : {
                        name : BlackPlayer?.name,
                        id : this.player2UserId,
                        isGuest : BlackPlayer?.provider === "GUEST"
                    },

                    fen : this.board.fen(),
                    moves : []
                }
            })
        )
    }

    async createGameInDb() {
        this.startTime = new Date(Date.now())
        this.lastMoveTime = this.startTime;

        const game = await db.game.create({
            data : {
                id : this.gameId,
                timeControl : "CLASSICAL",
                status : "IN_PROGRESS",
                startAt : this.startTime,
                currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                whitePlayer : {
                    connect : {
                        id : this.player1UserId
                    }
                },
                blackPlayer : {
                    connect : {
                        id : this.player2UserId ?? ""
                    }
                }
            },
            include : {
                whitePlayer : true,
                blackPlayer : true
            }
        });
        this.gameId = game.id
    }

    async addMoveToDb(move : Move, moveTimeStamp : Date) {
        await db.$transaction([
            db.move.create({
                data : {
                    gameId : this.gameId,
                    moveNumber : this.moveCount + 1,
                    from : move.from, 
                    to : move.to,
                    before : move.before,
                    after : move.after,
                    createdAt : moveTimeStamp,
                    timeTaken : moveTimeStamp.getTime() - this.lastMoveTime.getTime(),
                    san : move.san
                }
            }),

            db.game.update({
                data : {
                    currentFen : move.after
                },
                where : {
                    id : this.gameId
                }
            })
        ])
    }

    
    
}