/*
 * @todo configuration __clear__ __default__
 */

const runs_dir = '{{ extra.wapi_config.runs_dir }}'
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
const form_fields_check = {}

const display_cmdline = () => {
    let cmdline = [
        cmdline_base,
        cmdline_playbook,
        cmdline_options,
    ]
    if (Object.getOwnPropertyNames(extra_vars).length > 0) {
        let cmdline_extra_vars = `--extra-vars '${JSON.stringify(extra_vars)}'`
        cmdline.push(cmdline_extra_vars)
    }
    if (cmdline_tags_apply !== '') {
        cmdline.push(`--tags="${cmdline_tags_apply}"`)
    }
    if (cmdline_tags_skip!== '') {
        cmdline.push(`--skip-tags="${cmdline_tags_skip}"`)
    }
    if (cmdline_tasks !== '') {
        cmdline.push(`--start-at-task="${cmdline_tasks}"`)
    }
    $('#command_line').val(cmdline.join(' '))
}



/*
 * EXTRA VARS
 */

const is_multiple_dropdown = extra_var => {
    const is_muliple = 'attributes' in extra_var && extra_var.attributes.includes('multiple')
    return is_muliple
}

const extra_var_dropdown_set_default = ($extra_var, extra_var) => {
    if ('default' in extra_var) {
      const options = (is_multiple_dropdown(extra_var)) ? extra_var.default : [extra_var.default]
      const values = options.map(x => new Object({'name': x, 'value': x}))
      $extra_var.dropdown('change values', values)
      $extra_var.dropdown('set exactly', options)
    }
}  

// SUI onChange callback
function extra_var_dropdown_onchange(value, text, $selectedItem) {
    let name = this.id.replace('extra_vars-', '')
    //delete extra_vars[name]
    if (value === '') {
        delete extra_vars[name]
    } else if (this.classList.contains('multiple')) {
        extra_vars[name] = value.split(',')
    } else {
        extra_vars[name] = value
    } 
    display_cmdline()
}

const init_extra_var = extra_var => {
//  console.log(extra_var.name, extra_var)
    let name = extra_var.name
    if ('check' in extra_var) {
        form_fields_check[name] = extra_var.check
    } else if ('attributes' in extra_var && extra_var.attributes.indexOf('required') > -1) {
        form_fields_check[name] = 'empty'
    }
    const id = `#extra_vars-${extra_var.name}`
    if ('search' in extra_var) {
        const $extra_var = $(id)
        $extra_var.dropdown({
            apiSettings: {
                url: `${extra_var.search}?${extra_var.search_params}`,
                cache: true
            },
            onChange: extra_var_dropdown_onchange,
            clearable: true,
            filterRemoteData: true,
        });
        extra_var_dropdown_set_default($extra_var, extra_var)
    }
}

$('.extra_vars.ui.dropdown.choices').dropdown({
  onChange: extra_var_dropdown_onchange,
  clearable: true,
})

const extra_var_update_input = input => {
    if (input.value === '') {
        delete extra_vars[input.name]
    } else {
        extra_vars[input.name] = input.value
    }
    display_cmdline()
}
$('.extra_vars.input').change(function() {
      extra_var_update_input(this)
});

$('.ui.toggle.checkbox').checkbox({
    onChecked: function() {
        extra_vars[this.name] = true
        display_cmdline()
    },
    onUnchecked: function() {
        extra_vars[this.name] = false
        display_cmdline()
    },
});

wapi.extra_vars.forEach( (elem) => {
    init_extra_var(elem)
})
// console.log('form_fields_check', form_fields_check)



/*
 * OPTIONS
 */

$('#tasks').dropdown({
    apiSettings: {
        url: '/ansible-ws/tasks?playbook={{ meta.path }}',
        cache: true
    },
    onChange: function(value, text, $selectedItem) {
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
    cmdline_options = this.value
    display_cmdline()
});



/*
 * FORM
 */
const $playbook_form = $('#playbook_form') 
$playbook_form.form({
    fields: form_fields_check
}).api({
    contentType: 'application/json',
    dataType: 'json',
    url: '/ansible-ws/launch',
    method:'POST',
    serializeForm: true,
    onSuccess: function(response, element, xhr) {
        let url = `/show?path=${runs_dir}/${response.results.runid}/run.status`
        window.open(url)
    },
    onError: function(errorMessage, element, xhr) {
        show_error(errorMessage)
    },
    onFailure: function(response, element) {
        show_error(response)
    }
})



/*
 * Configurations
 */

const configurations = ('configurations' in wapi) ? wapi.configurations : {}
const load_configuration = (configuration) => {
    console.log('load_configuration', configuration)
    if (configuration in configurations) {
        for (let key in configurations[configuration]) {
          const value = configurations[configuration][key]
          let $extra_var = $(`#extra_vars-${key}`)
          if ($extra_var.hasClass('choices')) {
            $extra_var.dropdown('set exactly', value)
          } else if ($extra_var.hasClass('dropdown')) {
            const options = (typeof value === 'string') ? [value] : value;
            const values = options.map(x => new Object({'name': x, 'value': x}))
            $extra_var.dropdown('change values', values)
            $extra_var.dropdown('set exactly', value)
          } else if ($extra_var.hasClass('checkbox')) {
            if (value) {
              $extra_var.checkbox('check')
            } else {
              $extra_var.checkbox('uncheck')
            }
          } else if ($extra_var.hasClass('input')) {
            $extra_var.val(value)
            extra_var_update_input($extra_var[0])
          }
        }
        // check form validation
        $playbook_form.form('validate form')
  } else {
      error = `Invalid configuration: ${configuration}, this configuration is not defined`
      show_error(error)
  }
}

$('#wapi-configuration').dropdown({
  clearable: true,
  onChange: load_configuration,
  values: Object.keys(configurations).map(x => new Object({'name': x, 'value': x}))
})



/*
 * MAIN
 */
display_cmdline()

const urlParams = new URLSearchParams(window.location.search);
const configuration = urlParams.get("configuration")
if (configuration !== null) load_configuration(configuration)

console.log('form.js OK')