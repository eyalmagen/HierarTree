//$("#edit_text").hide();
last_input_presed = 0;
txt_italic = false;
txt_shade = false;

/*tools*/
$(function () {
    $("#edit_text_icon").click(function () {
        $("#edit_text").toggle("fold", 1000)
    });
});

$(document).ready(function () {
    $("#mycolor").colorpicker({
        color: '#000000',
        displayIndicator: false,
        showOn: "button"
    }).on('change.color', setTextCubeColor)
      .on('mouseover.color', setTextCubeColor);
});
/*initialize*/

/*functions*/


function isDescendant(parentElt, targetElt) {
    //I dont need it but this cool line return true if descendant!!!
    return $(targetElt).closest(parentElt).length > 0
}

function remember_last_pressed_login() {
    //if the user pressed an input
    //we use this setTimeout because when it pressed its not activeElement yet.
    setTimeout(function () {
        if ($(document.activeElement)[0].tagName === "INPUT") {
            last_input_presed = $(document.activeElement);
            // console.log(last_input_presed)
        }
        else {
            //so simple and beautiful - this is just what I needed, no need to doc, simply the
            //last input which was pressed.
            last_input_presed = 0
        }
    }, 10);
}

//very important.
$("#slideshow").on("mousedown", remember_last_pressed_login);

function set_new_value_for_chosen_or_last(value, attr, unit = "") {
    if (last_input_presed) {
        //console.log(attr, value + unit);
        last_input_presed.css(attr, value + unit)
    }
    else {
        $("input").each(function () {
            if (isDescendant($(".chosen_legoes"), $(this))) {
                let input_inside_chosen_lego = $(this);
                input_inside_chosen_lego.css(attr, value + unit)
            }
        })
    }
}

//set text size
$("#txt_size").on("change", function () {
    let font_size = parseInt(this.value) + 10;
    set_new_value_for_chosen_or_last(font_size, "font-size", "px")
});
//set text style
$("#txt_font").on("change", function () {
    let font_style = this.value;
    if (last_input_presed) {
        last_input_presed[0].style.fontFamily = font_style
    }
    else {
        $("input").each(function () {
            if (isDescendant($(".chosen_legoes"), $(this))) {
                let input_inside_chosen_lego = $(this);
                input_inside_chosen_lego[0].style.fontFamily = font_style
            }
        })
    }
});
//set text color
function setTextCubeColor(evt, color) {
    if (color) {
        set_new_value_for_chosen_or_last(color, "color")
    }
}


//set text italic
$("#italic_icon").on("mousedown", function () {
    if(txt_italic){
        set_new_value_for_chosen_or_last("normal", "font-style");
        $("#italic_icon").css("background-color", "rgba(0, 0, 0, 0.28)")
    }
    else{
        set_new_value_for_chosen_or_last("italic", "font-style");
        $("#italic_icon").css("background-color", "rgba(255, 254, 20, 0.36)")
    }
    txt_italic = !txt_italic;

});

//set text shadow
$("#shade_icon").on("mousedown", function () {
    if(txt_shade){
        set_new_value_for_chosen_or_last("0px 0px #000000", "text-shadow");
        $("#shade_icon").css("background-color", "rgba(0, 0, 0, 0.28)")
    }
    else{
        set_new_value_for_chosen_or_last("-1px 1px #000000", "text-shadow");
        $("#shade_icon").css("background-color", "rgba(255, 254, 20, 0.36)")
    }
    txt_shade = !txt_shade;

});

//set text shadow
$("#bold_icon").on("mousedown", function () {
    if(txt_shade){
        set_new_value_for_chosen_or_last("normal", "font-weight");
        $("#bold_icon").css("background-color", "rgba(0, 0, 0, 0.28)")
    }
    else{
        set_new_value_for_chosen_or_last("bold", "font-weight");
        $("#bold_icon").css("background-color", "rgba(255, 254, 20, 0.36)")
    }
    txt_shade = !txt_shade;

});