var delay = 0;
var save_all_delay = 1000.0;  // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_parameter_change_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;

var currentModules = [];

function Process() {
    now = new Date();
    processing_time = now.getTime();
    
    for (var i in currentModules) {
        if (currentModules[i].editTime <= last_processing_time) {
            continue;
        }
        if (processing_time - currentModules[i].editTime >= delay) {
            currentModules[i].calculate();
        }
    }
    last_processing_time = processing_time;

    if (last_parameter_change_time > last_saving_time &&
    		processing_time - last_saving_time >= save_all_delay) {
    	last_saving_time = processing_time;
    	SaveAll();
    }
}

function addModule(m) {
    currentModules.push(m);
    drawModule(m);
}

setInterval(Process, delay);
