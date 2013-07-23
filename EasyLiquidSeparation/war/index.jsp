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

    // Calculation Options:
    calc_rho_f = "CALC_RHO_F"
    calc_rho_s = "CALC_RHO_S"
    calc_rho_sus = "CALC_RHO_SUS"
    calc_CmCvC = "CALC_CMCVC"

    ////////////////////////////////////////////////////////////////////////////

    function getCalculationOptionKey()
    {
        var e = document.getElementById('calc_param');
        return e.options[e.selectedIndex].value;
    }
    
    function paramChanged()
    {        
        var calculationOptionKey = getCalculationOptionKey();
       
        for (var key in params) 
        {
            var p = params[key];
            p.editable = calc_options[calculationOptionKey].group.indexOf(key) < 0;
            var e = params[key].element;
            if (p.editable)
            {
                e.removeAttribute("readOnly");
                e.removeAttribute("class");                
            }
            else{
                e.setAttribute("readOnly", "true");
                e.setAttribute("class", "disabled");                
            }
            e.parentNode.parentNode.setAttribute("class",
                p.editable ? "editable" : "noneditable");
        }
    }

    var input = "";
    var delay = 0;

    function updateTable(e)
    {
        input = e;
        params[e].value = params[e].element.value * map[params[e].unit];
        now = new Date();
        last_user_action_time = now.getTime();
    }
	
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();

    function Calculate()
    {    
        var request = {
            action:        "calculate", 
            selectedGroup: getCalculationOptionKey(), 
            isInList:      (calc_options[calc_CmCvC].group.indexOf(input) >= 0),
            input:         input, 
        }
        // For parameter fields we can't use initialization list.
        request[Cm] =      params[Cm].value, 
        request[rho_s] =   params[rho_s].value,
        request[rho_f] =   params[rho_f].value, 
        request[rho_sus] = params[rho_sus].value,
        request[Cv] =      params[Cv].value,
        request[C] =       params[C].value

        $.get('ActionServlet', request, function(responseText) {
            params[Cm].value = responseText.Cm;
	        params[rho_s].value = responseText.rho_s;
	        params[rho_f].value = responseText.rho_f;
	        params[rho_sus].value = responseText.rho_sus;
	        params[Cv].value = responseText.Cv;
	        params[C].value = responseText.C;	
	        Render();				        
        });
    }

    function Render()
    {        
        for (var key in params)
        {
            if (key == input) {
                continue;
            }
            params[key].element.value = Number(
                (params[key].value / map[params[key].unit]).toFixed(5));
        }
    }    

	function Process()
	{
		if (last_user_action_time <= last_processing_time)
			return;

		now = new Date();
		timediff = now.getTime() - last_user_action_time;

		if (timediff < delay)
			return;

		Calculate();

		last_processing_time = now.getTime();
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

        <select id="calc_param" role="listbox" class="ui-pg-selbox" onChange="paramChanged();">
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
        var params = {}
        params[rho_f] =   { "name":"Filtrate Density",   "unit":"kg/m3", "value":"1418",  "editable":"true", "element":null }
        params[rho_s] =   { "name":"Solids Density",     "unit":"kg/m3", "value":"1000",  "editable":"true", "element":null }
        params[rho_sus] = { "name":"Suspension Density", "unit":"kg/m3", "value":"1350",  "editable":"true", "element":null }
        params[Cm] =      { "name":"Mass Fraction",      "unit":"%",     "value":"0.12",  "editable":"true", "element":null }
        params[Cv] =      { "name":"Volume Fraction",    "unit":"%",     "value":"0.162", "editable":"true", "element":null }
        params[C] =       { "name":"Concentration",      "unit":"g/l",   "value":"162",   "editable":"true", "element":null }
        
        // We can't use initialization list here because we want to use variables as keys.
        var calc_options = {}
        calc_options[calc_rho_f] =   { "name": "Filtrate Density (rho_f)",         "group": [rho_f] }
        calc_options[calc_rho_s] =   { "name": "Solids Density (rho_s)",           "group": [rho_s] }
        calc_options[calc_rho_sus] = { "name": "Suspension Density (rho_sus)",     "group": [rho_sus] }
        calc_options[calc_CmCvC] =   { "name": "Solids Mass Fraction (Cm, Cv, C)", "group": [Cm, Cv,C] }
        
        var table = document.getElementById("pt");
        var body = document.createElement("tbody");
        table.appendChild(body);

        var checkBox = document.getElementById("calc_param");
        for (var key in calc_options) {
            var e = document.createElement("option");
            e.setAttribute("value", key);
            e.setAttribute("role", "option");
            e.text = calc_options[key].name;
            checkBox.appendChild(e);

        }

        for (var key in calc_options)
        {
            var group = calc_options[key].group;
            for (var i in group)
            {
                var param_key = group[i];
                params[param_key].element = createRow(param_key, body);
            }
            var em_row = document.createElement("tr");
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));                 

            em_row.setAttribute("class","rowseparator");
            body.appendChild(em_row);
        }
           
        function createRow(param_key, tbody)
        {
            var param = params[param_key];
            var result = null;
            var row = document.createElement("tr");
            var el = document.createElement("td");
            el.appendChild(document.createTextNode(param.name));
            row.appendChild(el);
            var el = document.createElement("td");
            el.appendChild(document.createTextNode(param.unit));
            row.appendChild(el);
            var el = document.createElement("td");
           
            var editbox = document.createElement("input");
            editbox.setAttribute("type",  "text" );
            editbox.setAttribute("value",  param.value / map[param.unit] );

            editbox.setAttribute("onkeyup",  "javascript: updateTable('"+param_key+"');" );
            if(!param.editable)
            {
                editbox.setAttribute("readOnly", "true");
                editbox.setAttribute("class", "disabled");
               // row.setAttribute("class", "noneditable");
            }
 
            el.appendChild(editbox);
            result = editbox;               
            
            row.appendChild(el);
            row.setAttribute("class", param.editable ? "editable" : "noneditable");
            tbody.appendChild(row);
            return result;
        }
        paramChanged();
</script>

    
</body>
</html>