import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export async function validateDuplicateCards(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { cards1 } = request.game;
  const { cards2 } = request.game;

  let cards = cards1.concat(cards2);


  cards = cards.filter((value, i) => cards.indexOf(value) === i);
  if (cards.length != 10) {
    throw new AppError("Não é possivel repetir cartas!");
  }

  return next();
}