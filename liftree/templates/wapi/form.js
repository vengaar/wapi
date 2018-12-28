let cmdline_base = 'ansible-playbook'
let cmdline_options = '{{ wapi.options }}'
let cmdline_playbook = '{{ meta.path }}'
let cmdline_tags_apply = ''
let cmdline_tags_skip = ''
let cmdline_tasks = ''
let extra_vars = JSON.parse('{{ wapi.extra_vars|wapi_defaults_extra_vars|to_json }}')
console.log(extra_vars)



$('#tasks').dropdown({
  apiSettings: {
    url: '/playbook_tasks?playbook={{ meta.path }}',
    cache: true
  },
  onChange: function(value, text, $selectedItem) {
    console.log(this.id, value)
    cmdline_tasks = value
    display_cmdline()
  },
  clearable: true,
  filterRemoteData: true,
});



$('.playbook-tags').dropdown({
    apiSettings: {
    url: '/playbook_tags?playbook={{ meta.path }}',
    cache: true
  },
  onChange: function(value, text, $selectedItem) {
    console.log(this.id, value)
    if (value === '') {
      cmdline_tags_apply = value
    }
    else if (this.id === 'tags_skip') {
      cmdline_tags_skip = value
    }
    display_cmdline()
  },
  clearable: true,
  filterRemoteData: true,
});



$('.extra_vars.input').change(function() {
    console.log(this)
    let name = this.id.replace('extra_vars-', '')
    if (this.value === '') {
        delete extra_vars[name]
    } else {
        extra_vars[name] = this.value
    }
    display_cmdline()    
});



$('.ui.toggle.checkbox').checkbox({
  onChecked: function() {
    let name = this.id.replace('extra_vars-', '')
    extra_vars[name] = true
    display_cmdline()
  },
  onUnchecked: function() {
    let name = this.id.replace('extra_vars-', '')
    extra_vars[name] = false
    display_cmdline()
  },
});



function update_extra_var_dropdown(value, text, $selectedItem) {
  let name = this.id.replace('extra_vars-', '')
  if (value === '') {
    delete extra_vars[name]
  }
  else if (this.classList.contains('multiple')) {
    extra_vars[name] = value.split(',')
  } else {
    extra_vars[name] = value
  } 
  display_cmdline()
}


$('.extra_vars.ui.dropdown.choices').dropdown({
  onChange: update_extra_var_dropdown,
  clearable: true,
})

// util function to extract
const sui_list_to_selected_options = (values) => {
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
    cache: true
  },
  onChange: update_extra_var_dropdown,
  clearable: true,
  values: sui_list_to_selected_options('{{ param.default }}'),
  filterRemoteData: true,  
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



const copy_cmdline = document.getElementById('copy_cmdline');
copy_cmdline.onclick = ()  => {
  let textarea = document.getElementById('command_line');
  textarea.select();
  document.execCommand('copy');
}

const display_cmdline = () => {
  let cmdline = [
      cmdline_base,
      cmdline_playbook,
      cmdline_options,
      "--extra-vars '" + JSON.stringify(extra_vars) + "'" 
  ]
  if (cmdline_tags_apply !== '') {
    cmdline.push('--tags="' + cmdline_tags_apply + '"')
  }
  if (cmdline_tags_skip!== '') {
    cmdline.push('--skip-tags="' + cmdline_tags_skip + '"')
  }
  if (cmdline_tasks !== '') {
    cmdline.push('--start-at-task="' + cmdline_tasks + '"')
  }
  $('#command_line').val(cmdline.join(' '))
}
display_cmdline()

console.log('ok form')