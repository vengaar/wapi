$('.ui.dropdown').dropdown();

$('.menu .item').tab({
history: true,
});

$('.ui.search').search({
  type: 'category',
  apiSettings: {
    url: '/search?query={query}&format=sui'
  },
});

/* error management */
const $error_msg = $('#error_msg')
const $error_modal = $('#error')
const show_error = (error) => {
  console.error(error);
  $error_msg.text(error);
  $error_modal.modal('show');
}

console.log('ok wapi layout')