////////////////////////////////////////////////////////////////////////////

// Here we define a set of string constants used everywhere as ID for
// exact object.

// Parameters:
rho_l = "RHO_L"
rho_s = "RHO_S"
eps = "EPS"
rf = "RF"
s = "S"

// Groups:
group_rho_l = "GROUP_RHO_L"
group_s = "GROUP_S"
group_eps = "GROUP_EPS"
group_rf = "GROUP_RF"

// Calculation Options:
calc_rf = "CALC_RF"
calc_s = "CALC_S"
calc_eps = "CALC_EPS"

function createParametersMetaForRfFromCakeSaturation() {
    // We can't use initialization list here because we want to use variables as
    // keys.
    var parameters_meta = {}
    parameters_meta[rho_l] = {
        name : "Liquid Density",
        unit : "kg/m3",
        value : "1000",
        element : null,
        group : group_rho_l
    }
    parameters_meta[rho_s] = {
        name : "Solids Density",
        unit : "kg/m3",
        value : "2300",
        element : null,
        group : group_rho_s
    }
    parameters_meta[eps] = {
        name : "Cake Porosity",
        unit : "%",
        value : "0.55",
        element : null,
        group : group_eps
    }
    parameters_meta[s] = {
        name : "Cake Saturation",
        unit : "%",
        value : "1",
        element : null,
        group : group_s
    }
    parameters_meta[rf] = {
        name : "Cake Moisture Content",
        unit : "%",
        value : "0.347",
        element : null,
        group : group_rf
    }
    return parameters_meta;
}
function createGroupsMetaForRfFromCakeSaturation() {
    // We can't use initialization list here because we want to use variables as
    // keys.
    var groups_meta = {}
    groups_meta[group_rho_l] = {
        parameters : [ rho_l ],
        representator : rho_l
    }
    groups_meta[group_rho_s] = {
        parameters : [ rho_s ],
        representator : rho_s
    }
    groups_meta[group_s] = {
        parameters : [ s ],
        representator : s
    }
    groups_meta[group_rf] = {
        parameters : [ rf ],
        representator : rf
    }
    groups_meta[group_eps] = {
        parameters : [ eps ],
        representator : eps
    }
    return groups_meta;
}
function createCalcOptionsForRfFromCakeSaturation() {
    // We can't use initialization list here because we want to use variables as
    // keys.
    var calc_options = {}
    calc_options[calc_eps] = {
        name : "Cake Porosity (eps)",
        group : group_eps
    }
    calc_options[calc_s] = {
        name : "Cake Saturation (S)",
        group : group_s
    }
    calc_options[calc_rf] = {
        name : "Cake Moisture Content (Rf)",
        group : group_rf
    }
    return calc_options;
}
function calculateRfFromCakeSaturation(m) {
    var request = {
        action : "calculate",
        calculator : "RfFromCakeSaturation"
    }
    // For parameter fields we can't use initialization list.
    for ( var parameter in this.parameters_meta) {
        var known = false;
        var pmeta = this.parameters_meta[parameter];
        if (pmeta.group != this.calculatedGroup) {
            var gmeta = this.groups_meta[pmeta.group];
            if (parameter == gmeta.representator) {
                known = true;
            }
        }
        if (known) {
            request[parameter] = pmeta.value;
        }
    }
    var parm = this;
    $.get('ActionServlet', request, function(responseText) {
        m.parameters_meta[s].value = responseText[s];
        m.parameters_meta[rho_l].value = responseText[rho_l];
        m.parameters_meta[rho_s].value = responseText[rho_s];
        m.parameters_meta[eps].value = responseText[eps];
        m.parameters_meta[rf].value = responseText[rf];

        m.Render(m);
    });
}
function combo0_RfFromCakeSaturation_onchange(m) {
    var calculationOption = getCalculationOption(m.combos[0]);

    var mp = {};
    mp[calc_rf] = group_rf;
    mp[calc_s] = group_s;
    mp[calc_eps] = group_eps;
    m.calculatedGroup = mp[calculationOption];

    for ( var parameter in m.parameters_meta) {
        var meta = m.parameters_meta[parameter];
        var e = m.parameters_meta[parameter].element;
        if (meta.group != m.calculatedGroup) {
            e.removeAttribute("readOnly");
            e.removeAttribute("class");
            e.parentNode.parentNode.setAttribute("class", "editable");
        } else {
            e.setAttribute("readOnly", "true");
            e.setAttribute("class", "disabled");
            e.parentNode.parentNode.setAttribute("class", "noneditable");
        }
    }
}

function RfFromCakeSaturation() {
    var combo0 = new Combo("Calculate",
            createCalcOptionsForRfFromCakeSaturation(), null, null);

    this.name = "Cake Moisture Content from Cake Saturation";
    this.combos = [ combo0 ];
    this.parameters_meta = createParametersMetaForRfFromCakeSaturation();
    this.groups_meta = createGroupsMetaForRfFromCakeSaturation();
    this.calculatedGroup = group_eps;
    this.calculate = calculateRfFromCakeSaturation;
    this.onComboChanged = combo0_RfFromCakeSaturation_onchange;
};
RfFromCakeSaturation.prototype = new Module;
RfFromCakeSaturation.prototype.constructor = RfFromCakeSaturation;