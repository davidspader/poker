declare namespace Express {
  export interface Request {
    game: {
      cards1: string[];
      cards2: string[];
    };
  }
}
