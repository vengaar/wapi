/**
 * Facts update
 */

const sw2_facts_parameters = {
	'host': file,
	'inventories': inventories 
}
// console.log(sw2_facts_parameters)

$('#facts_update').api({
	contentType: 'application/json',
	action: 'facts/update',
	method: 'POST',
	data: get_sw2_query('facts', sw2_facts_parameters),
	onSuccess: function(response) {
		console.log(response)
		location.reload();
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,	
});

console.log('OK - facts.js');