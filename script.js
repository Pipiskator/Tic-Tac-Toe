const gameContainer = document.getElementById('game-container');
const turnInfo = document.getElementById('turn-info');
const resetButton = document.getElementById('reset-btn');

// Инициализация параметров игры
const SIZE = 20; // Размер поля
const WIN_CONDITION = 4; // Сколько знаков нужно в ряд
let board = [];
let currentPlayer = 'X'; // Текущий игрок
const players = ['X', 'O', 'A']; // Игроки
let gameOver = false;

// Создание игрового поля
function createBoard() {
    board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    gameContainer.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameContainer.appendChild(cell);
        }
    }
}

// Обработка клика по ячейке
function handleCellClick(event) {
    if (gameOver) return;
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (board[row][col]) return; // Ячейка уже занята

    // Установка символа текущего игрока
    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    // Проверка на победу
    const winningCells = checkWin(row, col);
    if (winningCells) {
        highlightWinningCells(winningCells);
        turnInfo.textContent = `Игрок ${currentPlayer} победил!`;
        gameOver = true;
        return;
    }

    // Переход хода
    currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length];
    turnInfo.textContent = `Ход игрока: ${currentPlayer}`;
}

// Подсветка выигрышных ячеек
function highlightWinningCells(cells) {
    cells.forEach(({ row, col }) => {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        if (cell) {
            cell.classList.add('winning');
        }
    });
}

// Проверка победы
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },  // Горизонталь
        { dr: 1, dc: 0 },  // Вертикаль
        { dr: 1, dc: 1 },  // Диагональ \
        { dr: 1, dc: -1 }  // Диагональ /
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        const winningCells = [{ row, col }];

        // Проверка в одном направлении
        for (let step = 1; step < WIN_CONDITION; step++) {
            const r = row + dr * step;
            const c = col + dc * step;
            if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === currentPlayer) {
                count++;
                winningCells.push({ row: r, col: c });
            } else {
                break;
            }
        }

        // Проверка в противоположном направлении
        for (let step = 1; step < WIN_CONDITION; step++) {
            const r = row - dr * step;
            const c = col - dc * step;
            if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === currentPlayer) {
                count++;
                winningCells.push({ row: r, col: c });
            } else {
                break;
            }
        }

        // Если набрали 4 подряд
        if (count >= WIN_CONDITION) {
            return winningCells;
        }
    }

    return null;
}

// Сброс игры
resetButton.addEventListener('click', () => {
    gameOver = false;
    currentPlayer = 'X';
    turnInfo.textContent = `Ход игрока: ${currentPlayer}`;
    createBoard();
});

// Инициализация игры
createBoard();
