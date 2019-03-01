/**
 * Semantic UI
 */
$('.ui.dropdown').dropdown();

$('.menu .item').tab({
	history: true,
});

$('.ui.search').search({
	type: 'category',
	apiSettings: {
		url: '/search?query={query}&format=sui'
	},
});


/**
 * error management
 */
const $error_msg = $('#error_msg')
const $error_modal = $('#error')
const show_error = (error) => {
	console.error(error);
	$error_msg.text(error);
	$error_modal.modal('show');
}

/**
 * Copy
 * 
 */
$('.copy_to_clipboard').click( function() {
	document.getElementById(this.dataset.copy).select();
	document.execCommand("copy");
});

console.log('wapi.js OK')