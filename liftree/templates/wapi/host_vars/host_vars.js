$.fn.api.settings.api = {
  'sw2/grapher': '/sw2/query?query=grapher&host={host}',
};

const host = '{{ meta.path|basename }}'
const host_img_src = `/ansible-ws/graph/${host}.png`
const $button_update_graph = $('.button.update-graph')
$button_update_graph.api({
    onSuccess: function(response) {
      document.getElementById('host-graph').src = `${host_img_src}?random=${new Date().getTime()}`;
    },
    onFailure: function(response) { show_error(response) },
    onError: function(errorMessage) { show_error(errorMessage) },
});

console.log('ok host_vars')