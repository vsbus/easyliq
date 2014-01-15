var delay = 0;
var save_all_delay = 1000.0; // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_change_by_user_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;
var digits_after_point = 3;
var calculationProcess;
var documents = [];
var folders = [];
var currentDoc = null;
var currentFolder = null;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

function findModulePosition(module) {
    var row_idx;
    var col_idx;
    for ( var i = 0; i < currentDoc.modules.length; i++) {
        for ( var j = 0; j < currentDoc.modules[i].length; j++) {
            if (currentDoc.modules[i][j] == module) {
                row_idx = i;
                col_idx = j;
            }
        }
    }
    return {
        row : row_idx,
        col : col_idx
    };
}

function Process() {
    now = new Date();
    processing_time = now.getTime();

    if (!currentDoc) {
        return;
    }
    for ( var i in currentDoc.modules) {
        for ( var j in currentDoc.modules[i]) {
            var module = currentDoc.modules[i][j];
            if (module.changeByUserTime <= last_processing_time) {
                continue;
            }
            if (processing_time - module.changeByUserTime >= delay) {
                module.calculate();
                // last processing time update MUST be only when something was
                // recalculated.
                last_processing_time = processing_time;
            }
        }
    }

    // Send save request when data was changed after the last saving
    // and last saving was done at least save_all_delay milliseconds ago.
    if (last_change_by_user_time > last_saving_time
            && processing_time - last_saving_time >= save_all_delay) {
        last_saving_time = processing_time;
        saveDoc(currentDoc);
    }
}

function UpdateChangeByUserTime(module, action_time) {
    module.changeByUserTime = action_time;
    last_change_by_user_time = action_time;
}

function addNewDocument() {
    var name = "Untitled";
    var id = null;
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
        saveDoc(ndoc);
        DisplayDocument(ndoc);
        $("#shadow").hide();
        setCurrentDocument(ndoc);
        MoveDocToFolder(currentDoc.id, currentFolder.id);
        saveSettings();
    }
}

function addDefaultFolder() {
    var name = "Untitled Folder";
    var id = null;
    $("#shadow").show();
    var e = document.getElementById("doc_name");
    e.value = name;
    e.focus();
    document.getElementById("save_doc").onclick = function() {
        if (!isValid()) {
            return;
        }
        name = e.value.trim();
        var nfld = addFolder(name, id, []);
        saveFolder(nfld);
        DisplayFolder(nfld);
        $("#shadow").hide();
        setCurrentFolder(nfld);
        // saveSettings();
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

function DisplayFolder(f) {
    document.getElementById("folders_list").appendChild(f.element);
    folders[folders.length] = f
    if (f.documents.length != 0) {
        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav");
        f.element.appendChild(ul);

        for ( var i in f.documents) {
            DisplayFolderDocument(ul, f.documents[i]);
        }
    }
}

function DisplayFolderDocument(parentsEl, doc) {
    parentsEl.appendChild(doc.element);
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
        saveSettings();
    };
    doc.element.appendChild(a);
    return doc;
}

function addFolder(name, id, docs) {
    var fld = {
        id : id,
        name : name,
        documents : docs,
        element : document.createElement("li")
    }
    var a = document.createElement("a");
    DisplayFolderName(name, a);
    a.onclick = function() {
        setCurrentFolder(fld);
        // saveSettings();
    };
    fld.element.appendChild(a);
    return fld;
}

function DisplayDocumentName(name, el) {
    var i = document.createElement("i");
    i.setAttribute("class", "icon-chevron-right");
    el.innerHTML = name;
    el.appendChild(i);
}

function DisplayFolderName(name, el) {
    var i = document.createElement("i");
    i.setAttribute("class", "icon-chevron-right");
    el.innerHTML = name;
    el.appendChild(i);
}

function setCurrentDocument(doc) {
    if (currentDoc != null) {
        currentDoc.element.setAttribute("class", "");
    }
    currentDoc = doc;
    currentDoc.element.setAttribute("class", "active");
    renderModules();
}

function setCurrentFolder(doc) {
    if (currentFolder != null) {
        currentFolder.element.setAttribute("class", "");
    }
    currentFolder = doc;
    currentFolder.element.setAttribute("class", "active");

}
function initWorkspace() {
    loadDocs();
    loadFolders();
    loadSettings();
    if (documents.length == 0) {
        addNewDocument();
    }
    if (folders.length == 0) {
        addDefaultFolder();
    }
    if (currentDoc == null) {
        setCurrentDocument(documents[0]);
    }
    if (currentFolder == null) {
        setCurrentFolder(folders[0]);
    }
    turnCalculationProcessOn();
}

function turnCalculationProcessOn() {
    calculationProcess = setInterval(Process, delay);
}

function turnCalculationProcessOff() {
    clearInterval(calculationProcess);
}

function addModule(m) {
    var modules = currentDoc.modules;
    if (modules.length == 0) {
        modules.push([]);
    }
    modules[modules.length - 1].push(m);
    renderModules();
}
