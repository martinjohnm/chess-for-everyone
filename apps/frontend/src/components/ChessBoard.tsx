import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import ChessSquare from "./chessboard/ChessSquare";
import { MOVE } from "@repo/common/messages";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "@repo/store/chessBoard"

export const ChessBoard = ({chess, board, socket, setBoard} : Board) => {

    const [from, setFrom] = useState<Square | null>(null)
    const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom)
    const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(userSelectedMoveIndexAtom);
    const [moves, setMoves] = useRecoilState(movesAtom);


    useEffect(() => {


    }, [])

    return <div className="text-black">
        {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
            i = isFlipped ? i + 1 : 8 - i;
            return (<div key={i} className="flex items-center justify-center">
                <p>{i}</p>
                {(isFlipped ? row.slice().reverse() : row).map((square, j)=> {
                    return <div className={`p-2 w-20 h-20 bg-red-200 items-center justify-center 
                        flex ${(i+j) % 2 == 0 ? "bg-green-700" : "bg-slate-400"}`}>
                        <p>{String.fromCharCode(97 + j)}</p>
                    </div>
                })}
            </div>)
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