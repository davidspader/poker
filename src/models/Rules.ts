import { IRulesResponse } from "../dtos/IRulesResponse";

class Rules {

  suits: string[] = ["D", "H", "S", "C"];

  cardsValues: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  getHandCardsValues(cards: string[]): string[] {
    const handCardValues = cards.map(function (value) {
      return value.substring(0, value.length - 1);
    })
    return handCardValues;
  }

  getHandCardsSuits(cards: string[]): string[] {
    const handCardSuits = cards.map(function (value) {
      return value.slice(-1);
    })
    return handCardSuits;
  }

  getCardsOrderByValue(cards: string[]): string[] {
    const handCardsValues = this.getHandCardsValues(cards);
    for (let i = 0; i < handCardsValues.length; i++) {
      if (handCardsValues[i] === "J") {
        handCardsValues[i] = "11";
      } else if (handCardsValues[i] === "Q") {
        handCardsValues[i] = "12";
      } else if (handCardsValues[i] === "K") {
        handCardsValues[i] = "13";
      } else if (handCardsValues[i] === "A") {
        handCardsValues[i] = "14";
      }
    }
    return handCardsValues.sort(function (a, b) { return Number(a) - Number(b) });
  }

  getBestCard(cards: string[]): IRulesResponse {
    let indexBestCard: number = -1;
    let bestCard: string;

    for (let i = 0; i < cards.length; i++) {
      for (const [key, value] of Object.entries(this.cardsValues)) {
        if (cards[i].substring(0, cards[i].length - 1) === value) {
          if (indexBestCard < Number(key)) {
            indexBestCard = Number(key);
            bestCard = cards[i];
          }
        }
      }
    }
    const response = {
      error: false,
      ruleResponse: {
        bestCard,
        resultName: "Carta mais alta",
        resultPosition: 10
      }
    }
    return response;
  }

  getEqualsCards(cards: string[]): IRulesResponse {
    const handCardsValues = this.getHandCardsValues(cards);

    let cardsFound = [];

    for (let i = 0; i < handCardsValues.length; i++) {

      const cardLength = handCardsValues.filter(function (value) { return value === handCardsValues[i]; }).length;
      if (cardLength > 1) {
        if (!cardsFound.find((value) => value[0] === handCardsValues[i])) {
          cardsFound.push([handCardsValues[i], cardLength]);
        }
      }
    }
    if (cardsFound.length === 0) {
      return { error: true }
    }



    const response: IRulesResponse = {
      error: false,
      ruleResponse: {
        combination1: {
          card: cardsFound[0][0],
          cardQuantity: cardsFound[0][1],
        }
      }
    }

    if (cardsFound[1]) {
      Object.assign(response.ruleResponse, {
        combination2: {
          card: cardsFound[1][0],
          cardQuantity: cardsFound[1][1]
        }
      });
    }

    const cardQuantity1 = cardsFound[0][1];

    if (!cardsFound[1]) {
      if (cardQuantity1 === 2) {
        response.ruleResponse.resultName = "Par";
        response.ruleResponse.resultPosition = 9;
      } else if (cardQuantity1 === 3) {
        response.ruleResponse.resultName = "Trinca";
        response.ruleResponse.resultPosition = 7;
      }
      else if (cardQuantity1 === 4) {
        response.ruleResponse.resultName = "Quadra";
        response.ruleResponse.resultPosition = 3;
      }
    } else {
      const cardQuantity2 = cardsFound[1][1];
      if (cardQuantity1 === 2 && cardQuantity2 === 2) {
        response.ruleResponse.resultName = "Dois Pares";
        response.ruleResponse.resultPosition = 8;
      } else if (cardQuantity1 === 3 && cardQuantity2 === 2 || cardQuantity1 === 2 && cardQuantity2 === 3) {
        response.ruleResponse.resultName = "Full House";
        response.ruleResponse.resultPosition = 4;
      }
    }

    return response;
  }

  getSequence(cards: string[]): IRulesResponse {
    const cardsOrder = this.getCardsOrderByValue(cards);

    const lastSequenceNumber = Number(cardsOrder[0]) + 4;

    if (Number(cardsOrder[4]) === lastSequenceNumber) {
      const response = {
        error: false,
        ruleResponse: {
          firstCard: cardsOrder[0],
          lastCard: cardsOrder[4],
          resultName: "Straight",
          resultPosition: 6
        }
      }
      return response;
    }

    return { error: true }
  }

  getFlush(cards: string[]): IRulesResponse {
    const handCardsSuits = this.getHandCardsSuits(cards);
    const cardSuitLength = handCardsSuits.filter(function (value) { return value === handCardsSuits[0]; }).length;
    if (cardSuitLength != 5) {
      return { error: true }
    }

    const response = {
      error: false,
      ruleResponse: {
        suit: handCardsSuits[0],
        resultName: "Flush",
        resultPosition: 5
      }
    }

    return response;
  }

  getStraightFlush(cards: string[]): IRulesResponse {
    const sequenceTest = this.getSequence(cards);

    if (sequenceTest.error) {
      return { error: true }
    }

    const suitTest = this.getFlush(cards);
    if (suitTest.error) {
      return { error: true }
    }

    const response = {
      error: false,
      ruleResponse: {
        firstCard: sequenceTest.ruleResponse.firstCard,
        lastCard: sequenceTest.ruleResponse.lastCard,
        suit: suitTest.ruleResponse.suit,
        resultName: "Straight Flush",
        resultPosition: 2
      }
    }

    return response;
  }

  getRoyalFlush(cards: string[]): IRulesResponse {
    const straightFlush = this.getStraightFlush(cards);

    if (straightFlush.error) {
      return { error: true }
    }

    if (straightFlush.ruleResponse.firstCard === "10" && straightFlush.ruleResponse.lastCard === "14") {
      const response = {
        error: false,
        ruleResponse: {
          firstCard: straightFlush.ruleResponse.firstCard,
          lastCard: straightFlush.ruleResponse.lastCard,
          suit: straightFlush.ruleResponse.suit,
          resultName: "Royal Flush",
          resultPosition: 1
        }
      }

      return response;
    }

    return { error: true }
  }

}
export { Rules }