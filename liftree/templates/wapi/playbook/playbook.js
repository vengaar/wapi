/**
 * 
 */

class ExtraVar {
	constructor(data) {
		this.src = data
		this.name = data.name
		this.description = data.description
		this.attributes = ('attributes' in data) ? data.attributes : []
		this.id = `extra_vars-${this.name}`
		this.$id = `#${this.id}`
		this.$ = $(this.$id)
		if ('choices' in data) {
			this.is_choices = true
			this.is_dropdown = true
			// init default
			if ('default' in data) {
				this.default = (this.is_multiple()) ? data.default : [data.default]
			} else {
				this.default = null
			}
			this.$.dropdown({
				onChange: extra_var_dropdown_onchange,
				clearable: true,
			})
		} else if ('boolean' in data) {
			this.is_boolean = true
			this.default = data.boolean
			this.$.checkbox({
				onChecked: function() {
					cmdline_update_extravar(this.name, true)
				},
				onUnchecked: function() {
					cmdline_update_extravar(this.name, false)
				},
			});

		} else if ('query' in data) {
			this.is_query = true
			this.is_dropdown = true
			// init default
			if ('default' in data) {
				this.default = (this.is_multiple()) ? data.default : [data.default]
			} else {
				this.default = null
			}
			let parameters = data.query_parameters || {}
			// console.log(parameters)
			this.$.dropdown({
				apiSettings: {
					action: 'sw2',
//					method: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						'sw2': {
							'query': data.query,
							'debug': true,
							'cache': 'bypass'
						},
						'parameters': parameters
					}),
					cache: true
				},
				onChange: extra_var_dropdown_onchange,
				clearable: true,
				filterRemoteData: true,
			});
			if (this.default !== null) {
				let values = this.default.map(x => new Object({'name': x, 'value': x}))
				this.$.dropdown('change values', values)
				this.$.dropdown('set exactly', this.default)
			}

		} else if ('search' in data) {
			this.is_search = true
			this.is_dropdown = true
			// init default
			if ('default' in data) {
				this.default = (this.is_multiple()) ? data.default : [data.default]
			} else {
				this.default = null
			}
			let url = `${data.search}?${data.search_params}`
			this.$.dropdown({
				apiSettings: {
					url: url,
					cache: true
				},
				onChange: extra_var_dropdown_onchange,
				clearable: true,
				filterRemoteData: true,
			});
			if (this.default !== null) {
				let values = this.default.map(x => new Object({'name': x, 'value': x}))
				this.$.dropdown('change values', values)
				this.$.dropdown('set exactly', this.default)
			}
		} else {
			// init default
			this.is_input = true
			this.default = ('default' in data) ? data.default : null
			this.$.change(function() {
				extra_var_input_onchange(this)
			});
			this.update(this.default)
		}
	}

	update(value) {
		if (this.is_input) {
			this.$.val(value)
			extra_var_input_onchange(this.$[0])
		} else if (this.is_choices) {
			this.$.dropdown('set exactly', value)
		} else if (this.is_boolean) {
			value ? this.$.checkbox('check') : this.$.checkbox('uncheck')
		} else if (this.is_search || this.is_query) {
			const options = (typeof value === 'string') ? [value] : value;
			const values = options.map(x => new Object({'name': x, 'value': x}))
			this.$.dropdown('change values', values)
			this.$.dropdown('set exactly', options)
		}
	}

	clear() {
		if (this.is_input) {
			this.update('')
		} else if (this.is_dropdown) {
			this.$.dropdown('clear')
		} else if (this.is_boolean) {
			this.restore_default()
		}
	}

	restore_default() {
		if (this.is_input) {
			this.update(this.default)
		} else if (this.is_search || this.is_query) {
			if (this.default !== null) {
				let values = this.default.map(x => new Object({'name': x, 'value': x}))
				this.$.dropdown('change values', values)
				this.$.dropdown('set exactly', this.default)
			}
		} else if (this.is_choices) {
			this.$.dropdown('set exactly', this.default)
		} else if (this.is_boolean) {
			let action = (this.default) ? 'check' : 'uncheck'
			this.$.checkbox(action)
		}
	}

	is_required() {
		return this.attributes.includes('required')
	}
	
	is_multiple() {
		return this.attributes.includes('multiple')
	}

	get_check_method() {
		let check_method
		if ('check' in this.src) {
			check_method = this.src.check
		} else if (this.is_required()) {
			check_method = 'empty'
		}
// console.log(this.name, check_method)
		return check_method
	}
};

class ExtraVars {
	constructor(data) {
		this.index = {}
	}

	get(name) {
		return this.index[name]
	}

	add(extra_var) {
// console.log('Add extra var : ', extra_var.name)
		this.index[extra_var.name] = extra_var
	}
	
	get_form_fields_check() {
		let form_fields_check = {}
		for (let name in this.index) {
			let extra_var = this.get(name)
			const check_method = extra_var.get_check_method()
			if (check_method !== undefined) {
				form_fields_check[name] = extra_var.get_check_method()
			}
		}
		return form_fields_check
	}
}

const runs_dir = '{{ extra.wapi_config.runs_dir }}'
let cmdline_base = '{{ extra.wapi_config.ansible_cmdline.playbook }}'
let cmdline_options = $('#options').val()
let cmdline_playbook = '{{ meta.path }}'
let cmdline_tags_apply = ''
let cmdline_tags_skip = ''
let cmdline_tasks = ''
let cmdline_extra_vars = {}
{#
JSON.parse('{{ wapi.launch.extra_vars|wapi_defaults_extra_vars|to_json }}')
#}
// console.log('cmdline_extra_vars', cmdline_extra_vars)
// console.log(cmdline_options)
const wapi = {{ wapi|to_json }}

const $cmdline = document.getElementById('cmdline')
const display_cmdline = () => {
	let cmdline = [
		cmdline_base,
		cmdline_playbook,
		cmdline_options,
	]
	if (Object.getOwnPropertyNames(cmdline_extra_vars).length > 0) {
		cmdline.push(`--extra-vars '${JSON.stringify(cmdline_extra_vars)}'`)
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
	$cmdline.value = cmdline.join(' ')
// console.log($cmdline.style.height)
// console.log($cmdline.scrollHeight)
// console.log($cmdline.scrollTop)
	if ($cmdline.scrollHeight > 0) {
		$cmdline.style.height = `${$cmdline.scrollHeight}px`
	}
}

const cmdline_update_extravar = (name, value) => {
// console.log('cmdline_update_extravar', name, value)
	if (value === null) {
		delete cmdline_extra_vars[name]
	} else {
		cmdline_extra_vars[name] = value
	}
	display_cmdline()
}

/*
 * EXTRA VARS
 */

// SUI onChange callback
function extra_var_dropdown_onchange(value, text, $selectedItem) {
// console.log('extra_var_dropdown_onchange', value)
	let name = this.id.replace('extra_vars-', '')
	let values
	if (value === '') {
		values = null
	} else {
		values = (this.classList.contains('multiple')) ? value.split(',') : value
	}
	cmdline_update_extravar(name, values)
}

// Input test onChange callback
const extra_var_input_onchange = input => {
	let value = (input.value === '') ? null : input.value
	cmdline_update_extravar(input.name, value)
}

const extra_vars = new ExtraVars()
if ('launch' in wapi && 'extra_vars' in wapi.launch) {
	wapi.launch.extra_vars.forEach( data => {
		let extra_var = new ExtraVar(data)
		extra_vars.add(extra_var)
	})
}



/*
 * OPTIONS
 */
const playbook = '{{ meta.path }}'
const sw2_playbook_parameter = JSON.stringify({'playbook': '{{ meta.path }}'})
const get_sw2_playbook_query = (query) => {
	const data = {
		'sw2': {
			'query': query,
			'debug': true
		},
		'parameters': {
			'playbook': playbook
		}
	}
	console.log(data)
	return JSON.stringify(data)
}

$('#tasks').dropdown({
	apiSettings: {
		action: 'sw2',
		method:'POST',
		contentType: 'application/json',
		data: get_sw2_playbook_query('tasks'),
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
		action: 'sw2',
		method:'POST',
		contentType: 'application/json',
		data: get_sw2_playbook_query('tags'),
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
	fields: extra_vars.get_form_fields_check()
}).api({
	action: 'sw2',
	method:'POST',
	contentType: 'application/json',
	serializeForm: true,
	beforeSend: function(settings) {
		console.log(settings.data)
		const data = {
			'sw2': {
				'query': 'launch',
				'debug': true
			},
			'parameters': settings.data
		}
		settings.data = JSON.stringify(data)
		console.log(settings.data)
		return settings;
	},
	onSuccess: function(response, element, xhr) {
		let url = `/show?path=${runs_dir}/${response.results.runid}/run.status#/output`
		// console.log(url)
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
			let extra_var = extra_vars.get(key)
			if (value === '__clear__') {
				extra_var.clear()
			} else if (value === '__default__') {
				extra_var.restore_default()
			} else {
				extra_var.update(value)
			}
		}
		// check form validation
		$playbook_form.form('validate form')
	} else {
		if (configuration !== '') {
			error = `Invalid configuration: ${configuration}, this configuration is not defined`;
			show_error(error)
		}
	}
}

const $configuration = $('#wapi-configuration') 
$configuration.dropdown({
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
if (configuration !== null) $configuration.dropdown('set exactly', configuration)

console.log('OK - form.js')