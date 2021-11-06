is_mouse_down = false;
slide = $("#slideshow");
$("#chosen_area").hide();
chosen_rec = document.getElementById("chosen_area"), x1 = 0, y1 = 0, x2 = 0, y2 = 0;

function mouse_down_func(e) {
    /*
     when the mouse is down
    */
    // this is true no matter what
    //console.log("enter mouse_down_func");
    is_mouse_down = true;
    // the lego for lines making is no longer it.
    unchose_lego_for_lines_making();
    //unmark all legoes
    $(".Lego").each(function () {
        $(this).removeClass("chosen_legoes");

    });
    y1 = e.clientY;
    x1 = e.clientX;
    reCalc();

}


function mouse_move_func(e) {
    //we dont want to change size as long the mouse is up.
    //console.log("enter mouse_move_func", is_mouse_down);
    if (is_mouse_down) {

        x2 = e.clientX;
        y2 = e.clientY;
        reCalc();
        // iterate over all the legoes

        $(".Lego").each(function () {
            if (divs_collision($(this), $("#chosen_area"))) {
                $(this).addClass("chosen_legoes");
            }
            else {
                $(this).removeClass("chosen_legoes");
            }
        });
        // if the rect is big enough to show itself
        if (is_big_enough()) {
            $("#chosen_area").show();
        }
    }
}


function mouse_up_func(e) {
    //always true - todo - check bug if mouse up not in slideshow
    //console.log("enter mouse_up_func");
    is_mouse_down = false;
    $("#chosen_area").hide();
}


slide.on("mousedown", mouse_down_func);
slide.on("mousemove", mouse_move_func);
slide.on("mouseup", mouse_up_func);

function divs_collision(div1, div2) {
    /*
    get two rect and return true if they intersect
    */
    let x1 = $(div1).offset().left;
    let y1 = $(div1).offset().top;
    let h1 = $(div1).outerHeight();
    let w1 = $(div1).outerWidth();
    let b1 = y1 + h1;
    let r1 = x1 + w1;
    let x2 = $(div2).offset().left;
    let y2 = $(div2).offset().top;
    let h2 = $(div2).outerHeight();
    let w2 = $(div2).outerWidth();
    let b2 = y2 + h2;
    let r2 = x2 + w2;
    return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
}


function is_point_inside_rect(point_e, div) {
    let x = $(div).offset().left;
    let y = $(div).offset().top;
    let h = $(div).outerHeight();
    let w = $(div).outerWidth();
    let b = y + h;
    let r = x + w;
    let point_x = point_e.clientX;
    let point_y = point_e.clientY;
    //console.log("px: ", point_x, "py: ",point_y)
    //console.log("top: ", Math.floor(y), "bottom: ", Math.floor(b), "left: ", Math.floor(x), "right: ", Math.floor(r))
    return (point_x < r && point_x > x && point_y < b && point_y > y);

}


function reCalc() {
    /*
    this one is resizing the chosing rect
    */
    let scrollAmount = $(window).scrollTop();
    let x3 = Math.min(x1, x2);
    let x4 = Math.max(x1, x2);
    let y3 = Math.min(y1, y2);
    let y4 = Math.max(y1, y2);
    //console.log("x:",x3,"-",x4,"y:",y3,"-",y4)
    chosen_rec.style.left = x3 + "px";
    chosen_rec.style.top = y3 + scrollAmount + "px";
    chosen_rec.style.width = x4 - x3 + "px";
    chosen_rec.style.height = y4 - y3 + "px";
}


function is_big_enough() {
    let x3 = Math.min(x1, x2);
    let x4 = Math.max(x1, x2);
    let y3 = Math.min(y1, y2);
    let y4 = Math.max(y1, y2);
    let w = x4 - x3;
    let h = y4 - y3;
    return (w * h < 5);
}
