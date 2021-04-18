import { NextFunction, Request, Response } from "express";

export async function ToUpperCaseCards(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { cards1 } = request.body;
  const { cards2 } = request.body;

  request.game = {
    cards1: cards1.map(function (x) { return x.toUpperCase(); }),
    cards2: cards2.map(function (x) { return x.toUpperCase(); })
  };


  return next();
}