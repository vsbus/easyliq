var map = {"kg/m3":1, "g/l":1, "%":0.01}
//////////////////////////////////////////////////////////////////////////

// Here we define a set of string constants used everywhere as ID for
// exact object.

// Parameters:
rho_l = "RHO_L"
rho_s = "RHO_S"
eps = "EPS"
rf = "RF"
s = "S"
rho_f = "RHO_F"
rho_sus = "RHO_SUS"
Cm = "CM"
Cv = "CV"
C = "C"

// Groups:
group_rho_l = "GROUP_RHO_L"
group_s = "GROUP_S"
group_eps = "GROUP_EPS"
group_rf = "GROUP_RF"
group_rho_f = "GROUP_RHO_F"
group_rho_s = "GROUP_RHO_S"
group_rho_sus = "GROUP_RHO_SUS"
group_C = "GROUP_C"

// Calculation Options:
calc_rf = "CALC_RF"
calc_s = "CALC_S"
calc_eps = "CALC_EPS"
calc_rho_f = "CALC_RHO_F"
calc_rho_s = "CALC_RHO_S"
calc_rho_sus = "CALC_RHO_SUS"
calc_CmCvC = "CALC_CMCVC"

function getCalculationOption(combo) {
    var e = combo.control;
    return e.options[e.selectedIndex].value;
}

function Combo(name, options, control, onchange, currentValue) {
    this.name = name;
    this.options = options;
    this.control = control;
    this.onchange = onchange;
    this.currentValue = currentValue;
}

function Module() {
}

function Module(name, combos, parameters, groups, parameters_meta, groups_meta,
        calculatedGroup, calculate, onComboChanged) {
    this.id = null;
    this.changeByUserTime = (new Date()).getTime();
    this.control = null;
    this.position = 0;
    this.name = name;
    this.combos = combos;
    this.parameters = parameters;
    this.groups = groups;
    this.parameters_meta = parameters_meta;
    this.groups_meta = groups_meta;
    this.calculatedGroup = calculatedGroup;
    this.control = null;
    this.calculate = calculate;
    this.onComboChanged = onComboChanged;
    this.updateParameters = null;
    this.Render = function() {
        for (var parameter in this.parameters_meta) {
            var pmeta = this.parameters_meta[parameter];
            var gmeta = this.groups_meta[pmeta.group];
            if ((pmeta.group == this.calculatedGroup)
                    || (parameter != gmeta.representator)) {
                pmeta.element.value = Number((pmeta.value / map[pmeta.unit])
                        .toFixed(digits_after_point));
            }
        }
    };
    this.Copy = function() {
        var obj = new this.constructor();
        obj.id = null;
        obj.calculatedGroup = this.calculatedGroup;
        for (i = 0; i < this.combos.length; i++) {
            obj.combos[i].currentValue = this.combos[i].currentValue;
        }
        
        for (var gmeta in obj.groups_meta) {
            obj.groups_meta[gmeta].representator = this.groups_meta[gmeta].representator;
        }
        
        obj.control = null;

        for (var parameter in obj.parameters_meta) {
            obj.parameters_meta[parameter].value = this.parameters_meta[parameter].value
        }

        return obj;
    }
}