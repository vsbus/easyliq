////////////////////////////////////////////////////////////////////////////

// Here we define a set of string constants used everywhere as ID for
// exact object.

// Parameters:


    function createParametersMetaForDensityConcentration() {
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

function createGroupsMetaForDensityConcentration() {
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
function createCalcOptionsForDensityConcentration() {
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
    return calc_options;
}

function combo0_onchange(m) {
    var calculationOption = getCalculationOption(m.combos[0]);

    var mp = {};
    mp[calc_rho_f] = group_rho_f;
    mp[calc_rho_s] = group_rho_s;
    mp[calc_rho_sus] = group_rho_sus;
    mp[calc_CmCvC] = group_C;
    m.calculatedGroup = mp[calculationOption];

   // calculatedGroup = m.combos[0].options[calculationOption].group;
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
function calculateDensityConcentration() {
    var request = {
        action : "calculate",
        calculator : "DensityConcentration"
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
    var m = this;
    $.get('ActionServlet', request, function(responseText) {
        m.updateParameters(responseText);
        m.Render();
    });
}

function UpdateDensityConcentrationParameters(text) {
    this.parameters_meta[Cm].value = text[Cm];
    this.parameters_meta[rho_s].value = text[rho_s];
    this.parameters_meta[rho_f].value = text[rho_f];
    this.parameters_meta[rho_sus].value = text[rho_sus];
    this.parameters_meta[Cv].value = text[Cv];
    this.parameters_meta[C].value = text[C];
}

function DensityConcentration() {
    var combo0 = new Combo("Calculate",
            createCalcOptionsForDensityConcentration(), null, null);
    var DensityConcentration_combos = [ combo0 ];

    this.name = "Density Concentration";
    this.combos = DensityConcentration_combos;
    this.parameters_meta = createParametersMetaForDensityConcentration();
    this.groups_meta = createGroupsMetaForDensityConcentration();
    this.calculatedGroup = group_rho_sus;
    this.calculate = calculateDensityConcentration;
    this.onComboChanged = combo0_onchange;
    this.updateParameters = UpdateDensityConcentrationParameters;    
}

DensityConcentration.prototype = new Module;
DensityConcentration.prototype.constructor = DensityConcentration;