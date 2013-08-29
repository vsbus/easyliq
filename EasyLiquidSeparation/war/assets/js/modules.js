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
    this.name = name;
    this.combos = combos;
    this.parameters = parameters;
    this.groups = groups;
    this.parameters_meta = parameters_meta;
    this.groups_meta = groups_meta;
    this.calculatedGroup = calculatedGroup;
    this.calculate = calculate;
    this.onComboChanged = onComboChanged;
    this.updateParameters = null;
    this.Render = function(m) {
        for ( var parameter in m.parameters_meta) {
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
            name : m.constructor.name
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
            alert("ok "+ responseText);
            if (request["action"] == "save") {
                m.id = responseText;
            }
        });
    };
    
    this.Delete = function(m) {
        var request = {
            action : "delete",
            id : m.id
        };
        $.get('ActionServlet', request, function(responseText) {
            alert("ok "+ responseText);          
        });
    };
}