/*
Let us name things clearly:
@class: chosen_legoes - can move together, change color and template together
@class: start_line_here - the class of the bubble holding the message
@let: from_this_draw_line - it means that if now Ill press someone there will be a line
*/

// if this lego is picked, you may draw lines with it.
let from_this_draw_line = -1;
// help to get unique identifier each time
let counter = 0;
// at first no lego is chosen
let is_any_lego_chosen = false;

let shown = true;

let mini_cubes = {};

last_presed_cube = -1;

function draw_line_to_this(id) {
    ////////////////
    //check if we are now in a edit locations mode and if so
    //connect the one that was clicked to the chosen(marked) one.
    ////////////////
    //console.log("draw_line_to_this started with ", id);
    if (id !== from_this_draw_line && is_any_lego_chosen) {
        connect_two_legoes(id, from_this_draw_line)
    }
}


function show_bubble(id) {
    $('#' + id).addClass("DrawLineFromHere");
}


function choose_lego_for_lines_making(id) {
    /*
    when this function is activated, the lego can draw lines to other legoes
    by clicking them, a click outside others will cancel that activation
    */
    //console.log("enter choose_lego_for_lines_making ", id)
    // first double click
    if (is_any_lego_chosen === false) {

        from_this_draw_line = id;
        // symbol for being chosen
        show_bubble(from_this_draw_line);
        // when the lego is clicked on so it is chosen
        is_any_lego_chosen = true;
    }
    // the second click
    else {
        draw_line_to_this(id)
    }
}


function unchose_lego_for_lines_making() {
    // when other lego is clicked on so previous id unchosen
    $('.DrawLineFromHere').removeClass("DrawLineFromHere");
    is_any_lego_chosen = false;
}

/* CREATION */
function Create_new_lego(setid = false, fast_creation = false) {

    //***********CREATE NEW LEGO
    // each new lego is unique
    counter += 1;
    if (setid)
        counter = setid;
    if (fast_creation) {
        $("<div/>").attr("id", counter).appendTo('#slideshow')
            .addClass("Lego").addClass("draggable")
    }
    else {
        $("<div/>").attr("id", counter).appendTo('#slideshow')
            .addClass("Lego").addClass("draggable").hide().fadeIn("slow");
    }


    let new_lego_object = $("#" + counter)

    // new_lego_object.text(counter)
    let tmp_id = counter;
    new_lego_object.on('dblclick', function () {
        choose_lego_for_lines_making(tmp_id);
    });
    // always know which cube was pressed last, mainly for image adding.
    new_lego_object.on('click', function () {
        last_presed_cube = tmp_id
    });

    // try to create in a little different place
    new_lego_object.css({
        left: $("#slideshow").offset().left,
        top: $("#slideshow").offset().top
    });


    // the current working lego is the new one
    current_lego = counter;

    while (is_created_on_other(counter)) {// should work but doesnt really
        new_lego_object.css({
            left: $("#" + counter).offset().left + 7,
            top: $("#" + counter).offset().top + 7
        })
    }
}


function Create_mini_circle_for_line(line, fast_creation = false) {
    //console.log("enter Create_mini_circle_for_line")
    //i dont want to allow 2 circles in one line
    if (!isDescendant(line, ".Circle_mini_Lego")) {
        counter += 1;
        mini_cubes[counter] = get_ids_from_line(line);
        if (fast_creation) {
            $("<div/>").attr("id", counter).appendTo(line)
                .addClass("Circle_mini_Lego").addClass("draggable_for_line")
        }
        else {
            $("<div/>").attr("id", counter).appendTo(line)
                .addClass("Circle_mini_Lego").addClass("draggable_for_line").hide().fadeIn("slow");
        }

        let new_lego_object = $("#" + counter);
        let tmp_id = counter;
        new_lego_object.on('dblclick', function () {
            choose_lego_for_lines_making(tmp_id);
        });
        // the current working lego is the new one
        current_lego = counter;
    }
}


function is_created_on_other(new_lego) {
    /*
     return true if new_lego is in the position of other lego
    */
    let flag = false;
    let topPos = get_cube_top(new_lego);
    $(".Lego").each(function () {
        if (parseInt((this).id) !== new_lego) {
            if (get_cube_top(this.id) === topPos) {// &&
                //(this).style.top == new_lego[0].style.top){
                flag = true
            }
        }
    });
    return flag
}


function Delete_lego() {
    // you must know the father if you wish to delete
    // if any_lego_chosen so it has current_lego id
    $(".chosen_legoes").each(function () {
        // delete lines that connected to this one
        let belong_to = "[id*=belong_to" + this.id + "]"
        $(belong_to).remove().fadeOut("slow");
        // clear form when deleting a lego
        $("#" + this.id).fadeOut("slow", function () {
            $(this).remove();
        });
    })
}


function get_ids_from_line(line) {
    //middle_line_belong_to2belong_to1
    let line_id = line[0].id;
    let splited_str = line_id.split("belong_to");
    let cube_id1 = splited_str[1];
    let cube_id2 = splited_str[2];
    /*get line and return which cubes it connects.*/
    return [cube_id1, cube_id2]

}