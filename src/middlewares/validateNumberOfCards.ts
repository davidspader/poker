import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export async function validateNumberOfCards(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { cards1 } = request.game;
  const { cards2 } = request.game;

  if (cards1.length != 5 || cards2.length != 5) {
    throw new AppError("Número de cartas incorreto!");
  }

  return next();
}