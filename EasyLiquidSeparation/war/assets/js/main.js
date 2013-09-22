var delay = 0;
var last_user_action_time = (new Date(2013, 0, 1)).getTime();
var last_processing_time = (new Date(2013, 0, 1)).getTime();

var currentModules = [];

function Process() {
    for (var i in currentModules) {
        if (currentModules[i].editTime <= last_processing_time) {
            continue;
        }
        now = new Date()
        timediff = now.getTime() - currentModules[i].editTime;
        if (timediff < delay) {
            continue;
        }
        currentModules[i].calculate();
        last_processing_time = now.getTime();
    }
}

function addModule(m) {
    currentModules.push(m)
    drawModule(m);
    SaveAll();
}

setInterval(Process, delay)
