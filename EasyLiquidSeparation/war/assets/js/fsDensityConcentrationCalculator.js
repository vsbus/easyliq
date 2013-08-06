////////////////////////////////////////////////////////////////////////////

// Here we define a set of string constants used everywhere as ID for
// exact object.

// Parameters:
rho_f = "RHO_F"
rho_s = "RHO_S"
rho_sus = "RHO_SUS"
Cm = "CM"
Cv = "CV"
C = "C"

// Groups:
group_rho_f = "GROUP_RHO_F"
group_rho_s = "GROUP_RHO_S"
group_rho_sus = "GROUP_RHO_SUS"
group_C = "GROUP_C"

// Calculation Options:
calc_rho_f = "CALC_RHO_F"
calc_rho_s = "CALC_RHO_S"
calc_rho_sus = "CALC_RHO_SUS"
calc_CmCvC = "CALC_CMCVC"

function combo0_onchange(m) {

    var calculationOption = getCalculationOption(m.combos[0]);

    var mp = {};
    mp[calc_rho_f] = group_rho_f;
    mp[calc_rho_s] = group_rho_s;
    mp[calc_rho_sus] = group_rho_sus;
    mp[calc_CmCvC] = group_C;
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

function getCalculationOption(combo) {
    var e = combo.control;
    return e.options[e.selectedIndex].value;
}

function calculateDensityConcentration(m) {
    var request = {
        action : "calculate"
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

        m.parameters_meta[Cm].value = responseText[Cm];
        m.parameters_meta[rho_s].value = responseText[rho_s];
        m.parameters_meta[rho_f].value = responseText[rho_f];
        m.parameters_meta[rho_sus].value = responseText[rho_sus];
        m.parameters_meta[Cv].value = responseText[Cv];
        m.parameters_meta[C].value = responseText[C];

        m.Render(m);
    });
}

DensityConcentrationCalculator.prototype.constructor = DensityConcentrationCalculator;
// DensityConcentrationCalculator();

function createParametersMetaForDensityConcentrationCalculator() {
    // We can't use initialization list here because we want to use variables as
    // keys.

    var parameters_meta = {}
    parameters_meta[rho_f] = {
        name : "Filtrate Density",
        unit : "kg/m3",
        value : "1418",
        element : null,
        group : group_rho_f
    }
    parameters_meta[rho_s] = {
        name : "Solids Density",
        unit : "kg/m3",
        value : "1000",
        element : null,
        group : group_rho_s
    }
    parameters_meta[rho_sus] = {
        name : "Suspension Density",
        unit : "kg/m3",
        value : "1350",
        element : null,
        group : group_rho_sus
    }
    parameters_meta[Cm] = {
        name : "Mass Fraction",
        unit : "%",
        value : "0.12",
        element : null,
        group : group_C
    }
    parameters_meta[Cv] = {
        name : "Volume Fraction",
        unit : "%",
        value : "0.162",
        element : null,
        group : group_C
    }
    parameters_meta[C] = {
        name : "Concentration",
        unit : "g/l",
        value : "162",
        element : null,
        group : group_C
    }
    return parameters_meta;
}

function createGroupsMetaForDensityConcentrationCalculator() {
    // We can't use initialization list here because we want to use variables as
    // keys.
    var groups_meta = {}
    groups_meta[group_rho_f] = {
        parameters : [ rho_f ],
        representator : rho_f
    }
    groups_meta[group_rho_s] = {
        parameters : [ rho_s ],
        representator : rho_s
    }
    groups_meta[group_rho_sus] = {
        parameters : [ rho_sus ],
        representator : rho_sus
    }
    groups_meta[group_C] = {
        parameters : [ Cm, Cv, C ],
        representator : Cm
    }
    return groups_meta;
}

function DensityConcentrationCalculator() {

    // We can't use initialization list here because we want to use variables as
    // keys.
    var calc_options = {}
    calc_options[calc_rho_f] = {
        name : "Filtrate Density (rho_f)",
        group : group_rho_f
    }
    calc_options[calc_rho_s] = {
        name : "Solids Density (rho_s)",
        group : group_rho_s
    }
    calc_options[calc_rho_sus] = {
        name : "Suspension Density (rho_sus)",
        group : group_rho_sus
    }
    calc_options[calc_CmCvC] = {
        name : "Solids Mass Fraction (Cm, Cv, C)",
        group : group_C
    }
    this.Render = function(m) {
        for ( var parameter in m.parameters_meta) {
            var pmeta = m.parameters_meta[parameter];
            var gmeta = m.groups_meta[pmeta.group];
            if (pmeta.group == m.calculatedGroup
                    || parameter != gmeta.representator) {
                pmeta.element.value = Number((pmeta.value / map[pmeta.unit])
                        .toFixed(5));
            }
        }
    };
    var combo0 = new Combo("Calculate", calc_options, null, null);

    combo0.onchange = combo0_onchange;
    var DensityConcentrationCalculator_combos = [ combo0 ];

    this.name = "fsDensityConcentrationCalculator";
    this.combos = DensityConcentrationCalculator_combos;
    this.parameters_meta = createParametersMetaForDensityConcentrationCalculator();
    this.groups_meta = createGroupsMetaForDensityConcentrationCalculator();
    this.calculatedGroup = group_rho_sus;
    this.calculate = calculateDensityConcentration;
    this.onComboChanged = combo0_onchange;
}
DensityConcentrationCalculator.prototype = new Module;
