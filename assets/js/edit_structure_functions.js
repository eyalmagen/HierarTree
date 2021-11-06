/*stretching*/
let stretch_x = 50;
let stretch_y = 90;
// we want to enable fix horizontal or vertical
$("#button_arrange_horizontal").click(function () {
    fix_lines(true, false, stretch_x, stretch_y)
});
$("#button_arrange_vertical").click(function () {
    fix_lines(false, true, stretch_x, stretch_y)
});
$("#arrange").click(function () {
    if ($('.chosen_legoes').length > 1)
        fix_lines2($(".chosen_legoes"));
    else
        fix_lines2($(".Lego"));
});

$("#chose_stretch_x").slider({
    min: 40,
    max: 92,
    change: function (event, ui) {
        //console.log(ui.value)
        fix_lines(false, true, stretch_x, ui.value)
    }
});
$("#chose_stretch_y").slider({
    min: 40,
    max: 92,
    change: function (event, ui) {
        //console.log(ui.value)
        fix_lines(true, false, ui.value, stretch_y, true)
    }
});


$("#slide_length").slider({
    min: 70,
    max: 300,
    change: function (event, ui) {

        $("#slideshow").css("height", ui.value + "vh")
    }
});
$("#slide_width").slider({
    min: 70,
    max: 95,
    change: function (event, ui) {
        console.log("slider");
        $("#slideshow").css("width", ui.value + "vw")
    }
});