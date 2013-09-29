function SaveDoc(doc) {
    var modules = []
    for ( var i in doc.modules) {
        modules[i] = Serialize(doc.modules[i])
    }

    $.ajax({
        url : "/ActionServlet",
        // beforeSend: function(){$("#overlay").show(); console.log("show");},
        // complete: function(){$("#overlay").hide(); console.log("hide");},
        data : {
            action : "savedoc",
            id : doc.id,
            docName : doc.name,
            modules : modules
        },
        success : function(responseText) {
            userdocId = responseText;
            doc.id = responseText;
        },
        async : false
    });
    // $("#overlay").hide(); console.log("hide");
}
function LoadDocs() {
    $.ajax({
        url : "/ActionServlet",
        data : {
            action : "loaddoc"
        },
        success : function(response) {
            // Remove controls from UI.
            ClearModulesSection();
            // Clear modules array.
            documents = []
            // Create new modules that download from DB.
            for ( var i in response) {
                var doc = addDocument(response[i].docName, response[i].id, []);
                for ( var j in response[i].modules) {
                    var module = Deserialize(response[i].modules[j]);
                    doc.modules.push(module);
                    // addModule(module)
                }
                DisplayDocument(doc);
            }
        },
        async : false
    });
}

function removeDoc() {
    var request = {
        action : "removedoc",
        docName : currentDoc.name,
        id : currentDoc.id
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
    for ( var i in module.combos) {
        co[i] = module.combos[i].currentValue;
    }
    var representators = {};
    for ( var group in module.groups_meta) {
        representators[group] = module.groups_meta[group].representator;// .push(module.groups_meta[group].representator);
    }

    var map = {
        name : module.constructor.name,
        position : module.position,
        parameters : values,
        calc_options : co,
        inputs : representators
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

    for ( var i in response_map.calc_options) {
        module.combos[i].currentValue = response_map.calc_options[i];
    }

    for ( var i in response_map.inputs) {
        module.groups_meta[i].representator = response_map.inputs[i];
    }

    return module
}
