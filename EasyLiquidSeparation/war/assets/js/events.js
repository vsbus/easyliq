function parameterValueChanged(m, parameter) {
    var pmeta = m.parameters_meta[parameter];
    if (pmeta.group == m.calculatedGroup) {
        return;
    }
    setGroupRepresentator(m, parameter);
    var meta = m.parameters_meta[parameter];
    meta.value = meta.element.value * map[meta.unit];
    action_time = (new Date()).getTime();
    UpdateChangeByUserTime(m, action_time);
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

function removeDocumentClick() {
	if (currentDoc != null) {
	    removeDoc();
		document.getElementById("documents_list").removeChild(currentDoc.element);
		var idx = documents.indexOf(currentDoc);
        documents.splice(idx, 1);
        if (idx == documents.length) {
        	idx = idx - 1;
        }
        if (idx < 0) {
        	addNewDocument();
        	idx = 0;
        }
        setCurrentDocument(documents[idx]);
        saveSettings();
	}
}

function removeFolderClick() {
    removeFolder(currentFolder.id);
}


function renameDocumentClick() {
    if (currentDoc != null) {
        $("#shadow").show();
        $("#docname_popup").show();    
        $("#folders_popup").hide();
        var e = document.getElementById("doc_name");
        e.value = currentDoc.name;
        e.focus();
        document.getElementById("save_doc").onclick = function(){
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
   // MoveDocToFolder(currentDoc.id, currentFolder.id);
}
function renameFolderClick() {
    if (currentFolder != null) {
        $("#shadow").show();
        $("#docname_popup").show();    
        $("#folders_popup").hide();
        var e = document.getElementById("doc_name");
        e.value = currentFolder.name;
        e.focus();
        document.getElementById("save_doc").onclick = function(){
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

function moveDocumentToFolderClick() {
    $("#shadow").show();
    $("#docname_popup").hide();    
    $("#folders_popup").show();
    
    $("#foldernames_list").empty();
    var select = document.getElementById("foldernames_list");    
    
    for(var i = 0; i < folders.length; i++) {
            var el = document.createElement("option");
            el.value = folders[i].id;
            el.innerHTML = folders[i].name;
            select.appendChild(el);
        }
    document.getElementById("save_changes").onclick = function(){        
        MoveDocToFolder(currentDoc.id, select.selectedOptions[0].value);
        $("#shadow").hide();
    }
}


function cancelDocumentNameChange() {
    document.getElementById('valid_message').innerHTML='';
    $('#shadow').hide();
}