
const $ssh_key_status = $('#ssh_key_status')
const $ssh_key_form = $('#ssh_key_load')
const $public_keys  = $('#public_keys')

$('#private_key').dropdown({
    clearable: true
});

$ssh_key_form.api({
  contentType: 'application/json',
  dataType: 'json',
  url: '/ssh_agent?action=add',
  method:'GET',
  serializeForm: true,
  beforeSend: function(settings) {
    console.log("Data submitted =",settings);
    return $ssh_key_form.form('is valid');
  },
  onSuccess: function(response, element, xhr) {
    console.log('key-add success');
    console.log(response);
    $ssh_key_status.addClass('green')
    $public_keys.val(response.results.keys)
  },
  onError: function(errorMessage, element, xhr) {
    console.error('key-add error');
    $ssh_key_status.addClass('red')
    show_error(errorMessage)
    return false
  },
  onFailure: function(response, element) {
    console.error('key-add failure');
    $ssh_key_status.addClass('red')
    show_error(response)
    return false
  }
})
.form({
  onSuccess: function (event) {
    $(this).addClass('loading')
    event.preventDefault();
    console.log('valid');
    return false;
  },
  onFailure: function (event) {
    console.log('NOT valid');
    return false;
  },    
  fields: {
    private_key: 'empty',
    passphrase: 'empty'
  }
})


$.ajax({
   url: '/ssh_agent?action=info',
   type: 'GET',
   error: function(xhr, status, error) {
	   show_error(error)
	   $ssh_key_status.addClass('red')
   },
   success: function(result, status, xhr) {
	   console.log(result);
	   if(result.results.keys != '') {
		   $ssh_key_status.addClass('green')
		   $public_keys.val(result.results.keys)
	   } else {
		   $ssh_key_status.addClass('red')
		   $public_keys.val("NO keys loaded")
	   }
   },
});

console.log('ok config')
