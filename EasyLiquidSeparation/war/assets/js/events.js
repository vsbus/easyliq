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
	SaveDoc(currentDoc);
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
        	addDefaultDocument();
        	idx = 0;
        }
        setCurrentDocument(documents[idx]);
	}
}

function renameDocumentClick() {
    if (currentDoc != null) {
        currentDoc.name = currentDoc.name + "1";
        currentDoc.element.value = currentDoc.name
        SaveDoc(currentDoc);        
    }
}
