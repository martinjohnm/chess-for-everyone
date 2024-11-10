

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