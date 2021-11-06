let point_x1 = 0, point_y1 = 0, point_dx = 0, point_dy = 0;
let chosen_currently = [];


function mouse_down_function(event) {
    /*
     when the mouse is down
    */
    //console.log("enter mouse_down_function ", event);
    let is_dragged_not_chosen = true;
    chosen_currently = [];
    point_x1 = event.dx;
    point_y1 = event.dy;
    $(".chosen_legoes").each(function () {
        if (this.id === event.target.id)
            is_dragged_not_chosen = false;
        chosen_currently.push(this.id);
        //console.log(chosen_currently)
    });
    if (is_dragged_not_chosen)
        chosen_currently = [event.target.id]
}


function mouse_up_function(event) {
    //if (is_inside_chosen(e)) {
    //console.log(event);
    point_dx = event.dx - point_x1;
    point_dy = event.dy - point_y1;
    let drag_save = [];
    for (let i = 0; i < chosen_currently.length; i++) {
        let movement = [chosen_currently[i], point_dx, point_dy];
        drag_save.push(movement);
    }
    actions.push({"type": "drag", "cubes": drag_save});
    //console.log("action index++");
    action_index++;

}


