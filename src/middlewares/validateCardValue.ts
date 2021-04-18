import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { Rules } from "../models/Rules";

export async function validateCardValue(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { cards1 } = request.game;
  const { cards2 } = request.game;

  const rules = new Rules();

  for (let i = 0; i < cards1.length; i++) {
    if (!rules.cardsValues.find((value) => value === cards1[i].substring(0, cards1[i].length - 1))) {
      throw new AppError("O valor das cartas está incorreto!");
    }
  }

  for (let i = 0; i < cards2.length; i++) {
    if (!rules.cardsValues.find((value) => value === cards2[i].substring(0, cards2[i].length - 1))) {
      throw new AppError("O valor das cartas está incorreto!");
    }
  }

  return next();
}