import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import ChessSquare from "./chessboard/ChessSquare";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "@repo/store/chessBoard"
import NumberNotation from "./chessboard/NumberNotation";

export const ChessBoard = (
    { 
        board,
        gameId,
        chess,
        setBoard,
        socket, 
        myColor, 
        started
    } : {
        board : ({
            square : Square,
            type : PieceSymbol,
            color : Color
        } | null)[][]
        ,
        gameId : string,
        chess : Chess,
        started : Boolean,
        setBoard : React.Dispatch<
            React.SetStateAction<
                ({
                    square : Square,
                    type : PieceSymbol,
                    color : Color
                } | null)[][]
            >
        >,
        socket : WebSocket, 
        myColor : Color
    }) => {

    const [from, setFrom] = useState<Square | null>(null)
    const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom)
    const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(userSelectedMoveIndexAtom);
    const [moves, setMoves] = useRecoilState(movesAtom);


    useEffect(() => {


    }, [])

    return <div className="text-black">
        {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
            i = isFlipped ? i + 1 : 8 - i;
            return (<div key={i} className="flex">
                <NumberNotation isMainBoxColor={isFlipped ? i % 2 !== 0 : i % 2 === 0} label={i.toString()} />
                {(isFlipped ? row.slice().reverse() : row).map((square, j)=> {
                    
                    j = isFlipped ? 7 - (j%8) : j % 8

                    const squareRepresentation = (String.fromCharCode(97 + j) + '' + i) as Square;
                    
                    return <div key={j} className={`w-12 h-12 sm-two:w-14 sm-two:h-14 sm-three:w-18 sm-three:w-18 md:w-18 md:h-18 lg:w-20 lg:h-20 ${(i+j)%2==0 ? "bg-[#ebecd0]" : "bg-[#739552]"}`}>
                            <div className="w-full justify-center flex h-full">
                                <div 
                                    onClick={() => {
                                        if (!started) {
                                            return;
                                        }
                                        
                                    }}
                                    className="h-full items-center justify-center flex flex-col">
                                        {square && <ChessSquare square={square} />}
                                        {squareRepresentation}
                                    
                                </div>
                        </div>
                    </div>
                })}
            </div>)
        })}
    </div>
}
