function drawModule(m) {
    var mainDiv = document.getElementsByClassName("row")[0];
    mainDiv.appendChild(createModuleDiv(m));
}

function createCopyButton(module, buttonsDiv) {
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "C");
    btn.onclick = function() {
        var idx = currentModules.indexOf(module);
        var newModule = module.Copy();
        newModule.id = null;
        currentModules.splice(idx + 1, 0, newModule);
        var newModuleBlock = createModuleDiv(newModule);
        var moduleDiv = module.control; 
        moduleDiv.parentNode.insertBefore(newModuleBlock, moduleDiv.nextSibling);
    }
    buttonsDiv.appendChild(btn);
}

function createRemoveButton(module, buttonsDiv) {
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "X");

    btn.onclick = function() {
        var idx = currentModules.indexOf(module);
        currentModules.splice(idx, 1);
        var moduleDiv = module.control; 
        moduleDiv.parentNode.removeChild(moduleDiv);
        SaveAll();
    }
    buttonsDiv.appendChild(btn);
}

function drawParametersTable(div, m) {
    var table = prepareTableForParameters(div);
    var body = document.createElement("tbody");
    table.appendChild(body);

    for ( var key in m.groups_meta) {
        var group_parameters = m.groups_meta[key].parameters;
        for ( var i in group_parameters) {
            var parameter = group_parameters[i];
            m.parameters_meta[parameter].element = createRow(m, parameter, body);
        }

        em_row = document.createElement("tr");
        em_row.appendChild(document.createElement("td"));
        em_row.appendChild(document.createElement("td"));
        em_row.appendChild(document.createElement("td"));

        em_row.setAttribute("class", "rowseparator");
        body.appendChild(em_row);
    }
}

function createModuleDiv(m) {
    var moduleDiv = document.createElement("div");
    moduleDiv.setAttribute("class", "main_div inputbar span3 ");
    m.control = moduleDiv;
    var nameSpan = document.createElement("span");
    nameSpan.innerHTML = m.name;
    moduleDiv.appendChild(nameSpan);
    nameSpan.setAttribute("class", "module_title");
    
    var buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("style", "float: right;");
    moduleDiv.appendChild(buttonsDiv);
    
    createCopyButton(m, buttonsDiv);
    createRemoveButton(m, buttonsDiv);
    
    drawCalculationOptions(moduleDiv, m);
    drawParametersTable(moduleDiv, m);
    return moduleDiv;
}

function drawCalculationOptions(div, m) {
    var comboDiv = document.createElement("div");
    comboDiv.setAttribute("class", "calc_option_div");
    div.appendChild(comboDiv);

    var s = document.createElement("span");
    s.setAttribute("class", "cbname");
    s.innerHTML = m.combos[0].name;
    comboDiv.appendChild(s);
    var comboBox = document.createElement("select");
    comboBox.setAttribute("role", "listbox");
    comboBox.onchange = function() {
        m.onComboChanged(m);
    };

    m.combos[0].control = comboBox;
    comboDiv.appendChild(comboBox);
    var selected_index = null;
    for ( var i in m.combos[0].options) {
        var e = document.createElement("option");
        e.setAttribute("value", i);
        e.setAttribute("role", "option");
        e.text = m.combos[0].options[i].name;
        comboBox.appendChild(e);
        if (m.combos[0].options[i].group == m.calculatedGroup) {
            selected_index = comboBox.options.length - 1;
        }
    }
    comboBox.selectedIndex = selected_index;
}

function prepareTableForParameters(div) {
    var table = document.createElement("table");
    table.setAttribute("class", "pt");
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);

    createHeader(tr, "Parameters");
    createHeader(tr, "Units");
    createHeader(tr, "Value");

    div.appendChild(table);

    return table;
}

function createHeader(row, value) {
    var th = document.createElement("th");
    th.setAttribute("class", "col-lg-4 info");
    th.innerHTML = value;
    row.appendChild(th);
}

function createRow(m, parameter, tbody) {
    var pmeta = m.parameters_meta[parameter];
    var result = null;
    var row = document.createElement("tr");
    var el = document.createElement("td");
    el.appendChild(document.createTextNode(pmeta.name));
    row.appendChild(el);
    var el = document.createElement("td");
    el.appendChild(document.createTextNode(pmeta.unit));
    row.appendChild(el);
    var el = document.createElement("td");

    var editbox = document.createElement("input");
    editbox.setAttribute("type", "text");
    editbox.setAttribute("value", pmeta.value / map[pmeta.unit]);

    editbox.onkeyup = function() {
        parameterValueChanged(m, parameter);
    }

    if (pmeta.group == m.calculatedGroup) {
        editbox.setAttribute("readOnly", "true");
        editbox.setAttribute("class", "disabled");
        row.setAttribute("class", "noneditable");
    } else {
        row.setAttribute("class", "editable");
    }

    el.appendChild(editbox);
    result = editbox;

    row.appendChild(el);
    tbody.appendChild(row);
    return result;
}
