
const $ssh_key_form = $('#ssh_key_load')
const $public_keys = $('#public_keys')
const $ssh_agent_kill= $('#ssh_agent_kill')

$('#private_key').dropdown({
	clearable: true
});

$ssh_key_form.form({
	fields: {
		private_key: 'empty',
		passphrase: 'empty'
	},
}).api({
	contentType: 'application/json',
	action: 'agent/add',
	serializeForm: true,
	method:'POST',
	beforeSend: function(settings) {
		settings.data['id'] = 'wapi'
		settings.data = get_sw2_query('SSHAgentAdd', settings.data)
		return settings;
	},	
	onSuccess: function(response, element, xhr) {
		$ssh_key_status.addClass('green');
		$public_keys.val(response.results.keys)
	},
	onError: function(errorMessage, element, xhr) {
		$ssh_key_status.addClass('red');
		show_error(errorMessage)
	},
	onFailure: function(response, element) {
		$ssh_key_status.addClass('red')
		sw2_on_failure(response)
	},
});


const sw2_agent_parameters = {'id': 'wapi'}
$('body').api({
	contentType: 'application/json',
	action: 'agent/get',
	method:'POST',
	data: get_sw2_query('SSHAgent', sw2_agent_parameters),
	on: 'now',
	onSuccess: function(response) {
		console.log(response.results.agent);
		if(response.results.keys.length > 0) {
			$ssh_key_status.addClass('green')
			$public_keys.val(response.results.keys)
		} else {
			$ssh_key_status.addClass('red')
			$public_keys.val("NO keys loaded")
		}
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,
})	

$ssh_agent_kill.api({
	contentType: 'application/json',
	action: 'agent/kill',
	method:'POST',
	data: get_sw2_query('SSHAgentKill', sw2_agent_parameters),
	onSuccess: function(response, element, xhr) {
		// console.log('ssh_agent_kill success');
		// console.log(response.results.agent);
		$ssh_key_status.removeClass('green')
		$ssh_key_status.addClass('red')
		$public_keys.val("NO keys loaded")
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,
});


/*
 * CACHE
 */
const $cache_information = $('#cache-information tbody')
const $botton_load_cache = $('.button.cache-load')
const load_cache_information = cache_informations => {
	// console.log(cache_informations)
	if (cache_informations.length == 0) {
		$('body').toast({message: 'No cache found'});
	}
	$cache_information.empty()
	for (let cache_info of cache_informations) {
		// console.log(cache_info)
		const line = `
			<tr>
				<td class="center aligned">
					<i	data-key="${cache_info.key}"
						class="trash link icon cache-flush"></i>
				</td>
				<td>${cache_info.key}</td>
				<td class="center aligned">${cache_info.metadata.category}</td>
				<td>${cache_info.metadata.discriminant}</td>
			</tr>`
		$cache_information.append(line);
	}
	$('.cache-flush').api({
		contentType: 'application/json',
		action: 'cache/flush',
		method:'POST',
		beforeSend: function(settings) {
			const parameters = {'key': $(this).data('key')}
			settings.data = get_sw2_query('cache_flush', parameters)
			return settings;
		},	
		onSuccess: function(response) {
			console.log(response)
			$botton_load_cache.click()
		},
		onFailure: sw2_on_failure,
		onError: sw2_on_error,
	});
}

$botton_load_cache.api({
	contentType: 'application/json',
	action: 'cache/get',
	method:'POST',
	data: get_sw2_query('cache_info'),
	onSuccess: function(response) {
		load_cache_information(response.results)
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,
});

console.log('OK - config.js');