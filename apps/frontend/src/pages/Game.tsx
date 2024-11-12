import { useUser } from "@repo/store/useUser"
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { GAME_ADDED, GAME_OVER, INIT_GAME, JOIN_ROOM, MOVE } from "@repo/common/messages";
import { ChessBoard } from "../components/ChessBoard";

import { Button } from "@repo/ui/button";
import { ExitGame } from "../components/ExitGame";
import { useNavigate, useParams } from "react-router-dom";


export const Game = () => {

    const socket = useSocket()
    const { gameId } = useParams();
    const user = useUser()
    const navigate = useNavigate()

    const [chess, _ ] = useState(new Chess())
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState<Boolean>(false)
    const [added, setAdded] = useState<Boolean>(false)
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
                    setGameIdFromSocket(message.gameId)
                    break
                case INIT_GAME:
                    setBoard(chess.board())
                    setStarted(true)
                    navigate(`/game/${message.payload.gameId}`)
                    break
                case MOVE:
                    const move = message.payload
                    chess.move(move)
                    setBoard(chess.board())
                    console.log("Move made");
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
    }, [socket])

    if (!socket) return <div>Connecting...</div>
    
    return (
        <div className="py-6 md:grid md:grid-cols-3 md:mx-auto md:container lg:max-w-5xl">
            <div className="md:col-span-2 w-full flex justify-center">
                <ChessBoard chess={chess} setBoard = {setBoard} board = {board} socket={socket}/>
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