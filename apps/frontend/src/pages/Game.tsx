import { useUser } from "@repo/store/useUser"
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { GAME_ADDED, GAME_OVER, INIT_GAME, JOIN_ROOM, MOVE } from "@repo/common/messages";
import { ChessBoard, isPromoting } from "../components/ChessBoard";

import { Button } from "@repo/ui/button";
import { ExitGame } from "../components/ExitGame";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { movesAtom } from "@repo/store/chessBoard";
import { Chess } from "chess.js";



export interface Player {
    id: string;
    name: string;
    isGuest: boolean;
  }
export interface Metadata {
    blackPlayer: Player;
    whitePlayer: Player;
  }


export const Game = () => {

    const socket = useSocket()
    const { gameId } = useParams();
    const user = useUser()
    const navigate = useNavigate()    
    
    const [chess, _setChess ] = useState<Chess>(new Chess())
    const [board, setBoard] = useState(chess.board());
    const setMoves = useSetRecoilState(movesAtom);
    const [started, setStarted] = useState<Boolean>(false)
    const [added, setAdded] = useState<Boolean>(false)
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
    const [gameIDFromSocket, setGameIdFromSocket] = useState<string>("")
    
    

    useEffect(() => {
        if (!user) {
          window.location.href = '/login';
        }


      }, [user]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case GAME_ADDED: 
                    setAdded(true)
                    console.log("game added");
                    
                    setGameIdFromSocket(message.gameId)
                    break
                case INIT_GAME:
                    setBoard(chess.board())
                    console.log("game initialized");
                    setStarted(true)
                    navigate(`/game/${message.payload.gameId}`)
                    setGameMetadata({
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.blackPlayer
                    })
                    break
                case MOVE:
                    const { move } = message.payload
                 
                    try {
                        if (isPromoting(chess, move.from, move.to)) {
                            chess.move({
                                from : move.from,
                                to : move.to,
                                promotion : "q"
                            })
                        } else {
                            chess.move({ from: move.from, to: move.to });
                        
                        }
                       
                        console.log("move made");
                        setMoves((moves) => [...moves, move])
                    } catch(e) {
                        break
                    }
                    break
                case GAME_OVER:
                    console.log('Game over');
                    break
            }
        }

        if (gameId !== "random") {
            socket.send(
                JSON.stringify({
                    type : JOIN_ROOM,
                    payload : {
                        gameId
                    }
                })
            )
        }
    }, [chess,socket])

    if (!socket) return <div>Connecting...</div>
    
    return (
        <div className="py-6 md:grid md:grid-cols-3 md:mx-auto md:container lg:max-w-5xl">
            <div className="md:col-span-2 w-full flex justify-center">
                <ChessBoard 
                    gameId={gameId ?? ""} 
                    chess={chess} 
                    setBoard = {setBoard} 
                    board = {board} 
                    socket={socket}
                    myColor={
                        user.id === gameMetadata?.blackPlayer?.id ? 'b' : 'w'
                    }
                    started={started}
                />
            </div>
            <div className="md:col-span-1 flex justify-center rounded-lg bg-slate-300 dark:bg-[#262522]">
                <div className="w-full h-full flex justify-center items-center">
                    {!started ? (
                        <div className="w-full justify-center flex">
                            {added ? (
                                <div>
                                    <p>share your game id:</p>
                                    <p>{gameIDFromSocket}</p>
                                </div>
                            ) : (
                                
                                gameId === "random" && (
                                <Button className="bg-[#81b64c] p-4 mt-4 rounded-md w-2/3" onclick={() => {
                                    socket.send(
                                        JSON.stringify({
                                            type : INIT_GAME
                                    }))
                                }}>Play</Button>
                                )
                            
                            )}
                            
                        </div>
                    ) : (
                        <div className="w-full justify-center flex">
                            <ExitGame/>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )

}