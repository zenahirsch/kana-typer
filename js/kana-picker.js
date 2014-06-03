var kana = KT.kana;
var kana_table = $('#kana-picker-table tbody');
var new_row = '';

var select_all_toggle = $('#toggle-select-all');
var select_none_toggle = $('#toggle-select-none');

select_all_toggle.click(function (e) {
	e.preventDefault();
	$('.kana-checkbox').prop('checked', true);
});

select_none_toggle.click(function (e) {
	e.preventDefault();
	$('.kana-checkbox').prop('checked', false);
});

$('#choose-kana-link').click(function (e) {
	e.preventDefault();
	// take selected kana and modify KT.kana in sessionStorage
});

var i = 0, x = 0;
var rows = 14;
for (i = 0; i < rows; i++) {
	var hiragana = kana[i].hiragana ? kana[i].hiragana + ' ' : '';
	var katakana = kana[i].katakana;
	var sound = kana[i].sound;

	new_row = '<tr id="kana-row-' + i + '">';
	new_row += '<td><input type="checkbox" class="kana-checkbox" /></td>';
	new_row += '<td>';
	new_row += hiragana + katakana + '</td>';
	new_row += '<td>' + sound + '</td>';
	new_row += '</tr>';
	kana_table.append(new_row);
}

for (x = 0; x < Math.floor((kana.length / rows) + 1); x++) {
	for (i = rows * (x + 1); i < rows * (x + 2); i++) {
		if (kana[i]) {
			var new_cell = '';
			var hiragana = kana[i].hiragana ? kana[i].hiragana + ' ' : '';
			var katakana = kana[i].katakana;
			var sound = kana[i].sound;

			new_cell += '<td><input type="checkbox" class="kana-checkbox" /></td>';
			new_cell += '<td>';
			new_cell += hiragana + katakana + '</td>';
			new_cell += '<td>' + sound + '</td>';
			$('#kana-row-' + (i - (rows * (x + 1)))).append(new_cell);
		}
	}
}