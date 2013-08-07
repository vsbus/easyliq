function getCalculationOption(combo) {
    var e = combo.control;
    return e.options[e.selectedIndex].value;
}

function Combo(name, options, control, onchange) {
    this.name = name;
    this.options = options;
    this.control = control;
    this.onchange = onchange;
}

function Module() {
}
function Module(name, combos, parameters, groups, parameters_meta, groups_meta,
        calculatedGroup, calculate, onComboChanged) { 
    // I want to move some common logic here. Currently we have only one Module,
    // so this logic will be added later
    this.name = name;
    this.combos = combos;
    this.parameters = parameters;
    this.groups = groups;
    this.parameters_meta = parameters_meta;
    this.groups_meta = groups_meta;
    this.calculatedGroup = calculatedGroup;
    this.calculate = calculate;
    this.onComboChanged = onComboChanged;
    this.Render = function(m) {
    	for (var parameter in m.parameters_meta) {
    		var pmeta = m.parameters_meta[parameter];
            var gmeta = m.groups_meta[pmeta.group];
            if ((pmeta.group == m.calculatedGroup) || (parameter != gmeta.representator)) {
                  pmeta.element.value = Number((pmeta.value / map[pmeta.unit]).toFixed(5));
            }
         }
     };
}