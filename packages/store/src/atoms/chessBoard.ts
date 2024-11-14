
import { Chess, Move } from "chess.js"
import { atom } from "recoil"

export const chessAtom = atom<Chess>({
    key : "chessAtom",
    default : new Chess()
})



export const isMyTurnAtom = atom<Boolean>({
    key : "isMyTurnAtom",
    default : false
})

export const chessBoardAtom = atom<any>({
    key : "chessBoardAtom",
    default : null
})

export const isBoardFlippedAtom = atom<Boolean>({
    key : "isBoardFlippedAtom",
    default : false
})

export const movesAtom = atom<Move[]>({
    key : "movesAtom",
    default : []
})

export const userSelectedMoveIndexAtom = atom<number | null>({
    key : "userSelectedMoveIndex",
    default : null
})
