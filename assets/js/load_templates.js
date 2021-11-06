

//fill drop down.
for (let i = 1; i < 17; i++) {
    $("#tm" + i).load("../assets/html_templates/template_file" + i + ".html")
        .click(function () {
            change_template(i)
        });
}

//hide all other template.
function hide_all() {
    /*    hide all the templates slowly    */
    $(".chosen_legoes").each(function () {
        $('#' + this.id).children().each(function () {
            $(this).hide("slow");
        });
    })
}

//set the wanted template.
function change_template(template_number) {
    //console.log("enter change_template" );
    hide_all();
    setTimeout(function () {
        $(".chosen_legoes").each(function () {
            $('#' + this.id)
                .load("../assets/html_templates/template_file" + template_number + ".html");
        });
    }, 700);
}

//for loading images purposes.
function readURL_UploadImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#' + last_presed_cube + ' img')
                .attr('src', e.target.result);
            //erase the input!
            $("#" + last_presed_cube + " input[type='file']").hide()
        };
        reader.readAsDataURL(input.files[0]);
    }
}