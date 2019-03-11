$('.ui .progress').progress({
	showActivity: false,
});

$('.ui.accordion').accordion();

$("#facts_update").api({
	action: 'sw2',
	method:'POST',
	contentType: 'application/json',
	beforeSend: function(settings) {
		settings.data = get_sw2_query('setup', {'host': file})
		return settings;
	},
	onSuccess: function(response) {
		console.log(response)
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,	
});