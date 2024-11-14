import { createWebSocketStream, WebSocket } from "ws";
import { Game } from "./Game";
import { EXIT_GAME, GAME_ADDED, GAME_ALERT, GAME_ENDED, GAME_JOINED, GAME_NOT_FOUND, INIT_GAME, JOIN_GAME, JOIN_ROOM, MOVE } from "@repo/common/messages";
import { socketManager, User } from "./SocketManager";
import db from "@repo/db/client"



export class GameManager {
    private games : Game[];
    private pendingGameId : string | null;
    private users : User[]

    constructor() {
      this.games = [],
      this.pendingGameId = null;
      this.users = []
    }

    addUser(user: User) {
      this.users.push(user)
      this.addHandler(user)
    }

    removeUser(socket : WebSocket) {
      const user = this.users.find((user) => user.socket === socket);
      if (!user) {
        console.error("User not found");
        return;
      }
      
      this.users = this.users.filter((user) => user.socket !== socket)
      socketManager.removeUser(user)
    }

    removeGame(gameId: string) {
      this.games = this.games.filter((g) => g.gameId !== gameId);
    }

    private addHandler(user : User) {
      user.socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === INIT_GAME) {
          // If a pendingGameId is present in this class it will map the gameId to user object 
          // and after that the secondPlayer of the game object is updated by this users userId 
          // (there we send INIT_GAME broadcast to all connected sockets the room)
          if (this.pendingGameId) {
            const game = this.games.find((x) => x.gameId === this.pendingGameId)
            if (!game) {
              console.error("Pending game not found");
              return;
            }
            if (user.userId === game.player1UserId) {
              socketManager.broadcast(
                game.gameId,
                JSON.stringify({
                  type : GAME_ALERT,
                  payload : {
                    message : "Trying to connect with yourself?"
                  }
                })
              )
              return;
            }

            socketManager.addUser(user, game.gameId)
            await game.updateSecondPlayer(user.userId)
            this.pendingGameId = null
          // if no pendingGameId is present in this class that means no game without a second player 
          // is present in the game class so we need to make a game without a second player and it 
          // also mean that there is not a user waiting for a random player to join, so we need to make
          // the current user object as the waiting player who is waiting for someone to join
          } else {
            const game = new Game(user.userId, null) 
            this.games.push(game)
            this.pendingGameId = game.gameId;
            socketManager.addUser(user, game.gameId)
            socketManager.broadcast(
              game.gameId,
              JSON.stringify({
                type : GAME_ADDED,
                gameId : game.gameId
              })
            )
          }
        }


        if (message.type === MOVE) {
          const gameId = message.payload.gameId
          const game = this.games.find((game) => game.gameId === gameId)

          if (game) {
            game.makeMove(user, message.payload.move)
            if (game.result) {
              this.removeGame(game.gameId);
            }
          }
        }

        if (message.type === EXIT_GAME) {
          const gameId = message.payload.gameId
          const game = this.games.find((game) => game.gameId === gameId)

          if (game) {
            game.exitGame(user);
            this.removeGame(game.gameId)
          }
        }

        if (message.type === JOIN_ROOM) {
          const gameId = message.payload.gameId;
          if (!gameId) {
            return;
          }

          let availableGame = this.games.find((game) => game.gameId === gameId)
          const gameFromDb = await db.game.findUnique({
            where : {
              id : gameId
            },
            include : {
              moves : {
                orderBy : {
                  moveNumber : "asc"
                }
              },
              blackPlayer: true,
              whitePlayer: true
            }
          })

          // there is a game created bt no second player 

          if (availableGame && !availableGame.player2UserId) {
            socketManager.addUser(user, availableGame.gameId)
            await availableGame.updateSecondPlayer(user.userId);
            return;
          }

          if (!gameFromDb) {
            user.socket.send(JSON.stringify({
              type : GAME_NOT_FOUND
            }))
          }

          if (gameFromDb?.status !== "IN_PROGRESS") {
            user.socket.send(JSON.stringify({
              type : GAME_ENDED,
              payload : {
                result : gameFromDb?.result,
                status : gameFromDb?.status,
                moves : gameFromDb?.moves,
                blackPlayer : {
                  id : gameFromDb?.blackPlayer.id,
                  name : gameFromDb?.blackPlayer.name
                },
                whitePlayer : {
                  id : gameFromDb?.whitePlayer.id,
                  name : gameFromDb?.whitePlayer.name
                }
              }
            }))

            return;
          }

          if (!availableGame) {
            const game = new Game(
              gameFromDb.whitePlayerId!,
              gameFromDb.blackPlayerId!,
              gameFromDb.id,
              gameFromDb.startAt
            );

            game.seedMoves(gameFromDb?.moves || [])
            this.games.push(game);
            availableGame = game;
          }

          user.socket.send(
            JSON.stringify({
              type : GAME_JOINED,
              payload : {
                gameId , 
                moves : gameFromDb.moves,
                blackPlayer : {
                  id : gameFromDb.blackPlayer.id,
                  name : gameFromDb.blackPlayer.name
                },
                whitePlayer : {
                  id : gameFromDb.whitePlayer.id,
                  name : gameFromDb.whitePlayer.name
                },
                player1TimeConsumed: availableGame.getPlayer1TimeConsumed(),
                player2TimeConsumed: availableGame.getPlayer2TimeConsumed(),
              }
            })
          )

          socketManager.addUser(user, gameId)

        }


        
      })
    }
  }