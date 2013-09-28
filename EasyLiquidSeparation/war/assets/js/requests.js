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

function SaveDoc(doc) {
    $.ajax({
        url: "/ActionServlet",
       // beforeSend: function(){$("#overlay").show(); alert("show");},
        //complete: function(){$("#overlay").hide(); alert("hide");},
        data: {action : "savedoc", id : doc.id, docName : doc.name},
        success: function(responseText) {
            userdocId = responseText;
            doc.id = responseText;
            },
        async:   false
   });
}

function LoadAll() {
    var request = {
        action : "load"
    }
    main_menu = document.getElementById("main_menu");
    main_menu.style.visibility = "hidden";
    status_msg = document.getElementById("status_message");
    status_msg.textContent = "Loading...";
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
        status_msg.textContent = "";
    });
}

function LoadDocs() {
    $.ajax({
        url: "/ActionServlet",
        data: {action : "loaddoc"},
        success: function(response) {
                // Remove controls from UI.
                for (var i in currentModules) {
                    var c = currentModules[i].control;
                    c.parentNode.removeChild(c);
                }
                // Clear modules array.
                documents = []
                // Create new modules that download from DB.
                for (var i in response) {
                    addDocument(response[i].docName, response[i].id);
                }
            },
        async:   false
   });
}

function removeDoc(){
    var request = {
            action : "removedoc",
            docName: currentDoc.name,
            id: currentDoc.id
        } 
    $.get('ActionServlet', request, function(response) {
    });    
}

function Serialize(module) {
    var values = {}
    for (p in module.parameters_meta) {
        values[p] = module.parameters_meta[p].value
    }
    var co = [];
    for (var i in module.combos) {
        co[i] = module.combos[i].currentValue;
    }
    var representators = {};
    for ( var group in module.groups_meta) {
        representators[group] = module.groups_meta[group].representator;//.push(module.groups_meta[group].representator);
    }
    
    var map = {
        name: module.constructor.name,
        position: module.position,
        parameters: values,
        calc_options: co,
        inputs: representators
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

    for(var i in response_map.calc_options) {
        module.combos[i].currentValue = response_map.calc_options[i];
    }        

    for(var i in response_map.inputs) {
        module.groups_meta[i].representator = response_map.inputs[i];
    }
    
    return module
}
