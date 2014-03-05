var delay = 0;
var save_all_delay = 1000.0; // Save all in 1 second after the last change.
var FAR_AGO = (new Date(2013, 0, 1)).getTime();
var last_change_by_user_time = FAR_AGO;
var last_saving_time = FAR_AGO;
var last_processing_time = FAR_AGO;
var digits_after_point = 3;
var calculationProcess;
var folders = [];
var currentDoc = null;
var currentFolder = null;
var displayProjectComments = false;
var displayDocumentComments = false;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

function findModulePosition(module) {
    var row_idx;
    var col_idx;
    for (var i = 0; i < currentDoc.modules.length; i++) {
        for (var j = 0; j < currentDoc.modules[i].length; j++) {
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
    for (var i in currentDoc.modules) {
        for (var j in currentDoc.modules[i]) {
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

// Updates time when the module was changed. This time is used to avoid sending
// save requests many times in a row.
function UpdateChangeByUserTime(module) {
	var action_time = (new Date()).getTime();
    module.changeByUserTime = action_time;
    last_change_by_user_time = action_time;
}

function addNewDocument() {
    var name = "Untitled";
    var id = null;
    $("#shadow").show();
    $("#newname_popup").show();
    var e = document.getElementById("new_name");
    e.value = name;
    e.focus();
    document.getElementById("save_name").onclick = function() {
        if (!isValid()) {
            return;
        }
        name = e.value.trim();
        var ndoc = addDocument(name, id, []);
        saveDoc(ndoc);
        moveDocToFolder(ndoc.id, currentFolder.id);
        DisplayDocument(ndoc);
        $("#shadow").hide();
        setCurrentDocument(ndoc);
        saveSettings();
    }
}

function removeCurrentDocument() {
    if (currentDoc != null) {
        removeDoc();
        var docList = currentFolder.element.getElementsByTagName("ul")[0];
        docList.removeChild(currentDoc.element);
        var idx = currentFolder.documents.indexOf(currentDoc);
        currentFolder.documents.splice(idx, 1);
        if (idx == currentFolder.documents.length) {
            idx = idx - 1;
        }
        setCurrentDocument(currentFolder.documents[idx]);
    }
}

function addDefaultFolder() {
    var name = "Untitled Project";
    var id = null;
    $("#shadow").show();
    $("#newname_popup").show();
    var e = document.getElementById("new_name");
    e.value = name;
    e.focus();
    document.getElementById("save_name").onclick = function() {
        if (!isValid()) {
            return;
        }
        name = e.value.trim();
        var nfld = addFolder(name, id, []);
        saveFolder(nfld);
        DisplayFolder(nfld);
        $("#shadow").hide();
        setCurrentFolder(nfld);
    }
}

function isValid() {
    var e = document.getElementById("new_name").value;
    var m = document.getElementById("valid_message");
    if (e.trim()) {
        m.innerHTML = "";
        return true;
    } else {
        m.innerHTML = "please input nonempty name";
        return false;
    }
}

function DisplayFolder(folder) {
    document.getElementById("folders_list").appendChild(folder.element);
    folders[folders.length] = folder
    if (folder.documents.length != 0) {
        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav");
        folder.element.appendChild(ul);

        for (var i in folder.documents) {
            DisplayFolderDocument(ul, folder.documents[i]);
        }
    }
}

function DisplayFolderDocument(parentsEl, doc) {
    parentsEl.appendChild(doc.element);
}

function DisplayDocument(doc) {
    if (currentFolder.documents.length == 0) {
        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav");
        currentFolder.element.appendChild(ul);
    }
    var el = currentFolder.element.getElementsByTagName("ul")[0]; 
    el.appendChild(doc.element);
    currentFolder.documents[currentFolder.documents.length] = doc;
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
    	// After selecting the document current folder also changes.
        setCurrentFolder(getParentFolder(doc));
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
    	// After selecting the folder current document is set to its first document.
        if (fld.documents.length > 0 && fld.documents[0] != null) {
        	setCurrentDocument(fld.documents[0]);
        }
        saveSettings();
    };
    fld.element.appendChild(a);
    return fld;
}

function DisplayDocumentName(name, el) {
    var i = document.createElement("i");
    el.innerHTML = name;
    el.appendChild(i);
}

function DisplayFolderName(name, el) {
    var i = document.createElement("i");
    el.innerHTML = name;
    el.appendChild(i);
}

function getParentFolder(doc) {
    for (var i in folders) {
        if (folders[i].documents.indexOf(doc) != -1) {
            return folders[i];
        }
    }
    return null;
}

function setCurrentDocument(doc) {
    if (currentDoc != null) {
        currentDoc.element.removeAttribute("class");
    }
    currentDoc = doc;
    if (currentDoc != null) {
    	currentDoc.element.setAttribute("class", "active");
    }
    renderModules();
}

function setCurrentFolder(fld) {
    if (currentFolder != null) {
        currentFolder.element.removeAttribute("class");
    }
    currentFolder = fld;
    if (currentFolder != null) {
    	currentFolder.element.setAttribute("class", "active");
    }
}
function initWorkspace() {
    loadFolders();
    loadSettings();
    if (folders.length == 0) {
        addDefaultFolder();
    }
    if (currentFolder == null) {
        setCurrentFolder(folders[0]);
    }
    if (currentDoc == null) {
        setCurrentDocument(currentFolder.documents[0]);
    }
    updateCommentsDisplay();
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
