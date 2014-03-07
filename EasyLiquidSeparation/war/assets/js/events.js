function parameterValueChanged(m, parameter) {
    var pmeta = m.parameters_meta[parameter];
    if (pmeta.group == m.calculatedGroup) {
        return;
    }
    setGroupRepresentator(m, parameter);
    var meta = m.parameters_meta[parameter];
    meta.value = meta.element.value * map[meta.unit];
    UpdateChangeByUserTime(m);
}

function addModuleButtonClick(module) {
    addModule(module);
    saveDoc(currentDoc);
}

function addModulesRowButtonClick() {
    currentDoc.modules.push([]);
    renderModules();
    saveDoc(currentDoc);
}

function triggerProjectComments() {
	if (displayProjectComments) {
		displayProjectComments = false;
	} else {
		displayProjectComments = true;
	}
	updateCommentsDisplay();
	saveSettings();
}

function triggerDocumentComments() {
	if (displayDocumentComments) {
		displayDocumentComments = false;
	} else {
		displayDocumentComments = true;
	}
	updateCommentsDisplay();
	saveSettings();
}

function documentCommentsChanged() {
	if (currentDoc != null) {
	    var e = document.getElementById("document_comments");
	    currentDoc.comments = e.value;
	 	UpdateChangeByUserTime(null);
	}
}

function projectCommentsChanged() {
	if (currentFolder != null) {
	    var e = document.getElementById("project_comments");
	    currentFolder.comments = e.value;
	 	UpdateChangeByUserTime(null);
	}
}

function removeDocumentClick() {
    removeCurrentDocument();
    // removeCurrentDocument doesn't use any pop-up windows so we can save
    // settings after it's call.  
    saveSettings();
}

function removeFolderClick() {
    removeFolder(currentFolder.id);
    currentFolder.element.parentElement.removeChild(currentFolder.element);
    var idx = folders.indexOf(currentFolder);
    folders.splice(idx, 1);
    if (idx == folders.length) {
        idx = idx - 1;
    }
    if (folders.length > 0) {
	    fld = folders[idx];
	    setCurrentFolder(fld);
	    if (fld.documents.length > 0 && fld.documents[0] != null) {
	    	setCurrentDocument(fld.documents[0]);
	    }
    }
    else {
        setCurrentDocument(null);
    }
}

function renameDocumentClick() {
    if (currentDoc != null) {
        $("#shadow").show();
        $("#newname_popup").show();
        var e = document.getElementById("new_name");
        e.value = currentDoc.name;
        e.focus();
        document.getElementById("save_name").onclick = function(){
            if(!isValid()) {
                return;
            }
            currentDoc.name = e.value.trim();
            DisplayDocumentName(currentDoc.name, currentDoc.element.getElementsByTagName("a")[0]);
            saveDoc(currentDoc);
            $("#shadow").hide();
        }
    }
}
function addDocumentToCurrentFolderClick() {
    addNewDocument();
}
function renameFolderClick() {
    if (currentFolder != null) {
        $("#shadow").show();
        $("#newname_popup").show();
        var e = document.getElementById("new_name");
        e.value = currentFolder.name;
        e.focus();
        document.getElementById("save_name").onclick = function(){
            if(!isValid()) {
                return;
            }
            currentFolder.name = e.value.trim();
            DisplayFolderName(currentFolder.name, currentFolder.element.getElementsByTagName("a")[0]);
            saveFolder(currentFolder);
            $("#shadow").hide();
        }
    }
}

function cancelButtonClick() {
    document.getElementById('valid_message').innerHTML='';
    $('#shadow').hide();
}
