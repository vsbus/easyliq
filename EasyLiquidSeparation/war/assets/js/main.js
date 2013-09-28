var delay = 0;
var save_all_delay = 1000.0;  // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_change_by_user_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;
var digits_after_point = 3;

var currentModules = [];

var documents = [];
var currentDoc = null;

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

function addDefaultDocument() {
	var name = "Untitled";
	var id = null;
	if (documents.length > 0) {
		name = documents[documents.length - 1].name + "0";
		
	}
	var ndoc = addDocument(name, id);
	SaveDoc(ndoc);
}

function addDocument(name, id) {
    var ndoc = {
        id: id,
        name: name,
        element: document.createElement("input")
    }
    ndoc.element.style.background = "white";
    ndoc.element.setAttribute("type", "button");
    ndoc.element.value = name;
    ndoc.element.onclick = function () {
        setCurrentDocument(ndoc);
    };
    document.getElementById("documents_list").appendChild(ndoc.element);
    documents[documents.length] = ndoc;
    return ndoc;
}

function setCurrentDocument(doc) {
	if (currentDoc != null) {
		currentDoc.element.style.background = "white";
	}
	currentDoc = doc;
	currentDoc.element.style.background = "pink";
}

function initWorkspace() {
    LoadDocs();
	LoadAll();
	if (documents.length == 0) {
		addDefaultDocument();
		//setCurrentDocument(documents[0]);
	}
	setCurrentDocument(documents[0]);
}

function addModule(m) {
    currentModules.push(m);
    drawModule(m);
}

setInterval(Process, delay);
