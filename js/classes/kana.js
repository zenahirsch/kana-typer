define(function () {
	var Kana = function (params) {
		this.id = params.id;
		this.sound = params.sound;
		this.helper = params.helper;
		this.hiragana = params.hiragana;
		this.katakana = params.katakana;
		this.group = params.group;
	};

	/* 
	 * STATES for kana objects:
	 * UNGUESSED
	 * CORRECT
	 * INCORRECT
	*/
	Kana.prototype.state = null;

	return Kana;
});