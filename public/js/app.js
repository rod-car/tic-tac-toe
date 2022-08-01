const ROW = 3;
const COLUMN = 3;

let firstPlayerIndicator = "0";
let secondPlayerIndicator = "1";

const BR = document.createElement('br');
const PLAYGROUND = document.getElementById('playground')
const RESULT = document.getElementById('result')

const PLAYER_ONE_SCORE = document.getElementById('player-one-score');
const PLAYER_TWO_SCORE = document.getElementById('player-two-score');
const FINAL_RESULT = document.getElementById('final-result');

const PLAYER_ONE_PSEUDO_INPUT = document.getElementById('player-one-pseudo');
const PLAYER_TWO_PSEUDO_INPUT = document.getElementById('player-two-pseudo');

const PLAYER_ONE_INDICATOR_INPUT = document.getElementById('player-one-indicator');
const PLAYER_TWO_INDICATOR_INPUT = document.getElementById('player-two-indicator');

let playerOneName = PLAYER_ONE_PSEUDO_INPUT.innerText === "" ? "Player One" : PLAYER_ONE_PSEUDO_INPUT.innerText;
let playerTwoName = PLAYER_TWO_PSEUDO_INPUT.innerText === "" ? "Player One" : PLAYER_TWO_PSEUDO_INPUT.innerText;

let pOnePseudo = document.getElementById('display-pseudo-one');
let pTwoPseudo = document.getElementById('display-pseudo-two');

PLAYER_ONE_SCORE.innerText = PLAYER_ONE_SCORE.innerText === "" ? 0 : parseInt(PLAYER_ONE_SCORE.innerText) ;
PLAYER_TWO_SCORE.innerText = PLAYER_TWO_SCORE.innerText === "" ? 0 : parseInt(PLAYER_TWO_SCORE.innerText) ;
FINAL_RESULT.innerText = FINAL_RESULT.innerText === "" ? "No result yet !!!" : FINAL_RESULT.innerText;

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
            winner = Row[0] === firstPlayerIndicator ? playerOneName : playerTwoName;
            break;
        }

        if (equals(Col)) {
            hasWinner = true;
            console.log(Col);
            winner = Col[0] === firstPlayerIndicator ? playerOneName : playerTwoName;
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
    return pion === firstPlayerIndicator ? playerOneName : playerTwoName;
}

const showWinner = (winnerName) => {
    RESULT.innerText = `${winnerName} win`;
    if (winnerName === playerOneName) PLAYER_ONE_SCORE.innerText = (parseInt(PLAYER_ONE_SCORE.innerText) + 1).toString(); 
    else if (winnerName === playerTwoName) PLAYER_TWO_SCORE.innerText = (parseInt(PLAYER_TWO_SCORE.innerText) + 1).toString();
    else throw new Error(`Player name must be ${playerOneName} OR ${playerTwoName}`);
    checkFinalResult();
    blockPlayground(cases);
}

const blockPlayground = (cases) => {
    for (let i = 0; i < ROW; i++) {
        for (j = 0; j < COLUMN; j++) {
            cases[i][j].classList.add('disabled');
        }
    }
}

const checkFinalResult = () => {
    if (parseInt(PLAYER_ONE_SCORE.innerText) > parseInt(PLAYER_TWO_SCORE.innerText)) FINAL_RESULT.innerText = `${playerOneName} WIN !!!`
    else if (parseInt(PLAYER_ONE_SCORE.innerText) < parseInt(PLAYER_TWO_SCORE.innerText)) FINAL_RESULT.innerText = `${playerTwoName} WIN !!!`
    else if (parseInt(PLAYER_ONE_SCORE.innerText) === parseInt(PLAYER_TWO_SCORE.innerText)) FINAL_RESULT.innerText = `Match equal !!!`
    else throw new Error("Final result check fail, Score error");
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

document.getElementById('reset-game').addEventListener('click', (e) => {
    e.preventDefault();
    if (numberCasePlayerOne > 0 || numberCasePlayerTwo > 0) {
        resetPlayGround();
    }
})

document.getElementById('reset-score').addEventListener('click', (e) => {
    e.preventDefault();
    PLAYER_ONE_SCORE.innerText = (0).toString();
    PLAYER_TWO_SCORE.innerText = (0).toString();
    FINAL_RESULT.innerText = "No result yet !!!";
})

window.addEventListener('load', (e) => {
    e.preventDefault();
    generateAll();
    updateDisplayPseudo();
})

document.getElementById('save-pseudo').addEventListener('click', (e) => {
    e.preventDefault();
    if (PLAYER_ONE_PSEUDO_INPUT.value !== "") playerOneName = PLAYER_ONE_PSEUDO_INPUT.value;
    if (PLAYER_TWO_PSEUDO_INPUT.value !== "") playerTwoName = PLAYER_TWO_PSEUDO_INPUT.value;
    if (playerOneName === playerTwoName && playerOneName !== "") {
        alert("The two player can't have the same pseudo");
        PLAYER_ONE_PSEUDO_INPUT.value = "";
        PLAYER_TWO_PSEUDO_INPUT.value = "";
        playerOneName = "Player One";
        playerTwoName = "Player Two";
    }
    updateDisplayPseudo();
})

document.getElementById('save-indicator').addEventListener('click', (e) => {
    e.preventDefault();
    if (PLAYER_ONE_INDICATOR_INPUT.value !== "") firstPlayerIndicator = PLAYER_ONE_INDICATOR_INPUT.value;
    if (PLAYER_TWO_INDICATOR_INPUT.value !== "") secondPlayerIndicator = PLAYER_TWO_INDICATOR_INPUT.value;

    if (firstPlayerIndicator === secondPlayerIndicator && firstPlayerIndicator !== "") {
        alert("The two player can't have the same indicator");
        PLAYER_ONE_INDICATOR_INPUT.value = "";
        PLAYER_TWO_INDICATOR_INPUT.value = "";
        firstPlayerIndicator = "0";
        secondPlayerIndicator = "1";
    }
    pion = firstPlayerIndicator;
})

const updateDisplayPseudo = () => {
    pOnePseudo.innerText = playerOneName;
    pTwoPseudo.innerText = playerTwoName;
}
