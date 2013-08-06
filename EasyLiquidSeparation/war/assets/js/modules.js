function Combo(name, options, control, onchange) {
    this.name = name;
    this.options = options;
    this.control = control;
    this.onchange = onchange;
}
var CakeMoistureContent_Combos = [ new Combo("Calculate", [ "Cake Porosity",
        "Cake Saturation", "Cake Moisture Content" ], null, null) ];

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
}

function CakeMoistureContent() {
    this.name = "Cake Moisture Content from Cake Saturation";
    this.combos = CakeMoistureContent_Combos;
    this.parameters = [ "rho_I", "rho_S", "eps", "S", "Rf" ];
    this.groups = null;
    this.parameters_meta = null;
    this.groups_meta = null;
    this.calculatedGroup = null;
    this.calculate = null;
    this.onComboChanged = null;
};
CakeMoistureContent.prototype = new Module;
CakeMoistureContent.prototype.constructor = CakeMoistureContent;