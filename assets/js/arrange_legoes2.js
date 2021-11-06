//distance in pixels - smaller than this consider to be the same group in the arrange.
let const_delta_y = 45;

//general
function movelego(id, x, y, duration = 1000) {
    /*
    // move a lego x to the right and y down
    // progress - specifies a function to be executed after each step in the animation
    */
    let lego = $("#" + id);
    lego.animate({left: "+=" + x, top: "+=" + y},
        {
            duration: duration,
            easing: "swing",
            step: function () {
                keep_lines_attached_to_lego(id);
            }
        });
}

function get_cube_left(id) {
    /*get int cube left offset*/
    return parseInt($("#" + id).offset().left);
}

function get_cube_top(id) {
    /*get int cube left offset*/
    return parseInt($("#" + id).offset().top);
}

function is_delta_smaller_than(v1, v2, delta) {
    return Math.abs(v1 - v2) < delta;
}

//stage 1
function initial_clustering2(cubes_class) {
    /*
        the first clustering.
        the purpose is obvious group which will be separate later. algorithm:
            1) chose arbitrary cube
            2) check in dict if close, if so its there, put in a dict,
                 else, create new dict value.

        return type:  dict: y(int)-> list of close to y cubes ids
    */

    let groups = {};
    //iterate cubes
    cubes_class.each(function () {
        let cube_y = parseInt($(this).offset().top);
        let is_new_group = true;
        //iterate y's
        for (let y_group in groups) {
            if (is_delta_smaller_than(y_group, cube_y, const_delta_y)) {
                groups[y_group].push(this.id);
                //if cube found its group, next cube
                is_new_group = false;
                break
            }
        }
        if (is_new_group) {
            groups[cube_y] = [this.id]
        }
    });

    return groups
}

//stage 1: all the cubes in the same height - be same height.
function same_y(cubes_class, movements) {
    /*
        set movements y's for every cube to be what it should be
        return groups which is the initial groups.
    */
    let groups = initial_clustering2(cubes_class);

    //iterate groups of cubes.
    for (let y_group in groups) {
        let arr_of_cubes = groups[y_group];
        //iterate array of cubes of length y_group. set movements y.
        for (let cube_index = 0; cube_index < arr_of_cubes.length; cube_index++) {
            let cube_id = arr_of_cubes[cube_index];
            movements[cube_id][1] = parseInt(y_group)
        }
    }
    return groups
}

//stage 2
function sort_groups_by_x2(arr) {
    /*sort array of cubes id by x value*/
    arr.sort(function (a, b) {
        return get_cube_left(a) - get_cube_left(b)
    });
    return arr
}

//stage 2
function divide_by_x(cubes_ids, precise_groups) {
    /*
        crucial, get a list of cubes and precise_groups to push the groups in.
        return list of lists of cubes ids.
        algo:
            1)sort
            2)greedy add cubes until the next one is too far.
    */
    let sorted_by_x_ids = sort_groups_by_x2(cubes_ids);
    let first_cube = sorted_by_x_ids[0];
    let temp_precise_group = [first_cube];
    let last_cube_x_val = get_cube_left(first_cube);
    for (let index = 1; index < sorted_by_x_ids.length; index++) {
        let cube_id = sorted_by_x_ids[index];
        let cube_left = get_cube_left(cube_id);
        if (is_delta_smaller_than(last_cube_x_val, cube_left, parseInt($("#slideshow").width() / 4))) {
            temp_precise_group.push(cube_id)
        }
        else {
            //deep copy
            let percise_group = temp_precise_group.slice();
            precise_groups.push(percise_group);
            temp_precise_group = [cube_id]
        }
        last_cube_x_val = cube_left
    }
    precise_groups.push(temp_precise_group)
}

//stage 2
function get_avg_dx(group) {
    /*
        get group of ids
        return the average dx distance
    */
    let len = group.length;
    let sum = 0;
    for (let i = 1; i < len; i++) {
        sum += get_cube_left(group[i]) - get_cube_left(group[i - 1])
    }
    return parseInt(sum / (len - 1))
}

//stage 2
function set_movements_x(precise_groups, movements) {
    //console.log("enter set_movements_x", precise_groups, movements);
    for (let index = 0; index < precise_groups.length; index++) {
        let precise_group = precise_groups[index];
        let cube_id = precise_group[0];
        let first_x = get_cube_left(cube_id);
        movements[cube_id][0] = first_x;
        if (precise_group.length === 1) continue;
        let average_dx = get_avg_dx(precise_group);
        for (let i = 1; i < precise_group.length; i++) {
            cube_id = precise_group[i];
            movements[cube_id][0] = first_x + (i * average_dx)
        }
    }
}

//stage 2: every group by y will be divided into sub groups by x
function sub_groups_by_x(groups, movements) {
    let precise_groups = [];
    for (let group in groups) {
        //groups[group] is list of cubes ids.
        let cubes_ids = groups[group];
        divide_by_x(cubes_ids, precise_groups);
    }
    set_movements_x(precise_groups, movements)
}

//stage 3: move the cubes and also save it for ctrl-z option
function actual_move_and_save_movement(movements) {
    // for the undo:
    let drag_save = [];
    // go over the cubes
    for (let cube_id in movements) {
        let x_change = movements[cube_id][0] - get_cube_left(cube_id);
        let y_change = movements[cube_id][1] - get_cube_top(cube_id);
        let movement = [cube_id, x_change, y_change];
        drag_save.push(movement);
        movelego(cube_id, x_change, y_change)
    }
    actions.push({"type": "drag", "cubes": drag_save});
    action_index++;
}


function fix_lines2(cubes_class = $(".Lego")) {
    let movements = {};
    cubes_class.each(function () {
        movements[this.id] = [0, 0]
    });
    //groups: {dict}: y(int)-> list of close to y cubes ids
    let groups = same_y(cubes_class, movements);
    sub_groups_by_x(groups, movements);
    //in this point, every cube knows where it should be! its in movements
    actual_move_and_save_movement(movements);
}

//modify_cubes_for_present_mode

function modify_move(cube_id, is_to_present_mode = true) {
    // console.log("cube_id",cube_id, $("#" + cube_id), $("#" + cube_id).offset().left);
    let slideshow_left = $("#slideshow").offset().left;
    let cube_left = get_cube_left(cube_id);
    let factor = 1.32;
    let factor_widening = 2 - (1 / factor);
    if (is_to_present_mode) {
        factor_widening = factor;
    }

    // console.log(factor_widening ,"factor_widening ");
    let curr_d_from_right = Math.abs(cube_left - (slideshow_left + $("#slideshow").width()));
    // console.log("cube_left", cube_left, "(slideshow_left + $(\"#slideshow\").width()", (slideshow_left + $("#slideshow").width()))
    // console.log(curr_d_from_right ,"curr_d_from_right ");

    let move_left = Math.abs(curr_d_from_right - curr_d_from_right * factor_widening);
    if (is_to_present_mode) {
        movelego(cube_id, -move_left, 1)
    }
    else {
        movelego(cube_id, move_left, 1)
    }
}

function modify_cubes_for_present_mode(is_to_present_mode = true) {
    $(".Lego").each(function () {
        modify_move(this.id, is_to_present_mode)
    })
}
