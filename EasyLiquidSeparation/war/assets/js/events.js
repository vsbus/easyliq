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
    removeCurrentDocument()
    saveSettings();
}

function removeFolderClick() {
    removeFolder(currentFolder.id);
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
    saveSettings();
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
