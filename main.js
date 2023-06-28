function Cell() {
  let token = " ";

  const getToken = () => token;

  const addToken = (playerToken) => (token = playerToken);

  return { getToken, addToken };
}

function GameBoard() {
  const board = [];

  const initialize = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i][j] = Cell();
      }
    }
  };

  const addToken = (row, column, token) => {
    const targetCell = board[row][column];
    if (targetCell.getToken() !== " ") return;
    targetCell.addToken(token);
  };

  return { initialize, addToken };
}
