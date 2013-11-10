var NEW_LINE = '{"newline":""}';

function saveDoc(doc) {
    var modules = []
    for (var i = 0; i < doc.modules.length; i++) {
    	if (i != 0) {
    		if (modules.length == 0 ||
    				modules[modules.length - 1] != NEW_LINE) {
    			modules.push(NEW_LINE);
    		}
    	}
		for (var j in doc.modules[i]) {
			modules.push(Serialize(doc.modules[i][j]));
		}
    }
    $.ajax({
    	type: "POST",
        url : "/ActionServlet",
        data : {
            action : "savedoc",
            id : doc.id,
            docName : doc.name,
            modules : modules,
            isactive : doc == currentDoc
        },
        success : function(responseText) {
            userdocId = responseText;
            doc.id = responseText;
        },
        async : false
    });
}

function loadDocs() {
    $.ajax({
        url : "/ActionServlet",
        data : {
            action : "loaddoc"
        },
        success : function(response) {
            // Clear modules array.
            documents = []
            // Create new modules that download from DB.
            for (var i in response) {
                var doc = addDocument(response[i].docName, response[i].id, []);
                doc.modules.push([]);
                for (var j in response[i].modules) {
                	var module = response[i].modules[j];
                	if (module.newline != undefined) {
                		doc.modules.push([]);
                	} else {
                		doc.modules[doc.modules.length - 1].push(Deserialize(module));
                	}
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
    for (var i in module.combos) {
        co[i] = module.combos[i].currentValue;
    }
    var representators = {};
    for (var group in module.groups_meta) {
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

    for (var i in response_map.calc_options) {
        module.combos[i].currentValue = response_map.calc_options[i];
    }

    for (var i in response_map.inputs) {
        module.groups_meta[i].representator = response_map.inputs[i];
    }

    return module;
}

function saveSettings() {   
    $.ajax({
        type: "POST",
        url : "/ActionServlet",
        data : {
            action : "savesettings",
            id : currentDoc.id
        },        
        async : false
    });
}

function loadSettings() {   
    $.ajax({
        type: "POST",
        url : "/ActionServlet",
        data : {
            action : "loadsettings",            
        },        
        success : function(responseText) {
            docId = responseText;
            for (var i in documents) {
                if(documents[i].id == docId) {
                    setCurrentDocument(documents[i]);
                    break;
                }
            }            
        },
        async : false
    });
}