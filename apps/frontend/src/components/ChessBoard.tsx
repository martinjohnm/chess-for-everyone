import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { memo, useEffect, useState } from "react";
import ChessSquare from "./chessboard/ChessSquare";
import { useRecoilState } from "recoil";
import { MOVE } from "@repo/common/messages";
import LegalMoveIndicator from "./chessboard/LegalMoveIndicator";
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "../store/src/atoms/chessBoard";


export function isPromoting(chess: Chess, from: Square, to: Square) {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== 'p') {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!['1', '8'].some((it) => to.endsWith(it))) {
    return false;
  }

  return chess
    .moves({ square: from, verbose: true })
    .map((it) => it.to)
    .includes(to);
}

export const ChessBoard = memo(
({ 
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
    const isMyTurn = myColor === chess.turn();
    const [legalMoves, setLegalMoves] = useState<string[]>([]);

    useEffect(() => {
        if (myColor === 'b') {
          setIsFlipped(true);
        }
    }, [myColor]);
  
    useEffect(() => {
        if (userSelectedMoveIndex!== null) {
          chess.reset();
          moves.forEach((move) => {
            chess.move({ from: move.from, to: move.to });
          });
          setBoard(chess.board());
          setUserSelectedMoveIndex(null);
        } else {
          setBoard(chess.board());
        }
    }, [moves]);
  

    return <div className="text-black">
        {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
            i = isFlipped ? i + 1 : 8 - i;
            return (<div key={i} className="flex">
                {(isFlipped ? row.slice().reverse() : row).map((square, j)=> {
                    
                    j = isFlipped ? 7 - (j%8) : j % 8

                    const squareRepresentation = (String.fromCharCode(97 + j) + '' + i) as Square;
                    const isPiece : boolean = !!square
                    const piece = square && square.type
                    const isKingInCheckSquare = piece === "k" && square?.color === chess.turn() && chess.inCheck()
                    
                    return <div key={j} className={`w-14 h-14 sm-two:w-14 sm-two:h-14 sm-three:w-14 sm-three:h-14 lg:w-20 lg:h-20 lg-two:w-22 lg-two:h-22 lg-three:w-24 lg-three:h-24 ${(i+j)%2==0 ? "bg-[#ebecd0]" : "bg-[#739552]"} ${isKingInCheckSquare ? "border-4 border-red-600":""}`}>
                            <div className="w-full justify-center flex h-full items-center flex-col relative"
                                    onClick={() => {
                                        
                                        if (!started) {
                                            return
                                        }

                                        if (userSelectedMoveIndex !== null) {
                                          chess.reset()
                                          moves.forEach((move) => {
                                            chess.move({from : move.from, to : move.to})
                                          })
                                          setBoard(chess.board())
                                          setUserSelectedMoveIndex(null)
                                        }

                                        if (!from && square?.color !== chess.turn()) return;
                                        if (!isMyTurn) {
                                            return
                                        }

                                       
                                        if (from != squareRepresentation) {
                                          setFrom(squareRepresentation)
                                          if (isPiece) {
                                            setLegalMoves(
                                              chess
                                                .moves({
                                                  verbose : true,
                                                  square : square?.square
                                                })
                                                .map((move) => move.to)
                                            )
                                          }
                                        
                                        } else {
                                          setFrom(null)
                                        }

                                        if (!isPiece) {
                                          setLegalMoves([])
                                        }

                                        if (!from) {
                                            setFrom(squareRepresentation);
                                            setLegalMoves(chess.moves({
                                              verbose : true,
                                              square : square?.square
                                            })
                                            .map((move) => move.to)
                                            )
                                            
                                        } else {
                                          try {
                                            let moveResult: Move;
                                          
                                            if (isPromoting(chess, from, squareRepresentation)) {
                                              moveResult = chess.move({
                                                from,
                                                to : squareRepresentation,
                                                promotion : "q"
                                              })
                                            } else {
                                              moveResult = chess.move({
                                                from,
                                                to : squareRepresentation
                                              })
                                            }
                                          
                                            if (moveResult) {
                                              
                                              setMoves((prev) => [...prev, moveResult]);
                                              setFrom(null);
                                              
                                              socket.send(
                                                JSON.stringify({
                                                  type: MOVE,
                                                  payload: {
                                                    gameId,
                                                    move: moveResult,
                                                  },
                                                })
                                              );
                                            }
                                          } catch (e) {
                                            console.log('e', e);
                                          }
                                        }
                                        
                                    }}  >
                                {square && <ChessSquare square={square} />}     


                                {j === 0 && !isFlipped && <p className={`absolute ${!isFlipped ? "top-0 left-0" : " right-0 top-0"} p-1 text-sm font-bold font-sans ${(i+j)%2!=0 ? "text-[#ebecd0]" : "text-[#739552]"}`}>{i}</p>}
                                {i === 1 && !isFlipped && <p className={`absolute ${!isFlipped ? "bottom-0 right-0" : " left-0 top-0"} p-1 text-sm font-bold font-sans ${(i+j)%2!=0 ? "text-[#ebecd0]" : "text-[#739552]"}`}>{String.fromCharCode(97 + j)}</p>}

                                {j === 7 && isFlipped && <p className={`absolute ${isFlipped ? "top-0 left-0" : " right-0 top-0"} p-1 text-sm font-bold font-sans ${(i+j)%2!=0 ? "text-[#ebecd0]" : "text-[#739552]"}`}>{i}</p>}
                                {i === 8 && isFlipped && <p className={`absolute ${isFlipped ? "bottom-0 right-0" : " left-0 top-0"} p-1 text-sm font-bold font-sans ${(i+j)%2!=0 ? "text-[#ebecd0]" : "text-[#739552]"}`}>{String.fromCharCode(97 + j)}</p>}
                                {!!from && legalMoves.includes(squareRepresentation) && (
                                  <LegalMoveIndicator isPiece={!!square?.type} />
                                )}
                        </div>
                    </div>
                })}
            </div>)
        })}
    </div>
}
)