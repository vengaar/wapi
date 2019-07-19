/**
 * Graph
 */

const host = '{{ meta.path|basename }}'
const parameters = {
	'host': host,
	'inventory': '{{ meta.path|dirname|dirname }}',	
}
const sw2_parameters = get_sw2_query('grapher', parameters);
const host_img_src = `/ansible-ws/graph/${host}.png`
const $button_update_graph = $('.button.update-graph')
$button_update_graph.api({
	contentType: 'application/json',
	action: 'grapher/update',
	method: 'POST',
	data: get_sw2_query('grapher', parameters),
	onSuccess: function(response) {
		$('body').toast({
			class: 'success',
			message: `Grahp for ${host} successfully generated`
		});
		document.getElementById('host-graph').src = `${host_img_src}?random=${new Date().getTime()}`;
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,
});

console.log('OK - host_vars.js');