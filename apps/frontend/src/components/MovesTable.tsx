import { movesAtom } from "@repo/store/chessBoard"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"



export const MovesTable = () => {

    const moves = useRecoilValue(movesAtom)

    useEffect(() => {

    }, [])

    return <div>
        {   
            moves.map((move,index) => (
                <div key={index} className={`justify-start px-2 py-1 gap-3 text-white grid grid-cols-8 ${index % 2 === 0 ? "bg-[#2b2927]" : "bg-[#262522]"}`}>
                    <div className="justify-center items-center col-span-1 text-sm text-[#c3c2c2]">
                        <p className="">{index + 1}.</p>
                    </div>
                    <div className="justify-center items-center col-span-2 text-sm font-semibold text-[#c4c3c2]">
                        <p className="">{move.from}</p>
                    </div>
                    <div className="justify-center items-center col-span-2 text-sm font-semibold text-[#c4c3c2]">
                        <p className="">{move.to}</p>
                    </div>
                </div>
                
            ))
        }
    </div>
}