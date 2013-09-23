function parameterValueChanged(m, parameter) {
    var pmeta = m.parameters_meta[parameter];
    if (pmeta.group == m.calculatedGroup) {
        return;
    }
    var meta = m.parameters_meta[parameter];
    m.groups_meta[meta.group].representator = parameter;
    meta.value = meta.element.value * map[meta.unit];
    action_time = (new Date()).getTime();
    for (var i in currentModules) {
        if (currentModules[i] == m) {
            currentModules[i].editTime = action_time;
            last_parameter_change_time = action_time;
        }
    }
}

function addModuleButtonClick(module) {
	addModule(module);
	SaveAll();
}
