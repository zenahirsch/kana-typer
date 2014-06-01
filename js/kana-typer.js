KT.Round = function () {};

KT.Round.prototype.resetColor = function () {
	$('#kana-input').css('color', 'rgba(100, 0, 100, 1)');
};

KT.Round.prototype.displayRound = function () {
	this.resetColor();
	$('#kana-input').val('').fadeIn().focus();
	$('#sound').html(this.kana.sound).css('display', 'none').fadeIn();
	$('#helper').html(this.kana.helper).css('display', 'none').fadeIn();
	$('#kana-input').css('display', 'none').fadeIn();
};

KT.Round.prototype.checkAnswer = function () {
	var mode = sessionStorage.mode;
	var correctKana = this.kana[mode];
	var answer = $('#kana-input').val();

	if (answer === correctKana) {
		this.updateScore('correct');
		round = KT.createRound(sessionStorage.mode);
		round.displayRound();
	} else {
		this.updateScore('incorrect');
		$('#kana-input').css('color', 'red');
		console.log('incorrect input');
		console.log('correct answer: ' + correctKana);	
	}
};

KT.Round.prototype.setMode = function (mode) {
	console.log('setting mode to ' + mode);
	$('.toggle').removeClass('selected');
	$('#toggle-' + mode).toggleClass('selected');
	if (mode === 'hiragana') {
		$('#kana-input').attr('placeholder', 'かな');
	}
	else if (mode === 'katakana') {
		$('#kana-input').attr('placeholder', 'カナ');
	}
	sessionStorage.mode = mode;
};

KT.Round.prototype.setUpScoreBoard = function () {
	sessionStorage.correct = 0;
	sessionStorage.incorrect = 0;
};

KT.Round.prototype.displayScore = function () {
	$('#score-correct').html(sessionStorage.correct);
	$('#score-incorrect').html(sessionStorage.incorrect);
}

KT.Round.prototype.updateScore = function (result) {
	var correct = Number(sessionStorage.correct);
	var incorrect = Number(sessionStorage.incorrect);

	if (result === 'correct') {
		sessionStorage.correct = correct + 1;
	} else if (result === 'incorrect') {
		sessionStorage.incorrect = incorrect + 1;
	}

	this.displayScore();
};

KT.getRandKana = function () {
	var kana = this.kana;
	var r = Math.floor(Math.random() * this.kana.length);
	return kana[r];
};

KT.createRound = function () {
	var round = Object.create(KT.Round.prototype, {
		'kana': {
			value: this.getRandKana(),
			writable: false
		}
	});

	return round;
};

var round = KT.createRound();
round.setUpScoreBoard();
round.setMode('hiragana');
round.displayRound();

$('#kana-input').keypress(function (e) {
	if (e.which == 13 && $(this).val()) {
		round.checkAnswer();
	}
});

$('.toggle').click(function (e) {
	e.preventDefault();
	round.setMode($(this).data('value'));
});

$('#skip').click(function (e) {
	e.preventDefault();
	round = KT.createRound();
	round.displayRound();
});