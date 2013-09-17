////////////////////////////////////////////////////////////////////////////

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
    this.id = null;
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
    this.Render = function(m) {
        for (var parameter in m.parameters_meta) {
            var pmeta = m.parameters_meta[parameter];
            var gmeta = m.groups_meta[pmeta.group];
            if ((pmeta.group == m.calculatedGroup)
                    || (parameter != gmeta.representator)) {
                pmeta.element.value = Number((pmeta.value / map[pmeta.unit])
                        .toFixed(5));
            }
        }
    };
    this.Save = function(m) {
        var request = {
            action : "save",
            name : m.constructor.name,
            position : m.position
        }
        if (m.id != null) {
            request["id"] = m.id;
            request["action"] = "update";
        }

        // For parameter fields we can't use initialization list.
        for ( var parameter in m.parameters_meta) {
            var pmeta = m.parameters_meta[parameter];
            request[parameter] = pmeta.value;
        }

        $.get('ActionServlet', request, function(responseText) {
            if (request["action"] == "save") {
                m.id = responseText;
            }
        });
    };
}