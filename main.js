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

  const isWin = (token) => {
    const winStates = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [2, 0],
        [1, 1],
        [0, 2],
      ],
    ];

    console.log(
      winStates.some((winState) =>
        winState.every((point) => {
          [row, column] = [...point];
          return board[row][column].getToken() === token;
        })
      )
    );
  };

  return { initialize, addToken, getBoard, printBoard, isWin };
}

const game = GameBoard();
game.initialize();
game.isWin("X");
game.addToken(2, 0, "X");
game.printBoard();
game.addToken(1, 1, "X");
game.printBoard();
game.isWin("X");
game.addToken(0, 2, "X");
game.printBoard();
game.isWin("X");

function Player(name, token) {
  return { name, token, score: 0 };
}

function GameController() {
  const board = GameBoard();
  board.initialize();

  const players = [Player("Player One", "X"), Player("Player Two", "O")];

  let startPlayer = players[0];
  let currentPlayer;
  const gameStates = ["start", "play", "gameEnd"];
  let gameState = gameStates[0];

  const startGame = (playerOneName, playerTwoName) => {
    players[0].name = playerOneName;
    players[1].name = playerTwoName;
    startPlayer = players[0];
    currentPlayer = startPlayer;
    board.initialize();
    gameState = gameStates[1];
  };

  const rematch = () => {
    switchStartPlayer();
    currentPlayer = startPlayer;
    board.initialize();
    gameState = gameStates[1];
  };

  const switchStartPlayer = () =>
    (startPlayer = Object.is(startPlayer, players[0])
      ? players[1]
      : players[0]);

  const switchCurrentPlayer = () =>
    (currentPlayer = Object.is(currentPlayer, players[0])
      ? players[1]
      : players[0]);

  const getCurrentPlayer = () => currentPlayer;

  const getGameState = () => gameState;

  const playRound = (row, column) => {
    board.addToken(row, column, currentPlayer.token);
    switchCurrentPlayer();
  };

  return { getCurrentPlayer, getGameState, playRound, startGame, rematch };
}
