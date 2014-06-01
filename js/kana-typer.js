KT.Round = function () {};

KT.Round.prototype.resetColor = function () {
	$('#answer-input').css('color', 'rgba(100, 0, 100, 1)');
};

KT.Round.prototype.displayRound = function () {
	var mode = sessionStorage.mode;
	var syllabary = sessionStorage.syllabary;
	var prompt = $('#prompt');
	var helper = $('#helper');
	var input = $('#answer-input');

	this.resetColor();
	input.val('').focus();

	if (mode === 'typing') {
		prompt.css('font-size', '8em');
		prompt.html(this.kana.sound).css('display', 'none').fadeIn();
		helper.html(this.kana.helper).css('display', 'none').css('visibility', 'visible').fadeIn();
	} else if (mode === 'reading') {
		prompt.css('font-size', '10.75em');
		if (syllabary === 'hiragana') {
			prompt.html(this.kana.hiragana).css('display', 'none').fadeIn();
			helper.css('display', 'none');
		} else if (syllabary === 'katakana') {
			prompt.html(this.kana.katakana).css('display', 'none').fadeIn();
			helper.css('display', 'none');
		}
	}
	input.css('display', 'none').fadeIn();
};

KT.Round.prototype.checkAnswer = function () {
	var syllabary = sessionStorage.syllabary;
	var mode = sessionStorage.mode;
	var input = $('#answer-input');

	var answer = input.val();

	if (mode === 'typing') {
		var correctKana = this.kana[syllabary];
		if (answer === correctKana) {
			this.updateScore('correct');
			round = KT.createRound();
			round.displayRound();
		} else {
			this.updateScore('incorrect');
			input.css('color', 'red');
			console.log('incorrect input');
			console.log('correct answer: ' + correctKana);	
		}
	} else if (mode === 'reading') {
		var correctSound = this.kana.sound;
		if (answer === correctSound) {
			this.updateScore('correct');
			round = KT.createRound();
			round.displayRound();
		} else {
			this.updateScore('incorrect');
			input.css('color', 'red');
			console.log('incorrect input');
			console.log('correct answer: ' + correctSound);	
		}
	}
};

KT.Round.prototype.setSyllabary = function (syllabary) {
	var mode = sessionStorage.mode;
	console.log('setting syllabary to ' + syllabary);
	$('.toggle-syllabary').removeClass('selected');
	$('#toggle-' + syllabary).toggleClass('selected');

	sessionStorage.syllabary = syllabary;
	this.setPlaceholder();
};

KT.Round.prototype.setMode = function (mode) {
	var syllabary = sessionStorage.syllabary;
	console.log('setting mode to ' + mode);
	$('.toggle-mode').removeClass('selected');
	$('#toggle-' + mode).toggleClass('selected');

	sessionStorage.mode = mode; 
	this.setPlaceholder();
}

KT.Round.prototype.setPlaceholder = function () {
	var syllabary = sessionStorage.syllabary;
	var mode = sessionStorage.mode;
	var input = $('#answer-input')

	if (mode === 'reading') {
		input.css('font-size', '5.65em');
		input.attr('placeholder', 'romaji');
	} else if (syllabary === 'hiragana' && mode === 'typing') {
		input.css('font-size', '8em');
		input.attr('placeholder', 'かな');
	}
	else if (syllabary === 'katakana' && mode === 'typing') {
		input.css('font-size', '8em');
		input.attr('placeholder', 'カナ');
	}
}

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

	if (sessionStorage.syllabary === 'hiragana' && !kana[r].hiragana) {
		this.getRandKana();
	} else {
		return kana[r];
	}
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
round.setSyllabary('hiragana');
round.setMode('typing');
round.displayRound();

$('#answer-input').keypress(function (e) {
	if (e.which == 13 && $(this).val()) {
		round.checkAnswer();
	}
});

$('.toggle-syllabary').click(function (e) {
	e.preventDefault();
	round.setSyllabary($(this).data('value'));
	console.log(round.kana.hiragana);
	round = KT.createRound();
	round.displayRound();
});

$('.toggle-mode').click(function (e) {
	e.preventDefault();
	round.setMode($(this).data('value'));
	round = KT.createRound();
	round.displayRound();
});

$('#skip').click(function (e) {
	e.preventDefault();
	round = KT.createRound();
	round.displayRound();
});