let presentation_mode = false;


// $(".structure_mode").hide()
//
$(".style_mode").hide();
Create_new_lego();
// movelego(1, 500, 10, 100);
$("#1").load("../assets/html_templates/template_file" + 16 + ".html");
function change_to_edit_locations_mode() {
    $(".style_mode").fadeOut("slow");
    setTimeout(function () {
        $(".structure_mode").fadeIn("slow");
    }, 600)
}


function change_to_edit_style_mode() {
    $(".structure_mode").fadeOut("slow");
    setTimeout(function () {
        $(".style_mode").fadeIn("slow");
    }, 600)
}

function change_to_presentation_mode() {
    presentation_mode = true;
    modify_cubes_for_present_mode(true);
    setTimeout(function () {
        $("#edit").fadeOut("slow");
        $("#header").fadeOut("slow");
        $("#slideshow").fadeOut("slow");
        $("#edit_text").hide();
        $("input:file").each(function () {
            if (isDescendant(".Lego", this)) {
                $(this).hide();
            }
        });
    }, 400);

    setTimeout(function () {

        $("#slideshow").css({"width": "97vw", "min-height": "94vh"});
        $("#slideshow").fadeIn("slow");
    }, 1000)
}

function exit_presentation_mode() {
    presentation_mode = false;
    modify_cubes_for_present_mode(false);
    setTimeout(function () {
        $("#slideshow").fadeOut("slow");
        $("#edit").fadeIn("slow");
        $("#header").fadeIn("slow");
        $("#slideshow").css({"width": "72vw", "min-height": "83vh"});
        $("#slideshow").fadeIn("slow");
        /*
        *  $("input:file").each(function(){
            if (isDescendant(".Lego", this)) {
                $(this).show();
            }
        });
        * */

        //fix_lines2()
    }, 1000)

}


//Demo
/*
function do_expand(b1, b2, b3, b4) {
    fix_lines(b1, b2, b3, b4)
    //let iter = setTimeout(function(){do_expand(by+1);}, 1200)
}



function demonstration() {
    change_to_line_mode()
    for (let i = 1; i < 13; i++) {
        Create_new_lego()
        movelego(i, Math.floor(Math.random() * 50), Math.floor(Math.random() * 200), 400)
    }
    let to_do = setTimeout(function () {
        do_expand(false, true, 90, 90);
    }, 3000)
    let to_do = setTimeout(function () {
        do_expand(true, true, 70, 70);
    }, 5000)
    let to_do = setTimeout(function () {
        do_expand(true, false, 70, 70);
    }, 7000)
    let to_do = setTimeout(function () {
        do_expand(true, false, 90, 90);
    }, 9000)
    let to_do = setTimeout(function () {
        do_expand(false, true, 70, 70);
    }, 11000)
    let to_do = setTimeout(function () {
        do_expand(true, true, 100, 100);
    }, 13000)
}
*/

