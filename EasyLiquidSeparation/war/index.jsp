<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="assets/js/modules.js"></script>
<script src="assets/js/fsDensityConcentrationCalculator.js"></script>

<script  type="text/javascript">
var currentModule = null;
    function draw(m)
 	{
 		currentModule = m; 
 		clearCalculationOptions();
 		clearParametersTable();
 		drawCalculationOptions(m);
 		drawParametersTable(m); 				 
 	} 
 	
 	function clearCalculationOptions(){
 		var d = document.getElementById("calc_option_div"); 		
 		while(d.firstChild != null)
 		{
 			d.removeChild(d.firstChild); 			
 		}
 	}
    
    function clearParametersTable()
    {
    	var table = document.getElementById("pt");
    	var body = table.getElementsByTagName("tbody")[0];
    	if(body != null){
    		table.removeChild(body);
    	}    	
    }
    
    function drawCalculationOptions(m){
    	var d = document.getElementById("calc_option_div");
 		var s = document.createElement("span");    		
    	s.innerHTML = m.combos[0].name;
    	d.appendChild(s);
 		var comboBox = document.createElement("select");
 		comboBox.setAttribute("role", "listbox");
 		//comboBox.setAttribute("onChange", "("+m.combos[0].onchange+")()");
 		//comboBox.setAttribute("onChange", "("+m.onComboChanged+")(this)");
 		//comboBox.setAttribute("onChange", "("+m.onComboChanged+")()");
 		comboBox.onchange = function(){m.onComboChanged(m);};
 		
 		m.combos[0].control = comboBox;
 		d.appendChild(comboBox);
 		for(var i in m.combos[0].options){ 		
 			var e = document.createElement("option");
 			e.setAttribute("value", i);
            e.setAttribute("role", "option");
            e.text = m.combos[0].options[i].name;
            comboBox.appendChild(e);
 		}
 		comboBox.selectedIndex = 2;
    }
    function drawParametersTable(m){
    	var table = document.getElementById("pt");
    	var body = document.createElement("tbody");
        table.appendChild(body);

        for (var key in m.combos[0].options) {
            var group_parameters = m.groups_meta[m.combos[0].options[key].group].parameters;
            for (var i in group_parameters) {
                var parameter = group_parameters[i];
                m.parameters_meta[parameter].element = createRow(m, parameter, body);
            }
            var em_row = document.createElement("tr");
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));                 

            em_row.setAttribute("class","rowseparator");
            body.appendChild(em_row);
        }
    }
    
    var delay = 0;

    function parameterValueChanged(parameter) {
        var meta = currentModule.parameters_meta[parameter];
        currentModule.groups_meta[meta.group].representator = parameter;
        meta.value = meta.element.value * map[meta.unit];
        last_user_action_time = (new Date()).getTime();
    }
	
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();

    function Calculate()
    {    
    	currentModule.calculate(currentModule);		   
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
    	<input type="button" onclick="javascript: draw(new DensityConcentrationCalculator());" value="fsDensityConcentrationCalculator"/>
    	<div id="calc_option_div"/>    	
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
                
       
           
        function createRow(m, parameter, tbody) {
            var pmeta = m.parameters_meta[parameter];
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
            if (pmeta.group == m.calculatedGroup) {
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
        //calcOptionChanged();
</script>

    
</body>
</html>
