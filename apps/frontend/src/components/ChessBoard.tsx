import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { memo, useEffect, useState } from "react";
import ChessSquare from "./chessboard/ChessSquare";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom, movesAtom, userSelectedMoveIndexAtom } from "@repo/store/chessBoard"
import NumberNotation from "./chessboard/NumberNotation";
import { MOVE } from "@repo/common/messages";


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

    useEffect(() => {
        if (myColor === 'b') {
          setIsFlipped(true);
        }
    }, [myColor]);
  
    useEffect(() => {
        if (userSelectedMoveIndex !== null) {
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
                <NumberNotation isMainBoxColor={isFlipped ? i % 2 !== 0 : i % 2 === 0} label={i.toString()} />
                {(isFlipped ? row.slice().reverse() : row).map((square, j)=> {
                    
                    j = isFlipped ? 7 - (j%8) : j % 8

                    const squareRepresentation = (String.fromCharCode(97 + j) + '' + i) as Square;
                    
                    return <div key={j} className={`w-12 h-12 sm-two:w-14 sm-two:h-14 sm-three:w-18 sm-three:w-18 md:w-18 md:h-18 lg:w-20 lg:h-20 ${(i+j)%2==0 ? "bg-[#ebecd0]" : "bg-[#739552]"}`}>
                            <div className="w-full justify-center flex h-full items-center flex-col"
                                    onClick={() => {
                                        
                                        if (!started) {
                                            return
                                        }
                                        if (!from && square?.color !== chess.turn()) return;
                                        if (!isMyTurn) {
                                            return
                                        }

                                        if (from != squareRepresentation) {
                                          setFrom(squareRepresentation)
                                        } else {
                                          setFrom(null)
                                        }

                                        if (!from) {
                                            setFrom(squareRepresentation);
                                            
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
                        </div>
                    </div>
                })}
            </div>)
        })}
    </div>
}
)