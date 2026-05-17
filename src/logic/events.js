export const penalties = [
  { text: "Barraca mal esticada acumulou água da chuva na madrugada. Perde 15 PUP.", pupChange: -15, stepChange: 0 },
  { text: "A unidade conversou e fez barulho após o toque de recolher. Perde 20 PUP.", pupChange: -20, stepChange: 0 },
  { text: "Lixo encontrado fora da lixeira na área do seu acampamento. Volte 2 casas.", pupChange: 0, stepChange: -2 },
  { text: "Atraso da unidade para a inspeção matinal da diretoria. Volte 3 casas e perde 10 PUP.", pupChange: -10, stepChange: -3 },
  { text: "Ferramenta do portal (machadinha/pá) deixada exposta e sem proteção. Perde 15 PUP.", pupChange: -15, stepChange: 0 },
  { text: "Desbravador flagrado andando pelo acampamento sem o lenço oficial. Perde 20 PUP.", pupChange: -20, stepChange: 0 }
];

export const bonuses = [
  { text: "Sua unidade ganhou o concurso de melhor Portal de pioneiria do subcampo! Ganhe 30 PUP.", pupChange: 30, stepChange: 0 },
  { text: "Cozinha da unidade impecável e alimentos armazenados corretamente na inspeção. Ganhe 20 PUP.", pupChange: 20, stepChange: 0 },
  { text: "A unidade se destacou pelo respeito e postura no civismo e hasteamento da bandeira. Avance 2 casas.", pupChange: 0, stepChange: 2 },
  { text: "Todos os membros da unidade com o lenço e uniforme de gala impecáveis. Ganhe 25 PUP.", pupChange: 25, stepChange: 0 },
  { text: "Fizeram o fogo regulamentar acender de primeira na especialidade de Fogueiras. Jogue novamente.", pupChange: 0, stepChange: 0, playAgain: true },
  { text: "Unidade demonstrou excelente liderança ajudando outro clube a erguer as barracas na chuva. Ganhe 30 PUP e avance 1 casa.", pupChange: 30, stepChange: 1 }
];

export const getRandomPenalty = () => {
  return penalties[Math.floor(Math.random() * penalties.length)];
};

export const getRandomBonus = () => {
  return bonuses[Math.floor(Math.random() * bonuses.length)];
};
