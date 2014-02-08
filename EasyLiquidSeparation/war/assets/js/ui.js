var PADDING = 20;
var CURSOR_WIDTH = 4;

function renderModules() {
    // Remove all rows.
    document.getElementById("modules_div").innerHTML = "";
    // Create new rows with modules.
    if (currentDoc != null) {
        for (var i in currentDoc.modules) {
            var modulesRow = document.createElement("div");
            modulesRow.setAttribute("name", "modules_row");
            modulesRow.setAttribute("class", "row");
            document.getElementById("modules_div").appendChild(modulesRow);
            for (var j in currentDoc.modules[i]) {
                var module = currentDoc.modules[i][j];
                modulesRow.appendChild(createModuleDiv(module));
                module.combos[0].control.onchange();
            }
        }
        // Resize modules container because I couldn't figure out how to get
        // this automatically with CSS.
        var rows = document.getElementsByName("modules_row");
        updateModulesRowWidth();

        // Add cursor to the end of the last row.
        if (rows.length >= 1) {
            var cursor = document.createElement("span");
            cursor.setAttribute("class", "span1");
            cursor.setAttribute("style", "height: 440px; background: grey;");
            cursor.style.width = CURSOR_WIDTH;
            rows[rows.length - 1].appendChild(cursor);
        }

        $('[name="modules_row"]').sortable({
            start : function(e, ui) {
                ui.placeholder.css({
                    width : CURSOR_WIDTH,
                    height : ui.item.css("height"),
                    background : "lightgray"
                });
            },
            connectWith : '[name="modules_row"]',
            placeholder : "span1",
            stop : function(event, ui) {
                updateModulesPosition();
            }
        });
    }
}

function updateModulesRowWidth() {
    var rows = document.getElementsByName("modules_row");
    for (var i = 0; i < rows.length; i++) {
        var modulesRow = rows[i];
        var width = PADDING + CURSOR_WIDTH + PADDING + CURSOR_WIDTH + PADDING;
        for (var j = 0; j < modulesRow.childNodes.length; j++) {
            width += $(modulesRow.childNodes[j]).width() + PADDING;  
        }
        modulesRow.style.width = width;
    }    
}

function findModulePositionByControl(moduleDiv) {
    var rowIdx;
    var colIdx;
    for (var i = 0; i < currentDoc.modules.length; i++) {
        for (var j = 0; j < currentDoc.modules[i].length; j++) {
            if (currentDoc.modules[i][j].control == moduleDiv) {
                rowIdx = i;
                colIdx = j;
            }
        }
    }
    return {row: rowIdx, col: colIdx};
}

function updateModulesPosition() {
    var rows = document.getElementsByName("modules_row");
    for (var i = 0; i < rows.length; i++) {
        var modulesDivInRow = rows[i].children;
        for (var j = 0; j < modulesDivInRow.length; j++){
            var pos = findModulePositionByControl(modulesDivInRow[j]);
            if (pos.row == null) continue;
            var element = currentDoc.modules[pos.row][pos.col];
            currentDoc.modules[pos.row].splice(pos.col, 1);
            currentDoc.modules[i].splice(j, 0, element);         
        }
    }
    renderModules();
}

function createCommentsButton(module, buttonsDiv) {
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "?");
    btn.onclick = function() {
    	module.showComments ^= true;
    	renderModules();
    }
    buttonsDiv.appendChild(btn);
}

function createCopyButton(module, buttonsDiv) {
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "C");
    btn.onclick = function() {
    	var pos = findModulePosition(module);
        var newModule = module.Copy();
        newModule.id = null;
        var row = currentDoc.modules[pos.row];
        var idx = pos.col + 1;
        row.splice(idx, 0, newModule);
        renderModules();
        saveDoc(currentDoc);
    }
    buttonsDiv.appendChild(btn);
}

function createRemoveButton(module, buttonsDiv) {
    var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "X");
    btn.onclick = function() {
    	var pos = findModulePosition(module);
        currentDoc.modules[pos.row].splice(pos.col, 1);
        renderModules();
        saveDoc(currentDoc);
    }
    buttonsDiv.appendChild(btn);
}

function createTextDiv(text, span) {
    var div = document.createElement("div");
    div.setAttribute("class", span);
    div.setAttribute("style", "padding-top: 6px;");
    div.innerHTML = text;
    return div
}

function createHeaderRow() {
    var parameterHeader = createTextDiv("Parameter", "span6");
    var unitsHeader = createTextDiv("Units", "span2");
    var valueHeader = createTextDiv("Value", "span4");
    var headerRow = document.createElement("div");
    headerRow.setAttribute("class", "row-fluid");
    headerRow.setAttribute("style", "font-weight: bold; font-size: 12px;");
    headerRow.appendChild(parameterHeader);
    headerRow.appendChild(unitsHeader);
    headerRow.appendChild(valueHeader);
    return headerRow;
}

function addTableRow(module, parameter, tableDiv) {
    var pmeta = module.parameters_meta[parameter];

    var pvalue = document.createElement("input");
    pvalue.setAttribute("type", "text");
    pvalue.setAttribute("value", Number((pmeta.value / map[pmeta.unit])
            .toFixed(digits_after_point)));
    pvalue.setAttribute("style", "font-size: 12px; color: black;");
    pvalue.onkeyup = function() {
        parameterValueChanged(module, parameter);
    }
    if (pmeta.group == module.calculatedGroup) {
        pvalue.setAttribute("readOnly", "true");
        pvalue.setAttribute("class", "disabled span4");
    } else {
        pvalue.setAttribute("class", "span4");
        var gmeta = module.groups_meta[pmeta.group]
        if (parameter == gmeta.representator) {
            pvalue.style.color = "blue";
        }
    }

    var row = document.createElement("div");
    if (pmeta.group == module.calculatedGroup) {
        row.setAttribute("class", "noneditable row-fluid");
    } else {
        row.setAttribute("class", "editable row-fluid");
    }
    row.setAttribute("style", "font-size: 12px; height: 32px;");
    row.appendChild(createTextDiv(pmeta.name, "span6"));
    row.appendChild(createTextDiv(pmeta.unit, "span2"));
    row.appendChild(pvalue);
    tableDiv.appendChild(row);

    pmeta.element = pvalue;
}

function setGroupRepresentator(module, parameter) {
    var pmeta = module.parameters_meta[parameter];
    var gmeta = module.groups_meta[pmeta.group];
    gmeta.representator = parameter;
    for (i in gmeta.parameters) {
        var p = gmeta.parameters[i];
        var e = module.parameters_meta[p].element;
        if (e != null) {
            e.style.color = p == parameter ? "blue" : "black";
        }
    }
}

function createParametersTableDiv(m) {
    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("class", "parameters_table");
    tableDiv.appendChild(createHeaderRow());
    for (var key in m.groups_meta) {
        var group_parameters = m.groups_meta[key].parameters;
        for (var i in group_parameters) {
            addTableRow(m, group_parameters[i], tableDiv);
        }
        var separator = document.createElement("div");
        separator.setAttribute("style", "height: 12px;");
        tableDiv.appendChild(separator);
    }
    return tableDiv;
}

function createModuleDiv(m) {
    var nameSpan = document.createElement("span");
    nameSpan.innerHTML = m.name;
    nameSpan.setAttribute("class", "module_title span9");

    var buttonsDiv = document.createElement("span");
    buttonsDiv.setAttribute("class", "module_title span3");
    createCommentsButton(m, buttonsDiv);
    createCopyButton(m, buttonsDiv);
    createRemoveButton(m, buttonsDiv);

    var nameAndButtons = document.createElement("span");
    if (m.showComments) {
        nameAndButtons.setAttribute("class", "row-fluid span6");
    } else {
        nameAndButtons.setAttribute("class", "row-fluid span12");
    }
    nameAndButtons.appendChild(nameSpan);
    nameAndButtons.appendChild(buttonsDiv);

    var headerDiv = document.createElement("div");
    headerDiv.setAttribute("class", "row-fluid");
    headerDiv.appendChild(nameAndButtons);

    var calculationsDiv = document.createElement("span");
    calculationsDiv.setAttribute("class", "span12");
    calculationsDiv.appendChild(createCalculationOptionsDiv(m));
    calculationsDiv.appendChild(createParametersTableDiv(m));

	var contentDiv = document.createElement("div");
	contentDiv.setAttribute("class", "row-fluid");
	contentDiv.appendChild(calculationsDiv);
	if (m.showComments) {
        calculationsDiv.setAttribute("class", "span6");
	    
	    var textArea = document.createElement("textarea")
	    textArea.setAttribute("style", "width: 100%; max-width: 100%; height: 220px");
	    textArea.innerHTML = "Comments";
	    
	    var commentsDiv = document.createElement("span");
	    commentsDiv.setAttribute("class", "span6");
	    commentsDiv.appendChild(textArea);

		contentDiv.appendChild(commentsDiv);
	}

    var moduleContainer = document.createElement("div");
    moduleContainer.setAttribute("class", "main_div inputbar");
    moduleContainer.appendChild(headerDiv);
    moduleContainer.appendChild(contentDiv);

    var moduleDiv = document.createElement("span");
    if (m.showComments) {
    	moduleDiv.setAttribute("class", "span8");
    } else {
    	moduleDiv.setAttribute("class", "span4");
	}
    moduleDiv.appendChild(moduleContainer);
    m.control = moduleDiv;
    
    return moduleDiv;
}

function createCalculationOptionsDiv(m) {
    var comboDiv = document.createElement("div");
    comboDiv.setAttribute("class", "calc_option_div row-fluid");

    var s = document.createElement("span");
    s.setAttribute("class", "cbname span3");
    s.innerHTML = m.combos[0].name;
    comboDiv.appendChild(s);
    var comboBox = document.createElement("select");
    comboBox.setAttribute("role", "listbox");
    comboBox.setAttribute("class", "span9");
    comboBox.onchange = function() {
        m.onComboChanged(m);
        var action_time = (new Date()).getTime();
        UpdateChangeByUserTime(m, action_time);

        var paramsTable = m.control.getElementsByClassName("parameters_table")[0]
        paramsTable.parentElement.replaceChild(createParametersTableDiv(m), paramsTable);
    };

    m.combos[0].control = comboBox;
    comboDiv.appendChild(comboBox);
    var selected_index = null;
    for (var key in m.combos[0].options) {
        var e = document.createElement("option");
        e.setAttribute("value", key);
        e.setAttribute("role", "option");
        e.text = m.combos[0].options[key].name;
        comboBox.appendChild(e);
        if (key == m.combos[0].currentValue) {
            selected_index = comboBox.options.length - 1;
        }
    }
    comboBox.selectedIndex = selected_index;
    
    return comboDiv;
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