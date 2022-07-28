const ROW = 3;
const COLUMN = 3;
const firstPlayerIndicator = "0";
const secondPlayerIndicator = "1";
const BR = document.createElement('br');
const PLAYGROUND = document.getElementById('playground')
const RESULT = document.getElementById('result')

let cases = new Array(ROW).fill(null).map(() => new Array(COLUMN).fill(null));
let numberCasePlayerOne = 0;
let numberCasePlayerTwo = 0;
let pion = firstPlayerIndicator;

const tooglePion = () => {
    if (pion === firstPlayerIndicator) {
        pion = secondPlayerIndicator;
        numberCasePlayerOne++;
    } else {
        pion = firstPlayerIndicator;
        numberCasePlayerTwo++;
    }
}

const buttonClicked = (e) => {
    e.preventDefault();
    const button = e.target;

    if (button.innerText === firstPlayerIndicator || button.innerText === secondPlayerIndicator) {
        return;
    }

    if (pion === firstPlayerIndicator) { button.classList.remove('btn-secondary'); button.classList.add('btn-danger') }
    if (pion === secondPlayerIndicator) { button.classList.remove('btn-secondary'); button.classList.add('btn-primary') }

    button.innerText = pion;
    button.classList.add('disabled');
    tooglePion()

    if (numberCasePlayerOne >= 3 || numberCasePlayerTwo >= 3) {
        checkAlignPion()
    }
}

const checkAlignPion = () => {
    let hasWinner = false;
    let winner = "None";
    let matrix = getPlayGroundData(cases);

    let diagonals = Array(3).fill(null);
    let antiDiagonals = Array(3).fill(null);

    diagonals = getDiagonal(matrix);
    antiDiagonals = getDiagonal(matrix.slice(), true);

    for (let i = 0; i < ROW; i++) {
        const Row = getRow(matrix, i);
        const Col = getCol(matrix, i);

        if (equals(Row)) {
            hasWinner = true;
            winner = Row[0] === firstPlayerIndicator ? "Player one" : "Player two";
            break;
        }

        if (equals(Col)) {
            hasWinner = true;
            console.log(Col);
            winner = Col[0] === firstPlayerIndicator ? "Player one" : "Player two";
            break;
        }
    }

    if (hasWinner) {
        showWinner(winner);
    } else if (equals(diagonals)) {
        showWinner(getPlayerName(diagonals[0]));
    } else if (equals(antiDiagonals)) {
        showWinner(getPlayerName(antiDiagonals[0]));
    } else if ((numberCasePlayerOne + numberCasePlayerTwo) === ROW * COLUMN) {
        RESULT.innerText = `Match equal`;
    }
}

const getPlayerName = (pion) => {
    return pion === firstPlayerIndicator ? "Player one" : "Player two";
}

const showWinner = (winnerName) => {
    RESULT.innerText = `${winnerName} win`;
    blockPlayground(cases);
}

const blockPlayground = (cases) => {
    for (let i = 0; i < ROW; i++) {
        for (j = 0; j < COLUMN; j++) {
            cases[i][j].classList.add('disabled');
        }
    }
}

const getPlayGroundData = (array) => {
    let temp = new Array(ROW).fill(null).map(() => new Array(COLUMN).fill(null));
    for (let i = 0; i < ROW; i++) {
        for (j = 0; j < COLUMN; j++) {
            const text = array[i][j].innerText;
            temp[i][j] = text === "" ? null : text;
        }
    }
    return temp;
}

const equals = (arr) => {
    return arr.every(val => (val === arr[0] && val !== null))
}

const getRow = (matrix, row) => {
    return matrix[row]; // return column data..
}

const getCol = (matrix, col) => {
    return matrix.map((x) => x[col]);
}

const getDiagonal = (matrix, anti = false) => {
    let diag = [];
    if (anti === true) {
        diag.push(matrix[2][0]);
        diag.push(matrix[1][1]);
        diag.push(matrix[0][2]);
        return diag;
    }

    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COLUMN; j++) {
            if (i === j) diag.push(matrix[i][j])
        }
    }
    return diag;
}

const resetPlayGround = () => {
    PLAYGROUND.innerHTML = null;
    RESULT.innerText = "No result yet";
    numberCasePlayerOne = 0;
    numberCasePlayerTwo = 0;
    pion = firstPlayerIndicator;
    generateAll();
}

const generatePlayGround = () => {
    for (let i = 0; i < ROW; i++) {
        for (j = 0; j < COLUMN; j++) {
            let button = document.createElement("button");
            button.classList.add('btn', 'btn-secondary', 'm-2', 'border-0', 'border-radius-sm', 'case');
            cases[i][j] = button
            PLAYGROUND.appendChild(button)
        }
        PLAYGROUND.appendChild(document.createElement('br'))
    }
}

const generatePlayGroundEvent = () => {
    for (let i = 0; i < ROW; i++) {
        for (j = 0; j < COLUMN; j++) {
            let btn = cases[i][j]
            btn.addEventListener('click', (e) => buttonClicked(e));
        }
    }
}

const generateAll = () => {
    generatePlayGround();
    generatePlayGroundEvent();
}

document.getElementById('reset-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if (numberCasePlayerOne > 0 || numberCasePlayerTwo > 0) {
        resetPlayGround();
    }
})

window.addEventListener('load', (e) => {
    e.preventDefault();
    generateAll();
})
