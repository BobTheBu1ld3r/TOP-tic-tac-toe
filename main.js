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
  const board = GameBoard();
  board.initialize();

  const players = [Player("Player One", "X"), Player("Player Two", "O")];

  let currentPlayer = players[0];

  const switchCurrentPlayer = () =>
    (currentPlayer = Object.is(currentPlayer, players[0])
      ? players[1]
      : players[0]);

  const getCurrentPlayer = () => currentPlayer;
  let gameState = "start";

  const playRound = (row, column) => {
    board.addToken(row, column, currentPlayer.token);
    switchCurrentPlayer();
  };

  return { getCurrentPlayer, playRound };
}
