
$('.ui.dropdown.choices').dropdown()

// util function to extract
function sui_list_to_selected_options(values) {
  let options = []
  if (values.length > 0) {
    options = values.split(',').map(x => new Object({'name': x, 'value': x, 'selected': true}));
  }
  return options
}

{% for param in wapi.extra_vars %}{% if param.search is defined %}

$('#extra_vars-{{ param.name }}').dropdown({
  apiSettings: {
    url: '{{ param.search }}?{{ param.search_params }}',
    cache: false
  },
  clearable: true,
  filterRemoteData: true,
  values: sui_list_to_selected_options('{{ param.default }}'),
/*
  onShow : function() {
  	$(this).children('.menu').children('.item').each(function(a, b){
    	var value = $(this).attr('data-value');
      var text = $(this).attr('data-text');
      var name = $(this).text();
      console.log(name, value, text)
      if(name.indexOf('user') >= 0){
      	$(this).prepend("<i class='user icon'></i>");
      }else if(name.indexOf('group') >= 0){
      	$(this).prepend("<i class='users icon'></i>");
      }
    });
  }
*/  
});

{% endif %}{% endfor %}

$('.ui.form').form({
  fields: {
{% for param in wapi.extra_vars %}
{% if param.check is defined %}
    {{ param.name }} : '{{ param.check }}',
{% elif 'required' in param.attributes|default([]) %}
    {{ param.name }} : 'empty',
{% endif %}
{% endfor %}
  }
});

console.log('ok')
