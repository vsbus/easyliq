<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>
<script src="http://code.jquery.com/jquery-latest.js"></script>

<script  type="text/javascript">

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

    ////////////////////////////////////////////////////////////////////////////

    function getCalculationOption() {
        var e = document.getElementById('calc_param');
        return e.options[e.selectedIndex].value;
    }
    
    function calcOptionChanged() {        
        var calculationOption = getCalculationOption();

        var mp = {};
        mp[calc_rho_f] = group_rho_f;
        mp[calc_rho_s] = group_rho_s;
        mp[calc_rho_sus] = group_rho_sus;
        mp[calc_CmCvC] = group_C;
        calculatedGroup = mp[calculationOption];
       
        for (var parameter in parameters_meta) {
            var meta = parameters_meta[parameter];
            var e = parameters_meta[parameter].element;
            if (meta.group != calculatedGroup) {
                e.removeAttribute("readOnly");
                e.removeAttribute("class");
                e.parentNode.parentNode.setAttribute("class", "editable");
            }
            else {
                e.setAttribute("readOnly", "true");
                e.setAttribute("class", "disabled");
                e.parentNode.parentNode.setAttribute("class", "noneditable");
            }
        }
    }

    var delay = 0;

    function parameterValueChanged(parameter) {
        var meta = parameters_meta[parameter];
        groups_meta[meta.group].representator = parameter;
        meta.value = meta.element.value * map[meta.unit];
        last_user_action_time = (new Date()).getTime();
    }
	
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();

    function Calculate()
    {    
        var request = { action: "calculate" }
        // For parameter fields we can't use initialization list.
        for (var parameter in parameters_meta) {
            var known = false;
            var pmeta = parameters_meta[parameter];
            if (pmeta.group != calculatedGroup) {
                var gmeta = groups_meta[pmeta.group];
                if (parameter == gmeta.representator) {
                    known = true;
                }
            }
            if (known) {
                request[parameter] = pmeta.value;
            }
        }

        $.get('ActionServlet', request, function(responseText) {
            parameters_meta[Cm].value = responseText[Cm]
	        parameters_meta[rho_s].value = responseText[rho_s]
	        parameters_meta[rho_f].value = responseText[rho_f]
	        parameters_meta[rho_sus].value = responseText[rho_sus]
	        parameters_meta[Cv].value = responseText[Cv]
	        parameters_meta[C].value = responseText[C]
	        Render()
        });
    }

    function Render() {        
        for (var parameter in parameters_meta) {
            var pmeta = parameters_meta[parameter];
            var gmeta = groups_meta[pmeta.group];
            if (pmeta.group == calculatedGroup || parameter != gmeta.representator) {
                pmeta.element.value = Number((pmeta.value / map[pmeta.unit]).toFixed(5));
            }
        }
    }    

	function Process() {
		if (last_user_action_time <= last_processing_time) {
			return
        }
		now = new Date()
		timediff = now.getTime() - last_user_action_time
		if (timediff < delay) {
			return
        }
		Calculate()
		last_processing_time = now.getTime()
	}

	window.setInterval(Process, delay)

</script>
</head>


<body  style="background-color:#2F3945">
    <form>
       
<div class = "main_div">
<div class="inputbar">
    <div >
        <div class="label">Calculate:</div>

        <select id="calc_param" role="listbox" class="ui-pg-selbox" onChange="calcOptionChanged();">
        </select>
    </div>
    <div >
        <div>
    <table id="pt">        
        <thead>
            <tr>
              <th class = "info">Parameter</th>
              <th class = "info">Units</th>
              <th class = "info">Value</th>
            </tr>
        </thead>  
    </table>
    </div>
    </div>
</div>

</div>

</form>
 <script  type="text/javascript">

        var map = {"kg/m3":1, "g/l":1, "%":0.01}
        
        // We can't use initialization list here because we want to use variables as keys.
        var groups_meta = {}
        groups_meta[group_rho_f] =   { parameters:[rho_f],     representator: rho_f }
        groups_meta[group_rho_s] =   { parameters:[rho_s],     representator: rho_s }
        groups_meta[group_rho_sus] = { parameters:[rho_sus],   representator: rho_sus }
        groups_meta[group_C] =       { parameters:[Cm, Cv, C], representator: Cm }
        calculatedGroup = group_rho_sus;

        // We can't use initialization list here because we want to use variables as keys.
        var parameters_meta = {}
        parameters_meta[rho_f] =   { name:"Filtrate Density",   unit:"kg/m3", value:"1418",  element:null, group:group_rho_f }
        parameters_meta[rho_s] =   { name:"Solids Density",     unit:"kg/m3", value:"1000",  element:null, group:group_rho_s }
        parameters_meta[rho_sus] = { name:"Suspension Density", unit:"kg/m3", value:"1350",  element:null, group:group_rho_sus }
        parameters_meta[Cm] =      { name:"Mass Fraction",      unit:"%",     value:"0.12",  element:null, group:group_C }
        parameters_meta[Cv] =      { name:"Volume Fraction",    unit:"%",     value:"0.162", element:null, group:group_C }
        parameters_meta[C] =       { name:"Concentration",      unit:"g/l",   value:"162",   element:null, group:group_C }

        // We can't use initialization list here because we want to use variables as keys.
        var calc_options = {}
        calc_options[calc_rho_f] =   { name:"Filtrate Density (rho_f)",         group:group_rho_f }
        calc_options[calc_rho_s] =   { name:"Solids Density (rho_s)",           group:group_rho_s }
        calc_options[calc_rho_sus] = { name:"Suspension Density (rho_sus)",     group:group_rho_sus }
        calc_options[calc_CmCvC] =   { name:"Solids Mass Fraction (Cm, Cv, C)", group:group_C }
        
        var table = document.getElementById("pt");
        var body = document.createElement("tbody");
        table.appendChild(body);

        var comboBox = document.getElementById("calc_param");
        for (var key in calc_options) {
            var e = document.createElement("option");
            e.setAttribute("value", key);
            e.setAttribute("role", "option");
            e.text = calc_options[key].name;
            comboBox.appendChild(e);
        }
        comboBox.selectedIndex = 2

        for (var key in calc_options) {
            var group_parameters = groups_meta[calc_options[key].group].parameters;
            for (var i in group_parameters) {
                var parameter = group_parameters[i];
                parameters_meta[parameter].element = createRow(parameter, body);
            }
            var em_row = document.createElement("tr");
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));                 

            em_row.setAttribute("class","rowseparator");
            body.appendChild(em_row);
        }
           
        function createRow(parameter, tbody) {
            var pmeta = parameters_meta[parameter];
            var result = null;
            var row = document.createElement("tr");
            var el = document.createElement("td");
            el.appendChild(document.createTextNode(pmeta.name));
            row.appendChild(el);
            var el = document.createElement("td");
            el.appendChild(document.createTextNode(pmeta.unit));
            row.appendChild(el);
            var el = document.createElement("td");
           
            var editbox = document.createElement("input");
            editbox.setAttribute("type",  "text" );
            editbox.setAttribute("value",  pmeta.value / map[pmeta.unit] );

            editbox.setAttribute("onkeyup",  "javascript: parameterValueChanged('"+parameter+"');" );
            if (pmeta.group == calculatedGroup) {
                editbox.setAttribute("readOnly", "true");
                editbox.setAttribute("class", "disabled");
                row.setAttribute("class", "noneditable");
            } else {
                row.setAttribute("class", "editable");
            }
 
            el.appendChild(editbox);
            result = editbox;               
            
            row.appendChild(el);
            tbody.appendChild(row);
            return result;
        }
        calcOptionChanged();
</script>

    
</body>
</html>
