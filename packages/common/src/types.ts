

export interface MoveType  {
    from : string,
    to : string,
    promotion?: string;
}

export enum AuthProvider {
    EMAIL,
    GOOGLE,
    GITHUB,
    GUEST
  }


  export enum Result {
    WHITE_WINS = 'WHITE_WINS',
    BLACK_WINS = 'BLACK_WINS',
    DRAW = 'DRAW',
  }