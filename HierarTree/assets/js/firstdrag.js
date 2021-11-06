//x1 = 0
//y1 = 0
interact('.draggable_for_line')
    .draggable({
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,
        // call this function on every dragmove event
        onmove: dragMoveListener_for_lines,
        // call this function on every dragend event
        onend: function (event) {
            let target = event.target;
            movelego($(target).id, 0, 9, 0)
        }
    });


// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,
        // / call this function on every dragmove start event
        onstart: function (event) {
            "use strict";
            mouse_down_function(event)
        },
        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            mouse_up_function(event)
        }
    })

    .resizable({
        preserveAspectRatio: true,
        edges: {left: false, right: false, bottom: false, top: true}
    })
    .on('resizemove', function (event) {
        $(".chosen_legoes").each(function () {

            let target = this,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });
    });

function dragMoveListener_for_lines(event) {
    //connect_two_legoes(1,2)
    let ids_set = get_lego_ids_connected_to_the_dragged_lego(event.target.id);
    for (let item of ids_set)
        connect_two_legoes(item, event.target.id, true);

    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;

    // translate the element

    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px,0' + 'px)';
    // update the posiion attributes
    target.setAttribute('data-x', x);
}
function dragMoveListener(event) {
    //connect_two_legoes(1,2)
    let ids_set = get_lego_ids_connected_to_the_dragged_lego(event.target.id);
    for (let item of ids_set)
        connect_two_legoes(item, event.target.id, true);

    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    if (target.classList.contains('chosen_legoes')) {

        $(".chosen_legoes").each(function () {
            //console.log((this.id), target.id)
            if ((this.id) !== target.id) {
                x = (parseFloat(this.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(this.getAttribute('data-y')) || 0) + event.dy;
                this.style.webkitTransform =
                    this.style.transform =
                        'translate(' + x + 'px, ' + y + 'px)';
                // update the position attributes
                this.setAttribute('data-x', x);
                this.setAttribute('data-y', y);
                let ids_set = get_lego_ids_connected_to_the_dragged_lego(this.id);
                for (let item of ids_set)
                    connect_two_legoes(item, this.id, true);
            }
        });

    }

}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

function get_lego_ids_connected_to_the_dragged_lego(dragged_id) {
    ////////////////
    // gets lego id and return a set of ids of the
    // legoes that have connection with that lego
    ////////////////


    // define a set
    let mySet = new Set();
    // all the lines that have the string (belong_to + dragged_id)
    let belong_to = "[id*=belong_to" + dragged_id + "]";

    // iterate over all the wanted full line ids, and extract the id of the legoes
    $(belong_to).each(function () {
        let array_of_line_id = (this.id).split("belong_to");
        //first and second lego id in the line id
        mySet.add(array_of_line_id[1]);
        mySet.add(array_of_line_id[2]);
    });
    // we dont want the same id of the lego wich
    mySet.delete(dragged_id);
    return mySet
}


function keep_lines_attached_to_lego(id) {
    ////////////////
    // simply keeps the lego attached when moves
    ////////////////
    let ids_set = get_lego_ids_connected_to_the_dragged_lego(id);
    for (let item of ids_set)
        connect_two_legoes(item, id)
}