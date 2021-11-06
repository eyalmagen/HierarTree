//UTILS
function makeItPromise(func, parameters = {}) {
    //this takes a function and return a Promise
    func(parameters);
    return function () {
        return new Promise(function (resolve) {
            resolve()
        })
    };
}

function ActiveByOrder(list_of_functions) {
    /*
    *  list_of_functions: list of functions:[[func,param][][]]
    *  Activate the functions one after the other
    * */
    let functions_number = list_of_functions.length;
    if (functions_number) {
        let first_function = list_of_functions[0][0];
        let first_function_params = list_of_functions[0][1];
        if (functions_number === 1) {
            return function () {
                return makeItPromise(first_function, first_function_params)()
            }
        }
        else {
            let new_list = list_of_functions;
            new_list.shift();
            return makeItPromise(first_function, first_function_params)().then(ActiveByOrder(new_list))
        }
    }
}

//test
/* TESTING

function start() {
        first();
        second();
        third();
}

function first() {
    for (let i=0; i<1000;i++)
        console.log("1")
}

function second() {
    console.log("2")
}

function third() {
    console.log("3")
}

start();

function aaa() {
    for (let i = 1; i < 1000; i++) {
        console.log("aaa")
    }
}

function aaa2() {
    for (let i = 1; i < 1000; i++) {
        console.log("aaa2")
    }
}

function aaa3() {
    for (let i = 1; i < 1000; i++) {
        console.log("aaa3")
    }
}

function aaa4() {
    for (let i = 1; i < 1000; i++) {
        console.log("aaa4")
    }
}

ActiveByOrder([aaa, aaa2, aaa3, aaa4]);*/


//SAVE
function get_children_data(cube_selectors) {
    let data_inside = [];
    cube_selectors.children().children().each(function () {
            //image
            if ($(this).attr("src")) {
                data_inside.push($(this).attr("src"))
            }
            //input
            else {
                if (!($(this).is("input:file"))) {
                    data_inside.push($(this).val())
                }
            }
        }
    );
    return data_inside
}

function get_slideshow_state() {
    let x = $("#slideshow").width();
    let y = $("#slideshow").height();
    return {"x": x, "y": y}
}

function save_project() {
    let state = {"cubes": {}, "lines": {}, "mini_cubes": {}, "slideshow": get_slideshow_state()};
    $(".Lego").each(function () {
        let cube_selectors = $("#" + (this).id);
        let input_text = get_children_data(cube_selectors);
        state["cubes"][parseInt((this).id)] = {
            "x": cube_selectors.offset().left,
            "y": cube_selectors.offset().top,
            "template": (cube_selectors).children().attr("id"),
            "cube_bg": cube_selectors.css("background-image"),
            "input_text": input_text,
            "border-color": cube_selectors.css("border-color"),
            "width": cube_selectors.width(),
            "height": cube_selectors.height()
        }
    });
    for (let cube_id in lines) {
        lines[cube_id] = Array.from(lines[cube_id]);
    }
    state["lines"] = lines;
    state["mini_cubes"] = mini_cubes;
    //console.log(state);
    let fileData = JSON.stringify(state);
    let textToSaveAsBlob = new Blob([fileData], {type: "text/plain"});
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    let fileNameToSaveAs = "export.txt";

    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

//LOAD
LETTER_BEFORE_TEMPLATE_ID = 8;

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function clean_slideshow() {
    $(".Lego").each(function () {
        let belong_to = "[id*=belong_to" + this.id + "]";
        $(belong_to).remove();
        $(this).remove();
    });
    lines = {};
    last_presed_cube = -1;
    actions = [];
    action_index = -1;
}

function load_slideshow(s_state) {
    $("#slideshow").width(s_state["x"]);
    $("#slideshow").height(s_state["y"]);
}

function load_regular_cubes(regular_cubes) {
    for (let cube_id in regular_cubes) {
        if (regular_cubes.hasOwnProperty(cube_id)) {
            //prepare data
            let id = parseInt(cube_id);
            let template_number = 0;
            let x = regular_cubes[id]["x"];
            let y = regular_cubes[id]["y"];
            let cube_bg = regular_cubes[id]["cube_bg"];
            let border_color = regular_cubes[id]["border-color"];
            let width = regular_cubes[id]["width"];
            let height = regular_cubes[id]["height"];

            //re-create
            Create_new_lego(id, fast_creation = true);
            movelego(id, x - $("#" + id).offset().left, y - $("#" + id).offset().top, 80);
            $("#" + id).css("background-image", cube_bg).css("border-color", border_color);
            $("#" + id).width(width).height(height);

            if (regular_cubes[id].hasOwnProperty("template")) {
                template_number = regular_cubes[id]["template"].slice(LETTER_BEFORE_TEMPLATE_ID);//template14 -> 11
                let input_text = regular_cubes[id]["input_text"];//list.
                $("#" + id).load("../assets/html_templates/template_file" + template_number + ".html");
                let input_index = 0;
                setTimeout(function () {
                    $("#" + id).children().children().each(function () {
                            //if its an file input it does not interest me
                            if (!($(this).is("input:file"))) {
                                let text = input_text[input_index];
                                if ($(this).is("input")) {
                                    $(this).val(text);
                                }
                                else {//image
                                    $(this).attr("src", text)
                                }
                                input_index++;
                            }
                        }
                    );
                }, 600)// I want to give the load time
            }
        }
    }
}

function load_regular_lines(new_state_lines) {
    for (let cube_id in new_state_lines) {
        if (new_state_lines.hasOwnProperty(cube_id)) {
            let connected_to = new_state_lines[cube_id];
            for (let i = 0; i < connected_to.length; i++) {
                connect_two_legoes(parseInt(connected_to[i]), parseInt(cube_id))
            }
        }
    }
}

function load_mini_cubes(new_state_mini_cube) {
    // console.log(new_state_mini_cube);
    for (let cube_id in new_state_mini_cube) {
        let append_to = new_state_mini_cube[cube_id];
        //console.log(append_to);
        //append_to: a list of [2,5] two cubes id
        let id1 = append_to[0];
        let id2 = append_to[1];
        let line = $("#middle_line_" + create_line_name(id1, id2));
        Create_mini_circle_for_line(line, fast_creation = true)
    }
}

function load_line_to_mini_cube(new_state_lines) {
    // console.log(new_state_lines);
    for (let cube_id in new_state_lines) {
        let connected_to = new_state_lines[cube_id];
        // console.log(connected_to, connected_to.length);
        for (let i = 0; i < connected_to.length; i++) {
            connect_two_legoes(parseInt(connected_to[i]), parseInt(cube_id))
        }
    }
}

function loadFileAsText() {
    //delete the legos now.
    clean_slideshow();

    setTimeout(function () {
        let fileToLoad = document.getElementById("fileinput").files[0];
        let fileReader = new FileReader();
        fileReader.readAsText(fileToLoad, "UTF-8");
        fileReader.onload = function (fileLoadedEvent) {
            let textFromFileLoaded = fileLoadedEvent.target.result;
            let newstate_all = JSON.parse(textFromFileLoaded);
            let s_state = newstate_all["slideshow"];
            let regular_cubes = newstate_all["cubes"];
            let new_state_lines = newstate_all["lines"];
            let new_state_mini_cube = newstate_all["mini_cubes"];
            load_slideshow(s_state);
            setTimeout(function () {
                load_regular_cubes(regular_cubes);
                setTimeout(function () {
                    load_regular_lines(new_state_lines);
                }, 800);
                setTimeout(function () {
                    load_mini_cubes(new_state_mini_cube);
                }, 1600);
                setTimeout(function () {
                    load_line_to_mini_cube(new_state_lines)
                }, 2200);
            }, 2000);        }
    }, 2000)

}

//
// function first() {
//     return new Promise(function (resolve, reject) {
//         setTimeout((function () {
//             load_regular_cubes(regular_cubes);
//             resolve();
//         }), 4000);
//     });
// }
//
// function second() {
//     console.log("2")
// }
//
// function third() {
//     console.log("3")
// }
//
// first().then(second).then(third);
// }


document.getElementById('fileinput').addEventListener('change', loadFileAsText, false);
