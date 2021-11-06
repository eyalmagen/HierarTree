let x = parseInt($("#slideshow").offset().left);
let y = parseInt($("#slideshow").offset().top);
$(function () {
    $("#btnSave").click(function () {

    })
});

function get_screen(){

    let save_border_radius = $("#slideshow").css("border-radius");
    $("#slideshow").css("border-radius", "0%");

    // console.log(x, y);
    /*
    $(".Lego").each(function () {
        movelego((this).id, -x, -y, 0)
    });
    */
    // setTimeout(function () {
        domtoimage.toJpeg(document.getElementById('slideshow'), {quality: 1})
            .then(function (dataUrl) {
                let link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
    $("#slideshow").css("border-radius", save_border_radius);
    // }, 5)
    /*
    $(".Lego").each(function () {
        movelego((this).id, x, y, 10);

    });
    */
}