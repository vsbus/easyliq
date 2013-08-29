function createDeleteButton(m, moduleDiv) {
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "delete from DB");
        btn.onclick = function() {
            m.Delete(m);            
        }
        moduleDiv.appendChild(btn);
    }
    
    function createSaveButton(m, moduleDiv) {
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "save");
        btn.onclick = function() {
            m.Save(m);
        };
        moduleDiv.appendChild(btn);
    }
    function createCopyButton(moduleData, moduleDiv) {
        var idx = currentModules.indexOf(moduleData);
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Duplicate");
        btn.onclick = function() {
            currentModules.splice(idx, 0, moduleData);
            var newModuleBlock = generateModuleBlock(generateModuleData(moduleData.module));
            moduleDiv.parentNode.insertBefore(newModuleBlock, moduleDiv.nextSibling);
        }
        moduleDiv.appendChild(btn);
    }
    function createRemoveFromScreenButton(moduleData, moduleDiv) {        
        var idx = currentModules.indexOf(moduleData);
       
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "remove");
        
        btn.onclick = function() {
            currentModules.splice(idx, 1);
            btn.parentNode.parentNode.removeChild(btn.parentNode);
        }
        moduleDiv.appendChild(btn);
    }
    function clearCalculationOptions() {
        var d = document.getElementById("calc_option_div");     
        while (d.firstChild != null) {
            d.removeChild(d.firstChild);     
        }
    }
    function clearParametersTable() {
        var table = document.getElementById("pt");
        var body = table.getElementsByTagName("tbody")[0];
        if (body != null) {
            table.removeChild(body);
        }
    }
    