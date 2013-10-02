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
        $("#overlay").show();
        var e = document.getElementById("doc_name");
        e.value = currentDoc.name;
        e.focus();
        document.getElementById("save_doc").onclick = function(){
            currentDoc.name = e.value;
            var a = currentDoc.element.getElementsByTagName("a")[0];
            var i = document.createElement("i");
            i.setAttribute("class", "icon-chevron-right");
            a.innerHTML = currentDoc.name;
            a.appendChild(i);
            SaveDoc(currentDoc);
            $("#overlay").hide();
        }
    }
}
