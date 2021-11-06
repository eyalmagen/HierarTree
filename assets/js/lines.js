// the width and height of all the lines
let lines_width = 9;
let lines_height = 13;

function get_line_selecotr(lego_id_1, lego_id_2) {
    return "[id*=belong_to" + lego_id_1 + "belong_to" + lego_id_2 + "]";
}

function is_there_line_between_two_legoes(lego_id_1, lego_id_2) {
    ////////////////
    //return true if there is a line between two legoes
    ////////////////

    let is_the_two_connected1 = get_line_selecotr(lego_id_1, lego_id_2);
    let is_the_two_connected2 = get_line_selecotr(lego_id_2, lego_id_1);
    //console.log("is_there_line_between_two_legoes",($(is_the_two_connected1).length > 0 || $(is_the_two_connected2).length > 0))
    return ($(is_the_two_connected1).length > 0 || $(is_the_two_connected2).length > 0)
}


function delete_line_between_two_legoes(lego_id_1, lego_id_2) {
    ////////////////
    //this function gets 2 legos, and if they are connected with line
    //it deletes the line
    ////////////////

    let is_the_two_connected1 = get_line_selecotr(lego_id_1, lego_id_2);
    let is_the_two_connected2 = get_line_selecotr(lego_id_2, lego_id_1);
    $(is_the_two_connected1).remove();
    $(is_the_two_connected2).remove();
}

function save_in_div(lego_id_1, lego_id_2) {
    let is_the_two_connected = get_line_selecotr(lego_id_1, lego_id_2);
    if (isDescendant($(is_the_two_connected), ".Circle_mini_Lego")) {
        let save_me = $(is_the_two_connected).children()[0].id;
        let container = $("<div/>").attr("id", "save_" + save_me).appendTo("body").hide();
        $(is_the_two_connected).children().appendTo(container);
        return save_me;
    }
    return false;
}

function connect_two_legoes(lego_id_1, lego_id_2, is_dragged = false) {
    ////////////////
    //this function gets 2 legos, calculate the distance and
    //by it send to the right connecting function
    //unless those two are connected, then it delete that line
    ////////////////

    // delete lines that connected to one another
    //if  ( is_there_line_between_two_legoes(lego_id_1, lego_id_2) && is_dragged == false){
    //    delete_line_between_two_legoes(lego_id_1, lego_id_2)
    //}
    //else{
    //DELETE PREVIOUS LINES, for the animation
    lego_id_1 = parseInt(lego_id_1);
    lego_id_2 = parseInt(lego_id_2);

    //console.log("enter with ", lego_id_1, lego_id_2);
    //console.log($("#middle_line_belong_to1belong_to2").children());

    //if one lego doesnot exist it does nothing - no exception
    let flag = 2;
    let is_mini_erased = true;
    $(".Lego").each(function () {
        if (parseInt(this.id) === lego_id_1 || parseInt(this.id) === lego_id_2) flag--;
    });
    $(".Circle_mini_Lego").each(function () {
        if (parseInt(this.id) === lego_id_1 || parseInt(this.id) === lego_id_2) flag--;
    });
    if (flag) return;
    //before I delete the line, I check if its contain parent-line-circle. but delete anyway
    let is_mini_exist = save_in_div(lego_id_1, lego_id_2);
    if (!is_mini_exist) {
        is_mini_exist = save_in_div(lego_id_2, lego_id_1);
    }
    delete_line_between_two_legoes(lego_id_1, lego_id_2);
    add_new_line(lego_id_1, lego_id_2);
    // if its not the same lego
    if (lego_id_1 !== lego_id_2) {
        // calculate the delta y between the two legoes
        let a = "#" + lego_id_1;
        let b = "#" + lego_id_2;
        let delta_y = $(a).offset().top - $(b).offset().top;


        // handle the situation by the delta y
        // far - 3 lines
        if (delta_y > lines_height + $(a).height()) {
            connect_two_legoes_with_lines(lego_id_1, lego_id_2, 3, is_dragged);
        } else if (delta_y < -lines_height - $(a).height()) {
            connect_two_legoes_with_lines(lego_id_2, lego_id_1, 3, is_dragged);
            // closer - 2 lines
        } else if (delta_y >= lines_height * 2) {
            connect_two_legoes_with_lines(lego_id_1, lego_id_2, 2, is_dragged);
        } else if (delta_y <= -lines_height * 2) {
            connect_two_legoes_with_lines(lego_id_2, lego_id_1, 2, is_dragged);
            // same - 1 line
        } else {
            let line = connect_two_legoes_with_lines(lego_id_2, lego_id_1, 1, is_dragged);
            if (is_mini_exist) {
                //is_mini_exist is also the number of the mini lego that was saved in saved_is_mini_exist
                let saving_div = $("#save_" + is_mini_exist);
                //console.log(saving_div.length);
                saving_div.children().appendTo(line);
                saving_div.remove();
                is_mini_erased = false;
            }
        }

        if (is_mini_erased) {
            //all the lines that connected to the mini cube are removed
            let all_lines = "[id*=belong_to" + is_mini_exist +"]";
            $(all_lines).each(function () {
                $(this).remove()
            });
            //also I want to erase from the dict.
            delete mini_cubes[parseInt(is_mini_exist)]
        }
        let saving_div = $("#save_" + is_mini_exist);
        saving_div.remove();

        let colorValue = $("#line_color").colorpicker("val");
        $(".Vertical").each(function () {
            $(this).css('background-color', colorValue);
        });
        $(".Circle").each(function () {
            $(this).css('background-color', colorValue);
        });
        $(".Horizontal").each(function () {
            $(this).css('background-color', colorValue);
        })
    }
}

function connect_two_legoes_with_lines(lego_id_1, lego_id_2, number_of_lines, is_dragged = false) {
    ////////////////
    //this function gets 2 legos of different heights and connect them with line
    ////////////////

    //GET THE LEGOES LOCATIONS
    let under_lego = "#" + lego_id_1;
    let upper_lego = "#" + lego_id_2;

    // lego_size
    let upper_width = $(upper_lego).outerWidth();
    let upper_height = $(upper_lego).outerHeight();
    let under_width = $(under_lego).outerWidth();
    let under_height = $(under_lego).outerHeight();

    // halfs of legoes sizes, it will be used later a lot
    let half_upper_width = upper_width / 2;
    let half_upper_height = upper_height / 2;
    let half_under_width = under_width / 2;
    let half_under_height = under_height / 2;
    let half_line_width = lines_width / 2;
    let half_line_height = lines_height / 2;

    //HIGHER LEGO POSITION
    let left_upper_x = $(upper_lego).offset().left;
    let mid_upper_x = left_upper_x + half_upper_width;
    let right_upper_x = left_upper_x + upper_width;
    let top_upper_y = $(upper_lego).offset().top;
    let mid_upper_y = top_upper_y + half_upper_height;
    let bottom_upper_y = top_upper_y + upper_height;

    //LOWER LEGO POSITION
    let left_under_x = $(under_lego).offset().left;
    let mid_under_x = left_under_x + half_under_width;
    let right_under_x = left_under_x + under_width;
    let top_under_y = $(under_lego).offset().top;
    let mid_under_y = top_under_y + half_upper_height;
    let bottom_under_y = top_under_y + under_height;

    // DISTANSE BETWEEN THE LEGOES, we will use it to create the lines
    let len_horizontal_dist = Math.abs(mid_upper_x - mid_under_x);
    let horizontal_dist = mid_upper_x - mid_under_x;
    let one_line_len = len_horizontal_dist - upper_width;
    let two_line_hor_len = len_horizontal_dist - half_upper_width;
    let Vertical_dist = top_under_y - top_upper_y;
    let vertical_top_line = Vertical_dist - upper_height - lines_height;

    // set the lines id, this is very important for easy access later on.
    // each line will start with his name + line, then twice belong_to + id of the legoes it connects
    // for example:  middle_line_belong_to12belong_to22
    if (parseInt(lego_id_1) > parseInt(lego_id_2)) {
        let tmp = lego_id_1;
        lego_id_1 = lego_id_2;
        lego_id_2 = tmp;
    }
    let add_belong_to_lines_id = create_line_name(lego_id_1, lego_id_2);
    let low_line_id = "low_line_" + add_belong_to_lines_id;
    let middle_line_id = "middle_line_" + add_belong_to_lines_id;
    let top_line_id = "top_line_" + add_belong_to_lines_id;
    // one line situation
    if (number_of_lines === 1) {
        // special case - the two legoes are kind of horizontal.
        let mid = create_rescale_line_setClass(one_line_len, lines_width, middle_line_id, "Horizontal");
        mid.on('dblclick', function () {
            Create_mini_circle_for_line(mid);
        });
        if (horizontal_dist < 0)// upper to the left
            reposition(mid, right_upper_x, mid_upper_y);
        else reposition(mid, right_under_x, mid_under_y);
        return mid
    }
    // 2 lines situation
    else if (number_of_lines === 2) {
        let low = create_rescale_line_setClass(lines_width, lines_height, low_line_id, "Vertical");
        reposition(low, mid_under_x, top_under_y - lines_height);

        let mid = create_rescale_line_setClass(two_line_hor_len, lines_width, middle_line_id, "Horizontal");
        if (horizontal_dist < 0)// upper to the left
            reposition(mid, mid_under_x - two_line_hor_len, top_under_y - lines_height);
        else reposition(mid, mid_under_x, top_under_y - lines_height);
        // circle for nicer line
        let circle2 = create_rescale_line_setClass(lines_width, lines_width, "circle2" + middle_line_id, "Circle");
        reposition(circle2, mid_under_x - half_line_width, top_under_y - lines_height - half_line_width);

    }
    // 3 lines situation
    else {
        //CREATING THE 3 LINES TO CONNECT THE LEGOES

        // create the low_line, set id and class and add to slideshow. set width and height
        let low = create_rescale_line_setClass(lines_width, lines_height, low_line_id, "Vertical");
        reposition(low, mid_under_x, top_under_y - lines_height);

        // create middle_line, the horizontal one
        let mid = create_rescale_line_setClass(len_horizontal_dist, lines_width, middle_line_id, "Horizontal");
        if (horizontal_dist < 0)// upper to the left
            reposition(mid, mid_under_x - len_horizontal_dist, top_under_y - lines_height);
        else reposition(mid, mid_under_x, top_under_y - lines_height);

        // create the top_line
        let top = create_rescale_line_setClass(lines_width, vertical_top_line, top_line_id, "Vertical");
        reposition(top, mid_upper_x, bottom_upper_y);
        // create circles for nicer lines
        let circle = create_rescale_line_setClass(lines_width, lines_width, "circle" + top_line_id, "Circle");
        reposition(circle, mid_upper_x - half_line_width, top_under_y - lines_height - half_line_width);
        let circle2 = create_rescale_line_setClass(lines_width, lines_width, "circle2" + top_line_id, "Circle");
        reposition(circle2, mid_under_x - half_line_width, top_under_y - lines_height - half_line_width);


    }

}


function create_rescale_line_setClass(width, height, id, setclass) {
    /*
     as the name suggests, this function create line,
     and determain its size and class
    */
    /*
            if (is_there_line_between_two_legoes(lego_id_1, lego_id_2)){
    let line = $("<div/>").attr("id", id).appendTo('#slideshow').addClass(setclass)
               .width(width).height(height).hide().fadeIn("slow");
    }
    else{
    */
    return $("<div/>").attr("id", id).appendTo('#slideshow').addClass(setclass)
        .width(width).height(height);
}


function reposition(line, left, top) {
    /*
     reposition a line
    */
    //console.log("enter with " , line, left, top)
    if (line.attr("class") === "Vertical") left -= lines_width / 2;
    if (line.attr("class") === "Horizontal") top -= lines_width / 2;

    line.css({left: left + "px", top: top + "px"})
}

function create_line_name(lego_id_1, lego_id_2) {
    return "belong_to" + lego_id_1 + "belong_to" + lego_id_2;
}