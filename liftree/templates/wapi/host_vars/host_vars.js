/**
 * 
 */

const host = '{{ meta.path|basename }}'
const parameters = {
	'host': host,
	'inventory': '{{ meta.path|dirname|dirname }}',	
}
const host_img_src = `/ansible-ws/graph/${host}.png`
const $button_update_graph = $('.button.update-graph')
$button_update_graph.api({
	action: 'sw2',
	method: 'POST',
	contentType: 'application/json',
	data: get_sw2_query('grapher', parameters),
	onSuccess: function(response) {
		document.getElementById('host-graph').src = `${host_img_src}?random=${new Date().getTime()}`;
	},
	onFailure: function(response) { show_error(response) },
	onError: function(errorMessage) { show_error(errorMessage) },
});

console.log('OK - host_vars.js')