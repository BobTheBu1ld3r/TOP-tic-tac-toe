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

  const getBoard = () => board;

  const printBoard = () =>
    console.log(
      board.map((row) => row.map((cell) => cell.getToken())).join("\n")
    );

  return { initialize, addToken, getBoard, printBoard };
}

function Player(name, token) {
  return { name, token };
}

function GameController() {
  const players = [Player("Player One", "X"), Player("Player Two", "O")];

  return {};
}
