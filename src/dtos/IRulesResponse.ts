interface ICombination {
  card: string;
  cardQuantity: number;
}

interface IRulesResponse {
  error: boolean;
  ruleResponse?: {
    suit?: string;
    bestCard?: string;
    firstCard?: string;
    lastCard?: string;
    combination1?: ICombination;
    combination2?: ICombination;
    resultName?: string;
    resultPosition?: number;
    handWinner?: number;

  }
}

export { IRulesResponse }