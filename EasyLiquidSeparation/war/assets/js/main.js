var delay = 0;
var save_all_delay = 1000.0; // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_change_by_user_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;
var digits_after_point = 3;

var documents = [];
var currentDoc = null;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

function Process() {
    now = new Date();
    processing_time = now.getTime();

    if (!currentDoc) {
        return;
    }
    for ( var i in currentDoc.modules) {
        if (currentDoc.modules[i].changeByUserTime <= last_processing_time) {
            continue;
        }
        if (processing_time - currentDoc.modules[i].changeByUserTime >= delay) {
            currentDoc.modules[i].calculate();
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
        SaveDoc(currentDoc);
    }
}

function UpdateChangeByUserTime(module, action_time) {
    module.changeByUserTime = action_time;
    last_change_by_user_time = action_time;
}

function addDefaultDocument() {
    var name = "Untitled";
    var id = null;
    /*if (documents.length > 0) {
        name = documents[documents.length - 1].name + "0";
    } */
    $("#shadow").show();
    var e = document.getElementById("doc_name");
    e.value = name;
    e.focus();
    document.getElementById("save_doc").onclick = function() {
        if (!isValid()) {
            return;
        }
        name = e.value.trim();
        var ndoc = addDocument(name, id, []);
        SaveDoc(ndoc);
        DisplayDocument(ndoc);
        setCurrentDocument(ndoc);

        $("#shadow").hide();
    }
}

function isValid() {
    var e = document.getElementById("doc_name").value;
    var m = document.getElementById("valid_message");
    if (e.trim()) {
        m.innerHTML = "";
        return true;
    } else {
        m.innerHTML = "please input nonempty name";
        return false;
    }
}

function DisplayDocument(doc) {
    document.getElementById("documents_list").appendChild(doc.element);
    documents[documents.length] = doc;
}

function addDocument(name, id, modules) {
    var doc = {
        id : id,
        name : name,
        modules : modules,
        element : document.createElement("li")
    }
    var a = document.createElement("a");
    DisplayDocumentName(name, a);
    a.onclick = function() {
        setCurrentDocument(doc);
    };
    doc.element.appendChild(a);
    return doc;
}

function DisplayDocumentName(name, el) {    
    var i = document.createElement("i");
    i.setAttribute("class", "icon-chevron-right");
    el.innerHTML = name;
    el.appendChild(i);
}

function ClearModulesSection() {
    if (!currentDoc) {
        return;
    }

    for ( var i in currentDoc.modules) {
        var c = currentDoc.modules[i].control;
        c.parentNode.removeChild(c);
    }
}

function setCurrentDocument(doc) {
    ClearModulesSection();
    if (currentDoc != null) {
        currentDoc.element.setAttribute("class", "");
    }
    currentDoc = doc;
    currentDoc.element.setAttribute("class", "active");

    for (var i in doc.modules) {
        addModuleDiv(doc.modules[i]);
    }
}

function initWorkspace() {
    LoadDocs();
    if (documents.length == 0) {
        addDefaultDocument();
    }
    setCurrentDocument(documents[0]);
    setInterval(Process, delay);
}

function addModule(m) {
    currentDoc.modules.push(m);
    addModuleDiv(m);
}
