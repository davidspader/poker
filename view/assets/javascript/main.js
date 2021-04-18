const button = document.getElementById("button");
const feedback = document.getElementById("feedback");

button.addEventListener("click", async () => {
  const _data = {
    cards1: [],
    cards2: []
  }

  message = "";

  for (let i = 0; i < 5; i++) {
    _data.cards1.push(document.getElementsByName("cards1")[i].value);
    _data.cards2.push(document.getElementsByName("cards2")[i].value);
  }

  const response = await getResponse(_data);

  if (response.message) {
    message = response.message;
  } else if (response.error) {
    message = "ops, algo deu errado!";
  } else {
    const res = response.ruleResponse;

    switch (res.resultName) {
      case 'Carta mais alta':
        message = `A mão ${res.handWinner} ganhou com a ${res.resultName}: ${res.bestCard}`
        break;
      case 'Par':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} de ${res.combination1.card}`
        break;

      case 'Dois Pares':
        message = `A mão ${res.handWinner} ganhou com ${res.resultName} de ${res.combination1.card} e ${res.combination2.card}`
        break;

      case 'Trinca':
        message = `A mão ${res.handWinner} ganhou com uma ${res.resultName} de ${res.combination1.card}`
        break;

      case 'Straight':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} de ${res.firstCard} a ${res.lastCard}`
        break;

      case 'Flush':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} de ${res.suit}`
        break;

      case 'Full House':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} com `
        if (res.combination1.cardQuantity === 3) {
          message += `uma Trinca de ${res.combination1.card} e um Par de ${res.combination2.card}`
        } else {
          message += `uma Trinca de ${res.combination2.card} e um Par de ${res.combination1.card}`
        }
        break;

      case 'Quadra':
        message = `A mão ${res.handWinner} ganhou com uma ${res.resultName} de ${res.combination1.card}`
        break;

      case 'Straight Flush':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} de ${res.firstCard} a ${res.lastCard} do naipe ${res.suit}`
        break;
      case 'Royal Flush':
        message = `A mão ${res.handWinner} ganhou com um ${res.resultName} de ${res.firstCard} a ${res.lastCard} do naipe ${res.suit}`
        break;
    }
  }

  feedback.innerText = message;
})


async function getResponse(_data) {
  const rawResponse = await fetch('http://localhost:3333', {
    method: 'POST',
    body: JSON.stringify(_data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const content = await rawResponse.json();

  return content;
}
