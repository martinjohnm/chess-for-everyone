
import { useSocket } from "../hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { EXIT_GAME, GAME_ADDED, GAME_ENDED, GAME_JOINED, GAME_OVER, INIT_GAME, JOIN_ROOM, MOVE } from "@repo/common/messages";
import { ChessBoard, isPromoting } from "../components/ChessBoard";

import { Button } from "@repo/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Chess, Move } from "chess.js";
import { MovesTable } from "../components/MovesTable";
import { Result } from "@repo/common/types";
import { ExitDialogBox } from "../components/ExitDialogBox";
import GameEndModal from "../components/GameEndModal";
import { ShareGame } from "../components/ShareGame";
import { useUser } from "../store/src/hooks/useUser";
import { movesAtom, userSelectedMoveIndexAtom } from "../store/src/atoms/chessBoard";


export interface GameResult {
    result: Result;
    by: string;
  }

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
 
    const navigate = useNavigate()    
    
    const [chess, _setChess ] = useState<Chess>(new Chess())
    const [board, setBoard] = useState(chess.board());
    const setMoves = useSetRecoilState(movesAtom);
    const [started, setStarted] = useState<Boolean>(false)
    const [added, setAdded] = useState<Boolean>(false)
    const [result, setResult] = useState<GameResult | null>(null);
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
    const [gameIDFromSocket, setGameIdFromSocket] = useState<string>("")
    const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
    const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);

    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        userSelectedMoveIndexRef.current = userSelectedMoveIndex;
    }, [userSelectedMoveIndex]);
    const user = useUser()

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
            console.log("message" ,message);
            
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
                    
                    if (userSelectedMoveIndexRef.current !== null ) {
                        setMoves((moves) => [...moves, move])
                    }
                    
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
                case GAME_JOINED:
                    setGameMetadata({
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.whitePlayer,
                    })

                    setStarted(true);

                    message.payload.moves.map((x: Move) => {
                        if (isPromoting(chess, x.from, x.to)) {
                        chess.move({ ...x, promotion: 'q' });
                        } else {
                        chess.move(x);
                        }
                    });
                    setMoves(message.payload.moves);
                    break;
                case GAME_OVER:
                    setResult(message.payload.result);
                    chess.reset()
                    setMoves([])
                    break;
            
                case GAME_ENDED:
                    console.log("game ended");
                    
                    let wonBy
                    switch (message.payload.status) {
                        case "COMPLETED" : 
                            wonBy = message.payload.result !== "DRAW" ? "ChekcMate" : "Draw";
                            break;
                        case "PLAYER_EXIT":
                            wonBy = "Player Exit";
                            break;
                        default:
                            wonBy = "Timeout"
                    }
                    setResult({
                        result : message.payload.result,
                        by : wonBy
                    })
                    chess.reset()
                    setMoves([])
                    setStarted(false)
                    setAdded(false)


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


    const handleExit = () => {
        socket?.send(
        JSON.stringify({
            type: EXIT_GAME,
            payload: {
            gameId,
            },
        }),
        );
        setMoves([]);
        navigate('/');
    };

    if (!socket) return <div>Connecting...</div>
    
    return (<div className="bg-[#302e2b]">

        {result && (
            <GameEndModal
            blackPlayer={gameMetadata?.blackPlayer}
            whitePlayer={gameMetadata?.whitePlayer}
            gameResult={result}
            ></GameEndModal>
        )}    
        {started && (
            <div className="justify-center flex pt-4 text-white">
            {(user.id === gameMetadata?.blackPlayer?.id ? 'b' : 'w') ===
            chess.turn()
                ? 'Your turn'
                : "Opponent's turn"}
            </div>
        )}
        <div className="py-6 md:grid md:grid-cols-3 md:mx-auto md:container lg:grid-cols-6 lg:w-full">
            
            <div className="md:col-span-2 lg:col-span-4 w-full flex justify-center">
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
            <div className="md:col-span-1 lg:col-span-2 flex justify-center rounded-lg bg-[#262522]">
                <div className="w-full h-full">
                    {!started ? (
                        
                        <div className="w-full justify-center items-center flex p-4">
                            {added ? (
                                <ShareGame gameId={gameIDFromSocket}/>
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
                        <div className="w-full items-center justify-center p-2">
                            <div className="w-full items-center justify-center flex mt-6">
                                <Button
                                    onclick={() => setDialogOpen(true)}
                                    className="px-4 py-4 bg-red-500 text-white rounded hover:bg-red-700 flex w-1/2 items-center justify-center"
                                >
                                    Exit Game
                                </Button>
                            </div>
                            <ExitDialogBox title="Exit Game" message="Are you sure ? this action cannot be undone !" isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleExit}/>
                        </div>
                    )}

                    <div className="w-full items-center justify-center overflow-auto h-[600px] container mx-auto p-10 md:h-[350px]">
                        
                        <MovesTable/>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    )

}