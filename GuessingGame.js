var Game = function() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}


function generateWinningNumber() {
    return Math.floor(Math.random()*100 + 1)
}


function newGame() {
    return new Game();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (guess < 1 || guess > 100 || typeof guess !== 'number') {
        throw "Please try again with a number between 1 and 100.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
    
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!"
    } else if (this.pastGuesses.includes(this.playersGuess)) {
       return "You already guessed " + this.playersGuess + '!';
    } else if (this.playersGuess != this.winningNumber) {
        if (this.pastGuesses.length === 4) {
            this.pastGuesses.push(this.playersGuess);
            return "Nope! The number was " + this.winningNumber + ". Better luck next time!";
        } else {
            if (this.difference() < 10) {
                this.pastGuesses.push(this.playersGuess);
                return 'You\'re really close!';
            } else if (this.difference() < 25) {
                this.pastGuesses.push(this.playersGuess);
                return 'That\'s not too far off. Try again!';
            } else if (this.difference() < 50) {
                this.pastGuesses.push(this.playersGuess);
                return 'Nope, but we\'ll give you a hint: it\'s within 50 of that guess!';
            } else if (this.difference() < 100) {
                this.pastGuesses.push(this.playersGuess);
                return 'That\'s nowhere near the right number. But try again. You have ' + (5 - this.pastGuesses.length) + " guess(es) left!";
            } 
        }
    } 
}

Game.prototype.provideHint = function() {
    var hints = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hints);
}

function shuffle(arr) { 
    var n = arr.length, t, i;
    while (n) {
        i = Math.floor(Math.random() * n--);
        t = arr[n];
        arr[n] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function makeGuess(game) {
    var currentGuess = +$('.guess').val();
    $('.guess').val('');
    var output = game.playersGuessSubmission(currentGuess);
    console.log(output);
}

$(document).ready(function() {
    var game = newGame();
    $('#submit-button').on('click', function(){
        makeGuess(game);
    });
    $('.guess').keypress(function(event) {
        if (event.which == 13) {
           makeGuess(game);
        }
    })
});