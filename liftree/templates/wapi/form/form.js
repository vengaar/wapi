// const urlParams = new URLSearchParams(window.location.search);
// console.log(urlParams.get("aa"))

// @todo email not updated


// util function to extract
const sui_list_to_selected_options = (values) => {
  let options = []
  if (values !== undefined && values.length > 0) {
    options = values.split(',').map(x => new Object({'name': x, 'value': x, 'selected': true}));
  }
  return options
}



let cmdline_base = '{{ extra.wapi_config.ansible_cmdline.playbook }}'
let cmdline_options = $('#options').val()
let cmdline_playbook = '{{ meta.path }}'
let cmdline_tags_apply = ''
let cmdline_tags_skip = ''
let cmdline_tasks = ''
let extra_vars = JSON.parse('{{ wapi.extra_vars|wapi_defaults_extra_vars|to_json }}')
// console.log('extra_vars', extra_vars)
//console.log(cmdline_options)



const wapi = {{ wapi|to_json }}
// console.log(wapi.extra_vars)
const form_fields_check = {}



const init_extra_var = extra_var => {
//   console.log(extra_var.name, extra_var)
  let name = extra_var.name
  if ('check' in extra_var) {
    form_fields_check[name] = extra_var.check
  } else if ('attributes' in extra_var && extra_var.attributes.indexOf('required') > -1) {
    form_fields_check[name] = 'empty'
  } 

  if ('search' in extra_var) {
    $('#extra_vars-' + extra_var.name).dropdown({
      apiSettings: {
        url: extra_var.search + '?' + extra_var.search_params,
        cache: true
      },
      onChange: update_extra_var_dropdown,
      clearable: true,
      values: sui_list_to_selected_options(extra_var.default),
      filterRemoteData: true,  
    });
  }

}

wapi.extra_vars.forEach( (elem) => {
  init_extra_var(elem)
})
console.log('form_fields_check', form_fields_check)



$('#tasks').dropdown({
  apiSettings: {
    url: '/ansible-ws/tasks?playbook={{ meta.path }}',
    cache: true
  },
  onChange: function(value, text, $selectedItem) {
    // console.log(this.id, value)
    cmdline_tasks = value
    display_cmdline()
  },
  clearable: true,
  filterRemoteData: true,
});



$('.playbook-tags').dropdown({
    apiSettings: {
    url: '/ansible-ws/tags?playbook={{ meta.path }}',
    cache: true
  },
  onChange: function(value, text, $selectedItem) {
    //console.log(this.id, value)
    if (this.id === 'tags_apply') {
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


$('#options').change(function() {
    // console.log(this)
    cmdline_options = this.value
    display_cmdline()
});



$('.extra_vars.input').change(function() {
    // console.log(this)
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
//   console.log(this.id, value)
  delete extra_vars[name]
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



const display_cmdline = () => {
  let cmdline = [
      cmdline_base,
      cmdline_playbook,
      cmdline_options,
  ]
  //console.log(extra_vars)
  if (Object.getOwnPropertyNames(extra_vars).length > 0) {
    let cmdline_extra_vars = "--extra-vars '" + JSON.stringify(extra_vars) + "'"
    cmdline.push(cmdline_extra_vars)
  }
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
  return JSON.stringify({"cmdline": cmdline})
//   return cmdline.join(' ')

}
display_cmdline()

$('#playbook_form').form({
  fields: form_fields_check
}).api({
    contentType: 'application/json',
    dataType: 'json',
    url: '/ansible-ws/launch',
    method:'POST',
    serializeForm: true,
    onSuccess: function(response, element, xhr) {
//         console.log('success');
//         console.log(response);
        let url = '/show?path={{ extra.wapi_config.runs_dir }}/' + response.results.runid + '/run.status'
//         window.location.replace(url)
        window.open(url)
    },
    onError: function(errorMessage, element, xhr) {
        show_error(errorMessage)
    },
    onFailure: function(response, element) {
        show_error(response)
    }
})



if ('configurations' in wapi) {
//   console.log(wapi.configurations)
  const load_configuration = (configuration) => {
    console.log('load_configuration', configuration)
//     console.log('load_configuration', wapi.configurations[configuration])
    for (let key in wapi.configurations[configuration]) {
//       console.log(key)
      const value = wapi.configurations[configuration][key]
//       console.log(value)
      let $extra_var = $('#extra_vars-' + key)
      if ($extra_var.hasClass('choices')) {
//         console.log('update choice', key, 'with', value)
        $extra_var.dropdown('set exactly', value)
      } else if ($extra_var.hasClass('dropdown')) {
//         console.log('update dropdown', key, 'with', value)
        const options = (typeof value === 'string') ? [value] : value;
        const values = options.map(x => new Object({'name': x, 'value': x}))
//         console.log(values)
        $extra_var.dropdown('change values', values)
        $extra_var.dropdown('set exactly', value)
      } else if ($extra_var.hasClass('checkbox')) {
//         console.log('update checkbox', key, 'with', value) 
        if (value) {
          $extra_var.checkbox('check')
        } else {
          $extra_var.checkbox('uncheck')
        }
      } else if ($extra_var.hasClass('input')) {
//         console.log('update input', key, 'with', value)
        $extra_var.val(value)
      }
    }
    // check form validation
    $('#playbook_form').form('validate form')
  }
  const configurations_values = Object.keys(wapi.configurations).map(x => new Object({'name': x, 'value': x}))
//   console.log('configurations_values', configurations_values)
  $('#wapi-configuration').dropdown({
    clearable: true,
    onChange: load_configuration,
    values: configurations_values,
  })
}


console.log('ok form')