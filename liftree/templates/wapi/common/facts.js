
/**
 * Facts update
 */

const sw2_facts_parameters = {
	'host': file,
	'inventories': inventories 
}
console.log(sw2_facts_parameters)

$('#facts_update').api({
	action: 'sw2',
	method:'POST',
	contentType: 'application/json',
	beforeSend: function(settings) {
		settings.data = get_sw2_query('facts', sw2_facts_parameters)
		return settings;
	},
	onSuccess: function(response) {
		console.log(response)
		//location.reload();
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,	
});