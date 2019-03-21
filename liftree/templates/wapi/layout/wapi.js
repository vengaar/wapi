/**
 * Semantic UI
 */

$.fn.api.settings.api = {
	'search': '/search?query={query}&format=sui',
	'sw2': '/sw2/query',
};

const get_sw2_query = (query, parameters) => {
	const data = {
		'sw2': {
			'query': query,
//			'debug': true,
//			'cache': 'bypass',
		},
		'parameters': parameters
	}
	return JSON.stringify(data)
}

$('.ui.dropdown').dropdown();

$('.menu .item').tab({
	history: true,
});

const wapi_search = $('#wapi-search').search({
	type: 'category',
});

$('#search_cat').dropdown({
	onChange: function(value, text, $choice) {
		// console.log(value, text, $choice)
		wapi_search.search('set value', value)
		wapi_search.search('search remote', value)
		$('#search-input').focus()
	}
})


/**
 * stars
 */
let wapi_stars = localStorage.getItem('wapi-stars')
// console.log(wapi_stars)
wapi_stars = wapi_stars === null ? {} : JSON.parse(wapi_stars) 
// console.log(wapi_stars)
if (path in wapi_stars) {
	$('.wapi-start').addClass('yellow')
	$('.wapi-start').removeClass('outline')
}
const stars_udapte = () => {
	// console.log('update star for', path)
	const $starts = $('.wapi-start')
	$starts.toggleClass('yellow')
	$starts.toggleClass('outline')
	if ( $starts.hasClass('yellow') ) {
		wapi_stars[path] = {'cat': wapi_star_cat, 'name': wapi_star_name, 'icon': wapi_star_icon}
	} else {
		delete wapi_stars[path]
		// wapi_stars = wapi_stars.filter(item => item !== path)
	}
	// console.log(wapi_stars)
	localStorage.setItem('wapi-stars', JSON.stringify(wapi_stars));
	stars_draw()
}
const stars_draw = () => {
	// console.log('stars_draw')
	const $wapi_stars = $('#wapi-stars')
	$wapi_stars.empty()
	for (let star_key in wapi_stars) {
		// console.log(star_key)
		const star_data = wapi_stars[star_key]
		// console.log(star_data)
		// [${star_data.cat}]
		$wapi_stars.append(`<a class="item" href="/show?path=${star_key}"><i class="${star_data.icon} icon"></i>${star_data.name}</a>`)
	}
}
stars_draw()
$('.wapi-start').click(stars_udapte)


/**
 * Menu
 */
$('.menu .browse').popup({
	// inline: true,
	position: 'bottom left',
	lastResort: 'bottom left',
	offset: 10,
	on: 'click',
	delay: {
		show: 300,
		hide: 800
	}
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

const sw2_on_failure = (response, element) => {
	const type = typeof response
	//console.log(type)
	if (type === 'object') {
		console.error(response)
		show_error(JSON.stringify(response.errors, null, 2))		
	} else {
		show_error(response)
	}
}

const sw2_on_error = (errorMessage, element, xhr) => {
	show_error(errorMessage)
}

/**
 * Copy
 */
$('.copy_to_clipboard').click( function() {
	document.getElementById(this.dataset.copy).select();
	document.execCommand("copy");
});

console.log('OK - wapi.js')