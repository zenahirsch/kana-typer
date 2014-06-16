define(function () {
	var Round = function (selectedKana, syllabary, mode) {
		this.selectedKana = selectedKana;
		this.syllabary = syllabary;
		this.mode = mode;
		this.kana = this.getRandKana();

		this.correctScore = 0;
		this.incorrectScore = 0;
	};

	/* 
	 * Returns a random kana that 
	 * has not yet been correctly guessed 
	 */
	Round.prototype.getRandKana = function () {
		var r = Math.floor(Math.random() * this.selectedKana.length);

		if (this.selectedKana[r].state !== 'correct') {
			return this.selectedKana[r];
		} else {
			this.getRandKana();
		}
	};

	/* 
	 * Set the kana for this round.
	 */
	Round.prototype.setKana = function (kana) {
	 	this.kana = kana;
	 	return this;
	 };

	Round.prototype.resetInput = function () {
		this.setPlaceholder();
		$('#answer-input').css('color', 'rgba(100, 0, 100, 1)').val('').focus();
		return this;
	};

	Round.prototype.selectToggles = function (syllabary, mode) {
		$('.toggle-syllabary').removeClass('selected');
		$('#toggle-' + syllabary).addClass('selected');

		$('.toggle-mode').removeClass('selected');
		$('#toggle-' + mode).addClass('selected');

		return this;
	};

	Round.prototype.displayRound = function () {
		var mode = this.mode,
			syllabary = this.syllabary,
			selectedKana = this.selectedKana,
			$prompt = $('#prompt'),
			$helper = $('#helper'),
			$input = $('#answer-input'),
			r;

		this.kana = this.getRandKana();

		this.resetInput().selectToggles(syllabary, mode);

		if (mode === 'typing') {
			$prompt.css('font-size', '8em');
			if (this.kana[syllabary]) {
				$prompt.html(this.kana.sound).css('display', 'none').fadeIn();
				$helper.html(this.kana.helper).css('display', 'none').fadeIn();
			} else {
				r = new Round(selectedKana, syllabary, mode);
				r.displayRound();
			}
		} else if (mode === 'reading') {
			$prompt.css('font-size', '10.75em');
			$helper.css('display', 'none');
			if (this.kana[syllabary]) {
				$prompt.html(this.kana[syllabary]).css('display', 'none').fadeIn();
			} else {
				r = new Round(selectedKana, syllabary, mode);
				r.displayRound();
			}
		}
		$input.css('display', 'none').fadeIn();

		return this;
	};

	Round.prototype.checkAnswer = function () {
		console.log('checking answer')
		var syllabary = this.syllabary,
			mode = this.mode,
			selectedKana = this.selectedKana,
			$input = $('#answer-input'),
			answer = $input.val(),
			correctKana,
			correctSound,
			nextRound;

		console.log('the input: ' + answer);

		if (mode === 'typing') {
			correctKana = this.kana[syllabary];
			if (answer.toLowerCase() === correctKana.toLowerCase()) {
				this.updateScore('correct');
				this.displayRound();
			} else {
				this.updateScore('incorrect');
				$input.css('color', 'red');
			}
		} else if (mode === 'reading') {
			correctSound = this.kana.sound;
			console.log('correct sound: ' + correctSound);
			if (answer.toLowerCase() === correctSound.toLowerCase()) {
				console.log('it matches');
				this.updateScore('correct');
				this.displayRound();
			} else {
				this.updateScore('incorrect');
				$input.css('color', 'red');
			}
		}

		return this;
	};

	Round.prototype.setPlaceholder = function () {
		var syllabary = this.syllabary,
			mode = this.mode,
			$input = $('#answer-input');

		if (mode === 'reading') {
			$input.css('font-size', '5.65em');
			$input.attr('placeholder', 'romaji');
		} else if (syllabary === 'hiragana' && mode === 'typing') {
			$input.css('font-size', '8em');
			$input.attr('placeholder', 'かな');
		}
		else if (syllabary === 'katakana' && mode === 'typing') {
			$input.css('font-size', '8em');
			$input.attr('placeholder', 'カナ');
		}

		return this;
	};

	Round.prototype.setSyllabary = function (syllabary) {
		this.syllabary = syllabary;
		return this;
	};

	Round.prototype.setMode = function (mode) {
		this.mode = mode;
		return this;
	};

	Round.prototype.setQueryString = function () {
		var newStr = 'syllabary=' + this.syllabary +
					 '&mode=' + this.mode;

		console.log(newStr);
		window.location.hash = '#' + newStr;

		return this;
	};

	Round.prototype.displayScore = function () {
		$('#score-correct').html(this.correctScore);
		$('#score-incorrect').html(this.incorrectScore);

		return this;
	};

	Round.prototype.updateScore = function (result) {
		if (result === 'correct') {
			this.correctScore++;
		} else if (result === 'incorrect') {
			this.incorrectScore++;
		}

		this.displayScore();

		return this;
	};

	Round.prototype.resetScore = function () {
		this.correctScore = 0;
		this.incorrectScore = 0;
		return this;
	};

	return Round;

});

