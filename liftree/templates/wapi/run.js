
const run_status = '{{ data.status }}'
const update_page = (response) => {
    let status = response.results.status.status
    console.log(status)
    if ( run_status == 'finished' ) {
      $('#output').text(response.results.output)
    } else {
      if (status == 'finished') {
        location.reload();
      } else {
        $('#output').text(response.results.output)
        setTimeout(get_run_output, 1000);
      }
    }
}

const get_run_output = () => {
    $.ajax({
    dataType: "json",
    url: '/playbook_run?runid={{ data.runid }}',
    success: update_page
    });
}
get_run_output()