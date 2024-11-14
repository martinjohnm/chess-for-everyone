// import { Chess, Square } from "chess.js";
// import { TbUrgent } from "react-icons/tb";




// export function isPromoting(chess : Chess, from : Square, to : Square) : Boolean  {

//     if (!from) {
//         return false;
//       }
    
//       const piece = chess.get(from);
//       console.log(piece);
      
//       if (piece?.type !== 'p') {
//         console.log("not pawn");
        
//         return false;
//       }
    
//       if (piece.color !== chess.turn()) {
//         console.log("not your turn");
        
//         return false;
//       }

      
//       console.log("success");
      
//       return chess
//         .history({ verbose: true })
//         .map((it) => it.to)
//         .includes(to);
// }