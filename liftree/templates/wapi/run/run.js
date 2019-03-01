/**
 * run.js
 */
const run_status = '{{ data.status }}'
const ansi_up = new AnsiUp;
const $run_control_start = $('#run_control_start')
const $run_control_watch = $('#run_control_watch')
const $run_control_kill = $('#run_control_kill')
const $run_control_end = $('#run_control_end')
const $output = $('#output')
const $watch = $('#run_control_watch .eye.icon')

// not yet implemented
$run_control_kill.addClass('disabled')

$run_control_start.click( () => {
	console.log("go start")
	$output.scrollTop(0);
});
$run_control_end.click( () => {
	console.log("go end")
	$output.scrollTop($output[0].scrollHeight);
});

$run_control_watch.click( () => {
	$watch.toggleClass('slash')
	if (!$watch.hasClass('slash')) {
		get_run_output();
	}
});

const update_page = (response) => {
	let status = response.results.status.status
// console.log(status)
	if ( run_status == 'finished' ) {
		let html = ansi_up.ansi_to_html(response.results.output);
		document.getElementById('output').innerHTML = html
		$run_control_watch.addClass('disabled')
		$run_control_kill.addClass('disabled')
	} else {
		if (status == 'finished') {
			location.reload();
		} else {
			let html = ansi_up.ansi_to_html(response.results.output);
			document.getElementById('output').innerHTML = html
			if (!$watch.hasClass('slash')) {
				setTimeout(get_run_output, 1000);
			}
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

console.log('run.js OK')