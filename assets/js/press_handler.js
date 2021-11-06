function KeyPress(e) {
    let evtobj = window.event ? event : e;
    // arrange the legoes
    if (evtobj.keyCode === 'A'.charCodeAt(0) && evtobj.altKey) {
        if ($('.chosen_legoes').length > 1)
            fix_lines2($(".chosen_legoes"));
        else
            fix_lines2($(".Lego"))
    }
    // delete the lego
    if (evtobj.keyCode === 'R'.charCodeAt(0) && evtobj.altKey) {
        Delete_lego()
    }
    // create new lego
    if (evtobj.keyCode === 'N'.charCodeAt(0) && evtobj.altKey) {
        Create_new_lego()
    }
    // revert last action
    if (evtobj.keyCode === 'Z'.charCodeAt(0) && evtobj.altKey) {
        revert_last_action()
    }
    // screenshot
    if (evtobj.keyCode === 'S'.charCodeAt(0) && evtobj.altKey && presentation_mode === true) {
        get_screen()
    }

    //escape presentation mode
    //27  is escape. 8 is backspace.
    if ((evtobj.keyCode === 27 || evtobj.keyCode === 8) && presentation_mode === true) {
        exit_presentation_mode()
    }
}

document.onkeydown = KeyPress;