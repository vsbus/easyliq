var delay = 0;
var save_all_delay = 1000.0;  // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_change_by_user_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;
var digits_after_point = 3;

var currentModules = [];

function Process() {
    now = new Date();
    processing_time = now.getTime();
    
    for (var i in currentModules) {
        if (currentModules[i].changeByUserTime <= last_processing_time) {
            continue;
        }
        if (processing_time - currentModules[i].changeByUserTime >= delay) {
            currentModules[i].calculate();
            // last processing time update MUST be only when something was
            // recalculated.
            last_processing_time = processing_time;
        }
    }

    // Send save request when data was changed after the last saving
    // and last saving was done at least save_all_delay milliseconds ago.
    if (last_change_by_user_time > last_saving_time
            && processing_time - last_saving_time >= save_all_delay) {
        last_saving_time = processing_time;
        SaveAll();
    }
}

function UpdateChangeByUserTime(module, action_time) {
    module.changeByUserTime = action_time; 
    last_change_by_user_time = action_time;
}

function addModule(m) {
    currentModules.push(m);
    drawModule(m);
}

setInterval(Process, delay);
