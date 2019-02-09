/* dropdown select all */
$(".ui.multiple.selection.dropdown .selectall").checkbox({
    onChecked() {
        const items = $(this).parent().siblings(".item")
        const values = items.toArray().map(
          obj => obj.getAttribute("data-value")
        );
        //console.log(values);
        const $dropdown = $(this).closest(".ui.multiple.selection.dropdown");
        //console.log($dropdown);
        $dropdown.dropdown("set exactly", values);
    },
    onUnchecked() {
        const $dropdown = $(this).closest(".ui.multiple.selection.dropdown");
        $dropdown.dropdown('clear');
    },
});

console.log('common.js OK')