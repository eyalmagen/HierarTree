/*images backgrounds*/
function readURL(event) {
    /*
    * change the bg for slideshow
    * */
    let getImagePath = URL.createObjectURL(event.target.files[0]);
    $('#slideshow').css('background-image', 'url(' + getImagePath + ')');
}

function readURLforCube(event) {
    /*
    * change bg for chosen legoes
    * */
    let getImagePath = URL.createObjectURL(event.target.files[0]);
    $('.chosen_legoes').each(function () {
        $(this).css('background-image', 'url(' + getImagePath + ')');
    })
}


/*Colors*/
function setUpperCubeColor(evt, color) {
    if (color) {
        $(".chosen_legoes").each(function () {
            $(this).css({'background-image': '-webkit-linear-gradient(top,  ' + color + ' 0%, ' + $('#cube_color2').val() + ' 100%)'});
        })
    }
}

function setLowerCubeColor(evt, color) {
    if (color) {
        $(".chosen_legoes").each(function () {
            $(this).css({'background-image': '-webkit-linear-gradient(top,  ' + $('#cube_color').val() + ' 0%, ' + color + ' 100%)'});
        })
    }
}

function setBorderCubeColor(evt, color) {
    if (color) {
        $(".chosen_legoes").each(function () {
            $(this).css({'border-color': color});
        })
    }
}

function setLineColor(evt, color) {
    if (color) {
        $(".Vertical").each(function () {
            $(this).css('background-color', color);
        });
        $(".Circle").each(function () {
            $(this).css('background-color', color);
        });
        $(".Horizontal").each(function () {
            $(this).css('background-color', color);
        })
    }
}

// the lower upper
$('#cube_color').colorpicker({
    color: '#1c9af1',
    displayIndicator: false,
    showOn: "button"
    //hideButton: true
    //strings: "תבחר צבע"
})
    .on('change.color', setUpperCubeColor)
    .on('mouseover.color', setUpperCubeColor);

// the lower color
$('#cube_color2').colorpicker({
    color: '#1c9af1',
    displayIndicator: false,
    showOn: "button"
})
    .on('change.color', setLowerCubeColor)
    .on('mouseover.color', setLowerCubeColor);

$('#border_color').colorpicker({
    color: '#0d132e',
    displayIndicator: false,
    showOn: "button"
    //hideButton: true
    //strings: "תבחר צבע"
})
    .on('change.color', setBorderCubeColor)
    .on('mouseover.color', setBorderCubeColor);

$('#line_color').colorpicker({
    color: '#171c34',
    displayIndicator: false,
    showOn: "button"
    //hideButton: true
    //strings: "תבחר צבע"
})
    .on('change.color', setLineColor)
    .on('mouseover.color', setLineColor);

/*Cube size sliders*/
function change_cube_width(event) {
    "use strict";
    $('.chosen_legoes').each(function () {
        $(this).css('width', document.getElementById('width_of_lego').value + "%");
    });
}

function change_cube_height(event) {
    "use strict";
    $('.chosen_legoes').each(function () {
        $(this).css('height', document.getElementById('height_of_lego').value + "%");
    });
}

