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
		moduleDiv.parentNode
				.insertBefore(newModuleBlock, moduleDiv.nextSibling);
		SaveAll();
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
	pvalue.setAttribute("value", pmeta.value / map[pmeta.unit]);
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

function drawParametersTable(div, m) {
	var tableDiv = document.createElement("div");
	tableDiv.appendChild(createHeaderRow());
	for ( var key in m.groups_meta) {
		var group_parameters = m.groups_meta[key].parameters;
		for ( var i in group_parameters) {
			addTableRow(m, group_parameters[i], tableDiv);
		}
		var separator = document.createElement("div");
		separator.setAttribute("style", "height: 12px;");
		tableDiv.appendChild(separator);
	}
	div.appendChild(tableDiv);
}

function createModuleDiv(m) {
	var nameSpan = document.createElement("span");
	nameSpan.innerHTML = m.name;
	nameSpan.setAttribute("class", "module_title span10");

	var buttonsDiv = document.createElement("div");
	buttonsDiv.setAttribute("style", "float: right;");
	buttonsDiv.setAttribute("class", "module_title span2");
	createCopyButton(m, buttonsDiv);
	createRemoveButton(m, buttonsDiv);

	var headerDiv = document.createElement("div");
	headerDiv.setAttribute("class", "row-fluid");
	headerDiv.appendChild(nameSpan);
	headerDiv.appendChild(buttonsDiv);

	var moduleContainer = document.createElement("div");
	moduleContainer.setAttribute("class", "main_div inputbar");
	moduleContainer.appendChild(headerDiv);
	drawCalculationOptions(moduleContainer, m);
	drawParametersTable(moduleContainer, m);

	var moduleDiv = document.createElement("div");
	moduleDiv.setAttribute("class", "span4");
	moduleDiv.appendChild(moduleContainer);
	m.control = moduleDiv;

	return moduleDiv;
}

function drawCalculationOptions(div, m) {
	var comboDiv = document.createElement("div");
	comboDiv.setAttribute("class", "calc_option_div row-fluid");
	div.appendChild(comboDiv);

	var s = document.createElement("span");
	s.setAttribute("class", "cbname span3");
	s.innerHTML = m.combos[0].name;
	comboDiv.appendChild(s);
	var comboBox = document.createElement("select");
	comboBox.setAttribute("role", "listbox");
	comboBox.setAttribute("class", "span9");
	comboBox.onchange = function() {
		m.onComboChanged(m);
		var moduleDiv = m.control;
		var moduleContainer = moduleDiv.children[0];
		var t = moduleContainer.children[moduleContainer.children.length - 1];
		moduleContainer.removeChild(t);
		drawParametersTable(moduleContainer, m);
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
