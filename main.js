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

    return winStates.some((winState) =>
      winState.every((point) => {
        [row, column] = [...point];
        return board[row][column].getToken() === token;
      })
    );
  };

  const isDraw = () =>
    board.every((row) => row.every((cell) => cell.getToken() !== " "));

  return { initialize, addToken, getBoard, printBoard, isWin, isDraw };
}

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
    players[0].score = 0;
    players[1].name = playerTwoName;
    players[1].score = 0;
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

  const getPlayers = () => players;

  const getGameState = () => gameState;

  const gameEndInfo = {};

  const getEndGameInfo = () => gameEndInfo;

  const playRound = (row, column) => {
    board.addToken(row, column, currentPlayer.token);
    if (board.isWin(currentPlayer.token)) {
      currentPlayer.score++;
      gameState = gameStates[2];
      gameEndInfo.endState = "win";
      gameEndInfo.winnerName = currentPlayer.name;
    } else if (board.isDraw()) {
      gameState = gameStates[2];
      gameEndInfo.endState = "draw";
    }
    switchCurrentPlayer();
  };

  startGame();

  return {
    getCurrentPlayer,
    getPlayers,
    getGameState,
    getEndGameInfo,
    playRound,
    startGame,
    rematch,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const board = game.getBoard();
  const gameEndScreen = document.querySelector(".game-end-screen");
  const gameStartScreen = document.querySelector(".start-page");

  let playerNames = [];
  function submitPlayerName() {
    const input = document.querySelector("input");
    if (!input.value) return;
    playerNames.push(input.value);
    input.value = "";
    const label = document.querySelector("label");
    if (playerNames.length == 2) {
      label.textContent = "Player One Name";
      game.startGame(...playerNames);
      renderBoard();
      playerNames = [];
      gameStartScreen.classList.remove("visible");
      return;
    }
    label.textContent = "Player Two Name";
  }

  const nameSubmitButton = document.querySelector(".submit");
  nameSubmitButton.addEventListener("click", submitPlayerName);
  window.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      console.log("hi");
      submitPlayerName();
    }
  });

  const renderBoard = () => {
    const curentPlayerDisplay = document.querySelector(
      ".current-player-display"
    );
    curentPlayerDisplay.textContent = `${game.getCurrentPlayer().name}'s turn`;

    const playerOneName = document.querySelector(".player-one-name");
    playerOneName.textContent = game.getPlayers()[0].name;

    const playerTwoName = document.querySelector(".player-two-name");
    playerTwoName.textContent = game.getPlayers()[1].name;

    const playerOneScore = document.querySelector(".player-one-score");
    playerOneScore.textContent = game.getPlayers()[0].score;

    const playerTwoScore = document.querySelector(".player-two-score");
    playerTwoScore.textContent = game.getPlayers()[1].score;

    const boardDiv = document.querySelector(".board");
    boardDiv.textContent = "";
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.dataset.rowIndex = rowIndex;
        newCell.dataset.columnIndex = columnIndex;
        const token = document.createElement("div");
        if (cell.getToken() === "X") {
          token.classList.add("cross");
          token.textContent = "✕";
        } else if (cell.getToken() === "O") token.classList.add("circle");
        newCell.appendChild(token);
        newCell.addEventListener("click", cellClickHandler);
        boardDiv.appendChild(newCell);
      });
    });
  };

  renderBoard();

  const rematchButton = document.querySelector(".rematch");
  rematchButton.addEventListener("click", rematchClickHandler);
  const restartButton = document.querySelectorAll(".restart");
  restartButton.forEach((button) =>
    button.addEventListener("click", restartClickHandler)
  );

  function cellClickHandler(e) {
    const targetCell = e.target;
    game.playRound(targetCell.dataset.rowIndex, targetCell.dataset.columnIndex);
    renderBoard();
    if (game.getGameState() === "gameEnd") {
      gameEndScreen.classList.add("visible");
      rematchButton.focus();
      let winnerMessage;
      const gameEndInfo = game.getEndGameInfo();
      console.log(gameEndInfo.endState);
      if (gameEndInfo.endState === "win")
        winnerMessage = `${gameEndInfo.winnerName} has won`;
      else winnerMessage = `It's a draw`;
      const winnerMessageDisplay = document.querySelector(".winner-message");
      winnerMessageDisplay.textContent = winnerMessage;
    }
  }

  function rematchClickHandler() {
    game.rematch();
    gameEndScreen.classList.remove("visible");
    renderBoard();
  }

  function restartClickHandler() {
    gameEndScreen.classList.remove("visible");
    gameStartScreen.classList.add("visible");
  }
}

ScreenController();
