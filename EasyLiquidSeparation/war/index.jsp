<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="assets/js/modules.js"></script>
<script src="assets/js/DensityConcentrationCalculator.js"></script>
<script src="assets/js/RfFromCakeSaturation.js"></script>

<script  type="text/javascript">
    
    var currentModules = [];
    
    function ceateModule(m) {
        var o = {module: m, editTime:(new Date()).getTime()};
        currentModules.push(o)
        var mainDiv = document.getElementsByClassName("content")[0];
        var moduleDiv = document.createElement("div");
        moduleDiv.setAttribute("class", "main_div inputbar");
        mainDiv.appendChild(moduleDiv);
        
        drawCalculationOptions(moduleDiv, m);
        drawParametersTable(moduleDiv, m);
    } 
     
    function clearCalculationOptions() {
        var d = document.getElementById("calc_option_div");     
        while (d.firstChild != null) {
            d.removeChild(d.firstChild);     
        }
    }
    
    function clearParametersTable() {
        var table = document.getElementById("pt");
        var body = table.getElementsByTagName("tbody")[0];
        if (body != null) {
            table.removeChild(body);
        }
    }
    
    function drawCalculationOptions(div, m) {
        var comboDiv = document.createElement("div");
        comboDiv.setAttribute("class", "calc_option_div");
        div.appendChild(comboDiv);
        
        var s = document.createElement("span");
        s.setAttribute("class", "label");
        s.innerHTML = m.combos[0].name;
        comboDiv.appendChild(s);
        var comboBox = document.createElement("select");
        comboBox.setAttribute("role", "listbox");
        comboBox.onchange = function(){m.onComboChanged(m);};
    
        m.combos[0].control = comboBox;
        comboDiv.appendChild(comboBox);
        var selected_index = null;
        for (var i in m.combos[0].options) {     
            var e = document.createElement("option");
            e.setAttribute("value", i);
            e.setAttribute("role", "option");
            e.text = m.combos[0].options[i].name;
            comboBox.appendChild(e);
            if (m.combos[0].options[i].group == m.calculatedGroup) {
                selected_index = comboBox.options.length - 1;
            }
        }
        comboBox.selectedIndex = selected_index;
    }
    
    function drawParametersTable(div, m) {
        var table = createTableWithHeaders(div);
        //var table = document.getElementById("pt");
        var body = document.createElement("tbody");
        table.appendChild(body);

        for (var key in m.groups_meta) {
            var group_parameters = m.groups_meta[key].parameters;
            for (var i in group_parameters) {
                var parameter = group_parameters[i];
                m.parameters_meta[parameter].element = createRow(m, parameter, body);
            }
        
            em_row = document.createElement("tr");
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));
            em_row.appendChild(document.createElement("td"));

            em_row.setAttribute("class","rowseparator");
            body.appendChild(em_row);
        }
    }
    
    var delay = 0;
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();
    
    function parameterValueChanged(m, parameter) { 
        var pmeta = m.parameters_meta[parameter];
        if (pmeta.group == m.calculatedGroup) { 
            return;
        }
        var meta = m.parameters_meta[parameter];
        m.groups_meta[meta.group].representator = parameter;
        meta.value = meta.element.value * map[meta.unit];
        last_user_action_time = (new Date()).getTime();
        
        for (var i in currentModules) {
            if (currentModules[i].module == m) {
                currentModules[i].editTime = (new Date()).getTime();
            }
        }
    }
        
    function Calculate(m) {    
        m.calculate(m);       
    }

    function Process() {
        for (var i in currentModules) {
            if (currentModules[i].editTime <= last_processing_time) {
                continue;
            }
            now = new Date()
            timediff = now.getTime() - currentModules[i].editTime;
            if (timediff < delay) {
                continue;
            }
            Calculate(currentModules[i].module);
            last_processing_time = now.getTime();
        }
    }

    setInterval(Process, delay)

</script>
</head>


<body  style="background-color:#2F3945">
    <form>
<div class = "content">       
    <div class = "main_div inputbar">
        <input type="button" onclick="javascript: ceateModule(new DensityConcentrationCalculator());" value="DensityConcentrationCalculator"/>
        <input type="button" onclick="javascript: ceateModule(new RfFromCakeSaturation());" value="RfFromCakeSaturation"/>       
    </div>
</div>
</form>
 <script  type="text/javascript">
    var map = {"kg/m3":1, "g/l":1, "%":0.01}
    
    function createTableWithHeaders(div) {
        var table = document.createElement("table");
        table.setAttribute("class", "pt");
        var thead = document.createElement("thead");
        table.appendChild(thead);
        var tr = document.createElement("tr");
        thead.appendChild(tr);

        createHeader(tr, "Parameters");
        createHeader(tr, "Units");
        createHeader(tr, "Value");

        div.appendChild(table);

        return table;
    }
    function createHeader(row, value) {
        var th = document.createElement("th");
        th.setAttribute("class", "info");
        th.innerHTML = value;
        row.appendChild(th);
    }
    
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
        editbox.setAttribute("type",  "text");
        editbox.setAttribute("value",  pmeta.value / map[pmeta.unit]);
    
        editbox.onkeyup = function() {
            parameterValueChanged(m, parameter);
        }
            
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
</script>

    
</body>
</html>
