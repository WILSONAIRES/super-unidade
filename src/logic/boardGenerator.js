const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const generateBoard = () => {
  const board = [];
  
  // Casa 0 (Largada - Start)
  board.push({ id: 0, type: 'START' });

  // 12 blocks of 5 houses = 60 houses total
  // Each block contains: 1 Quiz Físico, 1 Quiz Mental, 1 Quiz Espiritual, 1 Penalidade, 1 Bônus
  // This ensures no house is empty/neutral!
  let houseId = 1;
  for (let block = 0; block < 12; block++) {
    const blockHouses = ['QUIZ_FISICO', 'QUIZ_MENTAL', 'QUIZ_ESPIRITUAL', 'PENALTY', 'BONUS'];
    shuffleArray(blockHouses);

    for (let i = 0; i < 5; i++) {
      board.push({
        id: houseId,
        type: houseId === 60 ? 'FINISH' : blockHouses[i]
      });
      houseId++;
    }
  }

  // Ensure house 60 is strictly FINISH
  if (board[60]) {
    board[60].type = 'FINISH';
  }

  return board;
};
