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

function saveFolder(fld) {
    $.ajax({
        type: "POST",
        url : "/ActionServlet",
        data : {
            action : "savefolder",
            id : fld.id,
            folderName : fld.name,
            isactive : fld == currentFolder
        },
        success : function(responseText) {
            // userdocId = responseText;
            fld.id = responseText;
        },
        async : false
    });
}
function moveDocToFolder(doc, folderId) {
    $.ajax({
        type: "POST",
        url:  "/ActionServlet",
        data: {
            action: "movedoctofolder",
            doc:    doc,
            folder: folderId
        },
        async: false
    });
}

function loadFolders() {
     $.ajax({
        url:  "/ActionServlet",
        data: {
            action: "loadfolders"
        },
        success: function(response) {
            folders = []
            for (var i in response) {
                var f = addFolder(response[i].folderName, response[i].id, []);
                f.documents = [];
                for (var j in response[i].documents) {
                    var doc = addDocument(response[i].documents[j].docName, response[i].documents[j].id, []); 
                    doc.modules.push([]);
                    for (var k in response[i].documents[j].modules) {
                        var module = response[i].documents[j].modules[k];
                        if (module.newline != undefined) {
                            doc.modules.push([]);
                        } else {
                            doc.modules[doc.modules.length - 1].push(Deserialize(module));
                        }
                    }
                    f.documents.push(doc);
                    //DisplayDocument(f.element,doc)
                }
                DisplayFolder(f);
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

function removeFolder(id) {
    var request = {
            action : "removefolder",
            id : id
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
	if (currentDoc != null) {
	    $.ajax({
	        type: "POST",
	        url:  "/ActionServlet",
	        data: {
	            action: "savesettings",
	            id:     currentDoc.id
	        },        
	        async: false
	    });
	}
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
            var isFound = false;
            for (var f in folders) {                
                for (var i in folders[f].documents) {
                    if(folders[f].documents[i].id == docId) {
                        setCurrentFolder(folders[f]);
                        setCurrentDocument(folders[f].documents[i]);
                        isFound = true;
                        break;
                    }
                    if (isFound) {
                        break;
                    }
                }
            }            
        },
        async : false
    });
}
