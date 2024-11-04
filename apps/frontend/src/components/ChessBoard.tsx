import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import ChessSquare from "./chessboard/ChessSquare";
import { MOVE } from "@repo/common/messages";


export const ChessBoard = ({chess, board, socket, setBoard} : Board) => {

    const [from, setFrom] = useState<Square | null>(null)

    return <div className="text-black">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentaion = String.fromCharCode(97 + (j % 8)) + "" + (8-i) as Square
                 
                    return <div onClick={() => {
                 
                        if (!from) {
                            setFrom(squareRepresentaion)
                        } else {
                            
                            socket.send(JSON.stringify({
                                type : MOVE,
                                payload : {
                                    move : {
                                            from,
                                            to : squareRepresentaion
                                    }
                                }
                            }))

                            setFrom(null)
                            chess.move({
                                from, 
                                to : squareRepresentaion
                            })
                            setBoard(chess.board())
                        }
                    }} key={j} className={`w-12 h-12 sm-two:w-14 sm-two:h-14 sm-three:w-18 sm-three:w-18 md:w-18 md:h-18 lg:w-20 lg:h-20 ${(i+j)%2==0 ? "bg-[#ebecd0]" : "bg-[#739552]"}`}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {square && <ChessSquare square={square} />}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}


interface Board {
    board : ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null) [][]

    socket : WebSocket,
    chess: Chess;
    setBoard: React.Dispatch<React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>>;
}