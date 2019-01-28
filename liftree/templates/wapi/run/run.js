
const run_status = '{{ data.status }}'
const ansi_up = new AnsiUp;

const update_page = (response) => {
    let status = response.results.status.status
    console.log(status)
    if ( run_status == 'finished' ) {
      let html = ansi_up.ansi_to_html(response.results.output);
      document.getElementById('output').innerHTML = html
    } else {
      if (status == 'finished') {
        location.reload();
      } else {
        let html = ansi_up.ansi_to_html(response.results.output);
        document.getElementById('output').innerHTML = html
        setTimeout(get_run_output, 1000);
      }
    }
}

const get_run_output = () => {
    $.ajax({
    dataType: "json",
    url: '/ansible-ws/run?runid={{ data.runid }}',
    success: update_page
    });
}
get_run_output()