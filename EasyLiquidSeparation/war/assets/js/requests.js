function SaveAll() {
    var modules = []
    for ( var i in currentModules) {
        modules[i] = Serialize(currentModules[i])
    }
    var request = {
        id : userdocId,
        action : "save",
        modules : modules
    }
    $.get('ActionServlet', request, function(responseText) {
        userdocId = responseText;
    });
}

function LoadAll() {
    var request = {
        action : "load"
    }
    main_menu = document.getElementById("main_menu");
    main_menu.style.visibility = "hidden";
    $.get('ActionServlet', request, function(response) {
        // Remove controls from UI.
        for (var i in currentModules) {
            var c = currentModules[i].control;
            c.parentNode.removeChild(c);
        }
        // Clear modules array.
        currentModules = []
        // Create new modules that download from DB.
        for (var i in response) {
            var module = Deserialize(response[i])
            addModule(module)
        }
        main_menu.style.visibility = "visible";
    });
}

function Serialize(module) {
    var values = {}
    for (p in module.parameters_meta) {
        values[p] = module.parameters_meta[p].value
    }
    var map = {
        name: module.constructor.name,
        position: module.position,
        parameters: values
    }
    return JSON.stringify(map)
}

function Deserialize(response_map) {
    var module;
    switch (response_map.name) {
    case "RfFromCakeSaturation":
        module = new RfFromCakeSaturation();
        break;
    case "DensityConcentration":
        module = new DensityConcentration();
        break;
    }
    module.updateParameters(response_map.parameters);
    module.id = response_map.id;
    module.position = response_map.position;
    return module
}
