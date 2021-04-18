import { Request, response, Response } from "express";
import { IRulesResponse } from "../dtos/IRulesResponse";
import { Rules } from "../models/Rules"

class RulesController {

  handle(request: Request, response: Response): Response {

    const { cards1 } = request.game;
    const { cards2 } = request.game;

    const rules = new Rules();

    const hand1 = getHandResult(cards1, rules);
    const hand2 = getHandResult(cards2, rules);

    const result = compare(hand1, hand2);

    return response.json(result);
  }
}

function compare(response1: IRulesResponse, response2: IRulesResponse): IRulesResponse {
  if (response1.ruleResponse.resultPosition < response2.ruleResponse.resultPosition) {
    response1.ruleResponse.handWinner = 1;
    return response1;
  } else if (response1.ruleResponse.resultPosition > response2.ruleResponse.resultPosition) {
    response2.ruleResponse.handWinner = 2;
    return response2;
  } else {
    if (response1.ruleResponse.bestCard > response2.ruleResponse.bestCard) {
      response1.ruleResponse.handWinner = 1;
      return response1;
    }
    else if (response1.ruleResponse.bestCard < response2.ruleResponse.bestCard) {
      response2.ruleResponse.handWinner = 2;
      return response2;
    }
  }
}

function getHandResult(cards: string[], rules: Rules): IRulesResponse {
  const bestCard = rules.getBestCard(cards);

  const equalsCards = rules.getEqualsCards(cards);

  if (!equalsCards.error) {
    equalsCards.ruleResponse.bestCard = bestCard.ruleResponse.bestCard;
    return equalsCards;
  }

  const straight = rules.getSequence(cards);
  const flush = rules.getFlush(cards);

  if (!straight.error && !flush.error) {
    const straightFlush = rules.getStraightFlush(cards);

    if (!straightFlush.error) {
      const royalFlush = rules.getRoyalFlush(cards);

      if (!royalFlush.error) {
        royalFlush.ruleResponse.bestCard = bestCard.ruleResponse.bestCard;
        return royalFlush;
      }
      straightFlush.ruleResponse.bestCard = bestCard.ruleResponse.bestCard;
      return straightFlush;
    }
  } else if (!straight.error && flush.error) {
    straight.ruleResponse.bestCard = bestCard.ruleResponse.bestCard;
    return straight;
  } else if (straight.error && !flush.error) {
    flush.ruleResponse.bestCard = bestCard.ruleResponse.bestCard;
    return flush;
  }
  return bestCard;
}

export { RulesController }