/*
* so we want to add a new feature of ctrl z
* this will use a stack of the following actions to revert:
* 1) drag - list of cubes and their movement
* 2) creation - a list of id that was created
* 3) a list of files that has been removed
*
* for simplicity - every action is a dict: {"kind":"drag" ,"cubes":[id1, id2...]}
* */
//globals
actions = [];
action_index = -1;

function revert_drag(cube_move) {
    //cube is a list of [id, x, y] so
    let id = cube_move[0];
    let x = cube_move[1] * (-1);
    let y = cube_move[2] * (-1);
    movelego(id, x, y, 550)
}

function revert_delete() {

}

function revert_create() {

}

function revert_last_action() {
    //console.log("enter revert_last_action with actions" , actions);
    if (action_index >= 0) {
        let action_to_function = {"drag": revert_drag, "create": revert_create, "delete": revert_delete};
        let action = actions[action_index];
        // this list contains mini-lists of [id, data] according to the action kind
        let data_on_cubes_to_revert = action["cubes"];
        let func_to_apply = action_to_function[action["type"]];
        let length = data_on_cubes_to_revert.length;
        for (let i = 0; i < length; i++) {
            func_to_apply(data_on_cubes_to_revert[i]);
        }
        action_index = Math.max(action_index - 1, -1);
        actions.pop();
    }
}