define(function (require) {
	var Kana = require('classes/kana'),
		Round = require('classes/round'),
		selectedKana = require('kana-data'),
		r;

	r = new Round(selectedKana, 'hiragana', 'typing');

	r.displayRound();

	$('#answer-input').keypress(function (e) {
		if (e.which == 13 && $(this).val()) {
			r.checkAnswer();
		}
	});

	$('.toggle-syllabary').click(function (e) {
		e.preventDefault();
		r.setSyllabary($(this).data('value'))
			.setQueryString()
			.displayRound();
	});

	$('.toggle-mode').click(function (e) {
		e.preventDefault();
		r.setMode($(this).data('value'))
			.setQueryString()
			.displayRound();
	});

	$('#skip').click(function (e) {
		e.preventDefault();
		r.displayRound();
	});

	$('#reset').click(function (e) {
		r.resetScore();
	});
});