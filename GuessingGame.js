var Game = function() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}


function generateWinningNumber() {
    return Math.floor(Math.random()*100 + 1);
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
    if (guess < 1 || guess > 100 || typeof guess !== 'number' || Number.isNaN(guess)) {
        return "Please try again with a number between 1 and 100.";
    }
    this.playersGuess = guess;
    if (this.pastGuesses.includes(this.playersGuess)) {
        return "You already guessed " + this.playersGuess + '!';
    } else {
        this.pastGuesses.push(this.playersGuess);
        var latestGuess = $('#guesses li:nth-child('+ this.pastGuesses.length +')');
        latestGuess.text(this.playersGuess);
        latestGuess.addClass('guess-active');
    }
    return this.checkGuess();
    
}

Game.prototype.checkGuess = function() {
    if (this.pastGuesses.length < 5) {
        var nudge = '';
        if (this.isLower()) {
            nudge = 'higher';
        } else {
            nudge = 'lower';
        }
        if (this.playersGuess === this.winningNumber) {
            $('#hint, #submit').hide();
            return "You Win!";
        } else if (this.difference() < 10) {
            return 'You\'re really close! Try going ' + nudge + '!';
        } else if (this.difference() < 25) {
            return 'That\'s not too far off. Try again but ' + nudge + ' this time!';
        } else if (this.difference() <= 50) {
            return 'Nope, but we\'ll give you a hint: it\'s within 50 of that guess!';
        } else if (this.difference() < 100) {
            return 'Sorry, that\'s nowhere near the right number.';
        } 
    }
    $('#hint, #submit').hide();
    return "The number was " + this.winningNumber + ". Better luck next time!";
}


Game.prototype.provideHint = function() {
    var hint1 = this.winningNumber;
    let hints = [hint1];
    while (hints.length < 3) {
        let newNum = generateWinningNumber();
        if (!hints.includes(newNum)) {
            hints.push(newNum);
        }
    }
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
    $('.instructions').addClass('header-active');
    $('.instructions').text(output);
}

$(document).ready(function() {
    var game = newGame();
    $('#submit').on('click', function(){
        makeGuess(game);
    });
    $('.guess').keypress(function(event) {
        if (event.which == 13) {
           makeGuess(game);
        }
    })
    $('#hint').on('click', function() {
        var myHints = game.provideHint();
        $('.instructions').text("The answer is " +myHints[0]+ ", " +myHints[1]+ ", or " +myHints[2]+"");
        $('#hint').hide();
    })
    $('#reset-button').click(function() {
        game = newGame();
        $('.instructions').removeClass('header-active');
        $('.instructions').text('Guess a number between 1-100!')
        $('#guesses li').removeClass('guess-active');
        $('#guesses li').text('-');
        $('#hint, #submit').show();
    })
});