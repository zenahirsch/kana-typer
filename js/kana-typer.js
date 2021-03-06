KT.Round = function () {};

KT.Round.prototype.resetInput = function () {
	this.setPlaceholder();
	$('#answer-input').css('color', 'rgba(100, 0, 100, 1)').val('').focus();
};

KT.Round.prototype.selectToggles = function (syllabary, mode) {
	$('.toggle-syllabary').removeClass('selected');
	$('#toggle-' + syllabary).addClass('selected');

	$('.toggle-mode').removeClass('selected');
	$('#toggle-' + mode).addClass('selected');
};

KT.Round.prototype.displayRound = function () {
	var mode = KT.getMode();
	var syllabary = KT.getSyllabary();
	console.log('the mode is: ' + mode);
	var prompt = $('#prompt');
	var helper = $('#helper');
	var input = $('#answer-input');

	this.resetInput();
	this.selectToggles(syllabary, mode);

	if (mode === 'typing') {
		prompt.css('font-size', '8em');
		if (this.kana[syllabary]) {
			prompt.html(this.kana.sound).css('display', 'none').fadeIn();
			helper.html(this.kana.helper).css('display', 'none').fadeIn();
		} else {
			round = KT.createRound();
			round.displayRound();
		}
	} else if (mode === 'reading') {
		prompt.css('font-size', '10.75em');
		helper.css('display', 'none');
		if (this.kana[syllabary]) {
			prompt.html(this.kana[syllabary]).css('display', 'none').fadeIn();
		} else {
			round = KT.createRound();
			round.displayRound();
		}
	}
	input.css('display', 'none').fadeIn();
};

KT.Round.prototype.checkAnswer = function () {
	var syllabary = KT.getSyllabary();
	var mode = KT.getMode();
	var input = $('#answer-input');
	var answer = input.val();

	if (mode === 'typing') {
		var correctKana = this.kana[syllabary];
		if (answer.toLowerCase() === correctKana.toLowerCase()) {
			this.updateScore('correct');
			round = KT.createRound();
			round.displayRound();
		} else {
			this.updateScore('incorrect');
			input.css('color', 'red');
		}
	} else if (mode === 'reading') {
		var correctSound = this.kana.sound;
		if (answer.toLowerCase() === correctSound.toLowerCase()) {
			this.updateScore('correct');
			round = KT.createRound();
			round.displayRound();
		} else {
			this.updateScore('incorrect');
			input.css('color', 'red');
		}
	}
};

KT.Round.prototype.setPlaceholder = function () {
	var syllabary = KT.getSyllabary();
	var mode = KT.getMode();
	var input = $('#answer-input');

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
};

KT.Round.prototype.setSyllabary = function (syllabary) {
	console.log('setting syllabary to ' + syllabary);
	var kana = JSON.parse(sessionStorage.kana);
	console.log('the kana in sessionStorage: ' + kana);
	this.setQueryString('syllabary', syllabary);
};

KT.Round.prototype.setMode = function (mode) {
	console.log('setting mode to ' + mode);
	this.setQueryString('mode', mode); 
};

KT.Round.prototype.setQueryString = function (param, value) {
	var hashStr = window.location.hash.substring(1);
	var queries = hashStr.split('&');
	var newStr = '';

	if (queries[0] === '') {
		queries[0] = 'syllabary=hiragana';
		queries[1] = 'mode=typing';
	}

	if (param === 'syllabary') {
		newStr = '' + param + '=' + value + '&' + queries[1];
	} else if (param === 'mode') {
		newStr = queries[0] + '&' + param + '=' + value;
	}

	console.log(newStr);
	window.location.hash = '#' + newStr;
};

KT.getMode = function () {
	var str = window.location.hash.substring(1);
	var queries = str.split('&');
	var i = 0;
	var mode = 'typing';

	for (i = 0; i < queries.length; i++) {
		query = queries[i].split('=');
		if (query[0] === 'mode') {
			mode = query[1];
		}
	}

	return mode;
};

KT.getSyllabary = function () {
	var str = window.location.hash.substring(1);
	var queries = str.split('&');
	var i = 0;
	var syllabary = 'hiragana';

	for (i = 0; i < queries.length; i++) {
		query = queries[i].split('=');
		if (query[0] === 'syllabary') {
			syllabary = query[1];
		}
	}

	return syllabary;
};

KT.Round.prototype.setUpScoreBoard = function () {
	sessionStorage.correct = 0;
	sessionStorage.incorrect = 0;
};

KT.Round.prototype.displayScore = function () {
	$('#score-correct').html(sessionStorage.correct);
	$('#score-incorrect').html(sessionStorage.incorrect);
};

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
	var kana = JSON.parse(sessionStorage.kana);
	var r = Math.floor(Math.random() * kana.length);

	return kana[r];
};

KT.createRound = function () {
	var round = Object.create(KT.Round.prototype, {
		'kana': {
			value: this.getRandKana(),
			writable: false
		},
		'params': {
			value: { 
				syllabary: this.getSyllabary(), 
				mode: this.getMode() 
			},
			writable: true
		}
	});

	return round;
};

var round = KT.createRound();
round.setUpScoreBoard();
round.displayRound();

$('#answer-input').keypress(function (e) {
	if (e.which == 13 && $(this).val()) {
		round.checkAnswer();
	}
});

$('.toggle-syllabary').click(function (e) {
	e.preventDefault();
	round.setSyllabary($(this).data('value'));
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

$('#reset').click(function (e) {
	round.setUpScoreBoard();
});