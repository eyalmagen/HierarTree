/*
    this dict is crucial. every cube will keep a list of cubes
    with higher id. for example:
    1:[7,2]
    2:[3,4]
    .
    .
    10:[100, 29]
    also I will try a new pattern of ignoring the actual number and using the object $("#id")

*/
lines = {};

function get_id(obj) {
    return obj[0].id
}

function connent_cubes(from, to) {
    /*from and two are ints*/
    if (lines.hasOwnProperty(from)) {
        console.log("lines[from]", lines[from]);
        lines[from].add(to)
    }
    else {
        let set = new Set();
        lines[from] = set.add(to)
    }
    //https://jsfiddle.net/7fjSc/9/
    //https://stackoverflow.com/questions/17202548/wavy-shape-with-css
}

/*function add_new_line_onl(from, to) {
    if (get_id(from) > get_id(to)){
        connent_cubes(to, from)
    }
    else{
        connent_cubes(from, to)
    }
}*/

function add_new_line(from, to) {
    connent_cubes(parseInt(to), parseInt(from));
    //connent_cubes(from, to)
}