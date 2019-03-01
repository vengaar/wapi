$.fn.api.settings.api = {
	'ssh_agent_kill': '/ssh-agent/kill?id=wapi',
	'ssh_agent_info': '/ssh-agent/info?id=wapi',
	'ssh_agent_add': '/ssh-agent/add?id=wapi',
	'sw2': '/sw2/query?query={query}',
	'sw2/cache/flush': '/sw2/query?query=cache_flush&key={key}',
};

const $ssh_key_form = $('#ssh_key_load')
const $public_keys = $('#public_keys')
const $ssh_agent_kill= $('#ssh_agent_kill')

$('#private_key').dropdown({
	clearable: true
});

$ssh_key_form.api({
	contentType: 'application/json',
	dataType: 'json',
	url: '/ssh-agent/add?id=wapi',
	method:'GET',
	serializeForm: true,
	beforeSend: function(settings) {
		console.log("Data submitted =",settings);
		return true
	},
	onSuccess: function(response, element, xhr) {
		console.log('key-add success');
		console.log(response);
		$ssh_key_status.addClass('green');
		$public_keys.val(response.results.keys)
	},
	onError: function(errorMessage, element, xhr) {
		console.error('key-add error');
		$ssh_key_status.addClass('red');
		show_error(errorMessage)
		return false
	},
	onFailure: function(response, element) {
		console.error('key-add failure');
		$ssh_key_status.addClass('red')
		show_error(response)
		return false
	}
})
.form({
	onSuccess: function (event) {
		$(this).addClass('loading')
		event.preventDefault();
		console.log('valid');
		return false;
	},
	onFailure: function (event) {
		console.log('NOT valid');
		return false;
	},
	fields: {
		private_key: 'empty',
		passphrase: 'empty'
	}
});

$.ajax({
	url: '/ssh-agent/info?id=wapi',
	type: 'GET',
	error: function(xhr, status, error) {
		show_error(error)
		$ssh_key_status.addClass('red')
	},
	success: function(result, status, xhr) {
		// console.log(result);
		if(result.results.keys.length > 0) {
			$ssh_key_status.addClass('green')
			$public_keys.val(result.results.keys)
		} else {
			$ssh_key_status.addClass('red')
			$public_keys.val("NO keys loaded")
		}
	},
});

$ssh_agent_kill.api({
	action: 'ssh_agent_kill',
	onSuccess: function(response, element, xhr) {
		console.log('ssh_agent_kill success');
		console.log(response);
		$ssh_key_status.removeClass('green')
		$ssh_key_status.addClass('red')
		$public_keys.val("NO keys loaded")
	},
	onError: function(errorMessage, element, xhr) {
		console.error('ssh_agent_kill error');
		show_error(errorMessage)
		return false
	},
	onFailure: function(response, element) {
		console.error('ssh_agent_kill failure');
		show_error(response)
		return false
	}
});


/*
 * CACHE
 */

const $cache_information = $('#cache-information tbody')
const $botton_load_cache = $('.button.cache-load')
const load_cache_information = cache_informations => {
	// console.log(cache_informations)
	$cache_information.empty()
	for (let cache_info of cache_informations) {
		// console.log(cache_info)
		const line = `
			<tr>
				<td class="center aligned">
					<i	data-action="sw2/cache/flush"
						data-key="${cache_info.key}"
						class="trash link icon cache-flush"></i>
				</td>
				<td>${cache_info.key}</td>
				<td class="center aligned">${cache_info.metadata.category}</td>
				<td>${cache_info.metadata.discriminant}</td>
			</tr>`
		$cache_information.append(line);
	}
	$('.cache-flush').api({
		onSuccess: function(response) {
			console.log(response)
			$botton_load_cache.click()
		},
		onFailure: function(response) { show_error(response) },
		onError: function(errorMessage) { show_error(errorMessage) },
	});
}

$botton_load_cache.api({
	onSuccess: function(response) {
		load_cache_information(response.results)
	},
	onFailure: function(response) { show_error(response) },
	onError: function(errorMessage) { show_error(errorMessage) },
});

console.log('OK - config.js')