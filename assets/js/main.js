var answer, wordStatus;
var mistakes = 0;
const max = 6;
const maxHint = 2;
var numHint = 0;
var guessed = [];

const words = [
    "test",
    "testtest"
]

const image = {
    "1": $("#head"),
    "2": $("#body1"),
    "3": $("#armL"),
    "4": $("#armR"),
    "5": $("#legL"),
    "6": $("#legR")
}

const kill = () => {
    dropBody();
    $("#rEyes").addClass("hide");
    $("#xEyes").removeClass("hide");
}

const dropBody = () => {
    $("#door1").velocity({ rotateZ: 90 }, 1000);
    $("#door2").velocity({ rotateZ: -90 }, 1000);
    fall();
}

const fall = () => {
    let dur = 500;
    let del = 1000;
    $("#body").velocity({ translateY: "200px" }, { duration: dur, delay: del });
    $("#rope").velocity({ y2: "+=200px" }, { duration: dur, delay: del });
    $("#armL").velocity({ y2: "-=60px" }, { duration: dur, delay: del });
    $("#armR").velocity({ y2: "-=60px" }, { duration: dur, delay: del });

    finish();
}

const finish = () => {
    $("#armL").velocity({ y2: "+=70px", x2: "+=10px" }, 250);
    $("#armR").velocity({ y2: "+=70px", x2: "-=10px" }, 250);
}

const randomWord = () => {
    $.get("https://random-word-api.herokuapp.com/word?swear=0", (word) => {
        answer = word[0];
        console.log("You're a cheater\n" + answer);
        guessedWord();
        updateMistakes();
        updateHints();
        setTimeout(() => {
            $(".loader").fadeOut(500, () => {
                $(".content").fadeIn(500);
            });
        }, 500);
    });
}

const generateButtons = () => {
    let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
        `
        <button
          class="guess"
          id='` + letter + `'
          onClick="handleGuess('` + letter + `')"
        >
          ` + letter + `
        </button>
      `).join('');

    $("#letters").html(buttonsHTML);
}

const handleGuess = (chosenLetter) => {
    if (answer.indexOf(chosenLetter) >= 0)
        if (guessed.includes(chosenLetter)) mistake();
        else right(chosenLetter);
    else if (answer.indexOf(chosenLetter) === -1)
        mistake();
}

const right = (chosenLetter) => {
    guessed.push(chosenLetter);
    guessedWord();
    checkIfGameWon();
}

const mistake = () => {
    mistakes++;
    updateHangman();
    updateMistakes();
    checkIfGameLost();
}

const updateHangman = () => {
    image[mistakes].removeClass("hide");
}

const checkIfGameLost = () => {
    if (mistakes === max) {
        $("#letters").html("You lost!<br>The answer was: \"<b>" + answer + "</b>\".<br><a onclick=\"reload()\">Play again!</a>");
        kill();
    }
}

const checkIfGameWon = () => {
    if (guessed.length === Array.from(new Set(answer.split(""))).length)
        $("#letters").html("You Won!<br><a onclick=\"reload()\">Play again!</a>");
}

const guessedWord = () => {
    $("#words").html(answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join(''));
}

const hint = () => {
    if (numHint < maxHint) {
        var randLet = randomLetter();
        guessed.push(randLet);
        numHint += 1;
        $("#words").html(answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join(''));
        updateHints();
        checkIfGameWon();
    }
}

const reload = () => {
    location.reload();
}

const randomLetter = () => {
    var letter = answer.split('')[Math.floor(Math.random() * answer.split('').length)];
    if (guessed.includes(letter))
        return randomLetter();
    else
        return letter;
}

const updateHints = () => {
    $("#rHints").text(`${Math.abs(numHint-maxHint)}/${maxHint}`)
}

const updateMistakes = () => {
    $("#mistakes").text(mistakes);
}

$(document).ready(() => {
    randomWord();
    generateButtons();
});