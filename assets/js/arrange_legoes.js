let initial_clustering_delta_y = 40;

function get_lego_ids() {
    ////////////////
    //return a set of all the lego ids on the slideshow
    ////////////////

    //$("p.intro")	Selects all <p> elements with class="intro"
    // therefor all the legoes are in $("div.Lego")
    //declare a new empty set
    let allSet = new Set();
    $(".Lego").each(function () {
        allSet.add(this.id);
    });
    return allSet
}


function is_dalta_y_smaller_than(id1, id2, limit_delta) {
    ////////////////
    //get 2 legos and return true if their dy is smaller then limit_delta
    ////////////////
    let a = "#" + id1;
    let b = "#" + id2;
    return Math.abs($(a).offset().top - $(b).offset().top) < limit_delta;
}


function initial_clustering(allSet) {
    ////////////////
    //the first clustering, it returns a set of sets
    //its gets allSet, set of all the legoes, and divide to groups
    //the purpose is obvious group which will be united later
    //1) chose arbitrary lego
    //2) check who is with it in the same group, put in a set, put the set in the return set
    //3) take this group out of the main set, until its empty
    ////////////////
    let set_of_sets = new Set();
    // while allSet is not empty
    while (allSet.size > 0) {
        // create new set for the new group
        let new_group_set = new Set();
        // chose arbitrary id
        let it = allSet.values();
        //get first entry:
        let first = it.next();
        //get value out of the iterator entry:
        let curr_id = first.value;
        // delete it from allSet and add it to the new set
        new_group_set.add(curr_id);
        allSet.delete(curr_id);
        // go over all the other remaining ids to see who is about the same height
        let tmp_set = new Set();
        tmp_set = allSet;
        for (let item of tmp_set) {
            // if the difference between the two is smaller then some delta y so its belong to the group
            if (is_dalta_y_smaller_than(curr_id, item, initial_clustering_delta_y)) {

                new_group_set.add(item);
                allSet.delete(item);
            }
        }
        set_of_sets.add(new_group_set)
    }
    return set_of_sets
}


function movelego(id, x, y, duration = 1000) {
    ////////////////
    // move a lego x to the right and y down
    // progress - specifies a function to be executed after each step in the animation
    ////////////////
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

function expand_array(arr, dimention, expand_percentage) {
    /*
    input:array of same delta numbers and expand percentage
    dimention required it can be "y" or "x"
    this func work is awesome!
    it normalized the arr: [3,5,7] -> [-2,0,2] (simple minus)
    then multiply by a factor [-2,0,2] -> [-3,0,3] (simple mul)
    unnormalized again: [-3,0,3] -> [2,5,8] (simple plus)
    well it can be written in much fewer lines, but I like it this way. k.i.s.s
    */
    // no reason to factor
    if (arr.length <= 1) return arr;
    let delta = arr[1] - arr[0];
    let first = arr[0];
    let last = arr[arr.length - 1];
    let mid_value = (first + last) / 2;
    let half_slideshow = $("#slideshow").outerHeight() / 2;
    if (dimention == "x") half_slideshow = $("#slideshow").outerWidth() / 2;
    // the factor is by how much we mul every value - can be greater or lower 1
    let factor = half_slideshow / (half_slideshow - delta) * (expand_percentage / 115);
    let reduce_by = function (a) {
        return a - mid_value;
    };
    let add_by = function (a) {
        return a + mid_value;
    };
    let mul_by = function (a) {
        return a * factor;
    };
    let normalized = arr.map(reduce_by);
    let expanded = normalized.map(mul_by);
    let centered = expanded.map(add_by);
    return centered
}


function equaly_divide_slideshow_y(setA, expand_percentage = 80) {
    ////////////////
    // get set of groups and return an array of y for rows
    ////////////////
    let num_of_groups = setA.size;
    if (num_of_groups > 0) {
        let dy = $("#slideshow").height() / (num_of_groups + 1);
        // now we have 2dy room to divide by all the spaces
        let heights = [];
        for (let i = 1; i <= num_of_groups; i++) {

            next_height = (dy * i) + $("#slideshow").offset().top;
            heights.push(next_height);
            /*
            let horizontals = $("<div/>")
                         .appendTo('#slideshow').addClass("Horizontal")
                         .width($("#slideshow").width()).height(5);
            horizontals.css( { left: 0 , top: next_height + "px"} )
            */
        }
        return expand_array(heights, "y", expand_percentage)
    }
    else return []
}


function equaly_divide_slideshow_x(setA, expand_percentage = 80, expand_x) {
    ////////////////
    // duplication of equaly_divide_slideshow_y
    ////////////////
    if (setA.size > 0) {
        let dx = $("#slideshow").width() / (setA.size + 1);
        let the_x_list = [];
        for (let i = 1; i <= setA.size; i++) {
            let next_height = (dx * i);
            if (!presentation_mode) next_height += $("#edit").outerWidth();
            the_x_list.push(next_height);
            /*
           let verticals = $("<div/>")
                        .appendTo('#slideshow').addClass("Vertical")
                        .width(5).height($("#slideshow").height());//.fadeIn(500);
           verticals.css( { left: next_height +"px" , top: 0} )
           */
        }
        if (expand_x)
            return expand_array(the_x_list, "x", expand_percentage);
        else
            return the_x_list;
    }
    else return []
}


function sort_groups_by_height(set_of_sets) {
    ////////////////
    //return array of sets that represent the group
    ////////////////
    let array = Array.from(set_of_sets);
    array.sort(function (setA, setB) {
        let array1 = Array.from(setA);
        let array2 = Array.from(setB);
        return $("#" + array1[0]).offset().top - $("#" + array2[0]).offset().top
    });
    return array
}


function sort_groups_by_x(setA) {
    ////////////////
    //return array of sets that represent the group
    ////////////////
    let array = Array.from(setA);
    array.sort(function (a, b) {
        return $("#" + a).offset().left - $("#" + b).offset().left
    });
    return array
}


function make_all_groups_same_height(groups, fix_horizontaly = true, fix_letticaly = true, expand_percentage_x = 90, expand_percentage_y = 90, expand_x) {
    /*
     input: the clustering - set of sets that represent group
    */

    // sort the groups by heights
    let array_of_groups = sort_groups_by_height(groups);
    // get the heights that each group will be in.
    let array_of_heights = equaly_divide_slideshow_y(groups, expand_percentage_y);
    // for the undo:
    let drag_save = [];
    // length array of the groups
    let number_of_groups = array_of_groups.length;
    // go over the groups
    for (let i = 0; i < number_of_groups; i++) {
        let curr_group_set = array_of_groups[i];
        let tmp_set = new Set(curr_group_set);
        // for this specific group, it modifies the x of each lego
        let array_of_x = equaly_divide_slideshow_x(tmp_set, expand_percentage_x, expand_x);
        // this line maintain the order of the group
        let curr_group_array = sort_groups_by_x(curr_group_set);

        // go over the group legoes
        for (let j = 0; j < curr_group_array.length; j++) {
            let curr_lego_id = curr_group_array[j];
            let curr_lego = $("#" + curr_lego_id);
            let x_change = array_of_x[j] - curr_lego.offset().left - curr_lego.outerWidth() / 2;
            let y_change = array_of_heights[i] - curr_lego.offset().top - curr_lego.outerHeight() / 2;
            if (!fix_horizontaly) x_change = 0;
            if (!fix_letticaly) y_change = 0;
            //for the undo:
            let movement = [curr_lego_id, x_change, y_change];
            drag_save.push(movement);

            movelego(curr_lego_id, x_change, y_change)
        }
    }
    actions.push({"type": "drag", "cubes": drag_save});
    //console.log("make_all_groups_same_height: action index++");
    action_index++;
}


function fix_lines(fix_horizontaly = true, fix_letticaly = true, expand_percentage_x = 50, expand_percentage_y = 90, expand_x = false) {
    /*
    optional 4 args
    fix_horizontaly - whether to fix horizontaly or not
    fix_letticaly - whether to fix verticaly or not
    expand_percentage_x - by which factor to expand horizontaly
    expand_percentage_y - by which factor to expand verticaly
    */
    let groups = initial_clustering(get_lego_ids());
    make_all_groups_same_height(groups, fix_horizontaly, fix_letticaly, expand_percentage_x, expand_percentage_y, expand_x)
}
