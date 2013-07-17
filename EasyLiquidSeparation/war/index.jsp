<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>
<script src="http://code.jquery.com/jquery-latest.js"></script>

<script  type="text/javascript">

    function getSelectedGroup()
    {
        var el = document.getElementById('calc_param');
        return el.options[el.selectedIndex].value;
    }
    function paramChanged()
    {        
        var sel = getSelectedGroup();
       
        for (var i in params) 
        {
            params[i].editable = !isInList(groups[sel], params[i].name);
            if(params[i].editable)
            {
                params[i].element.removeAttribute("readOnly");
                params[i].element.removeAttribute("class");                
            }
            else{
                params[i].element.setAttribute("readOnly", "true");
                params[i].element.setAttribute("class", "disabled");                
            }
            //params[i].element.setAttribute("contenteditable",  params[i].editable );
            params[i].element.parentNode.parentNode.setAttribute("class", params[i].editable ? "editable" : "noneditable");
        }
    }
    function isInList(list, param)
    {
        for(var j = 0 ; j< list.length; j++)
        {
            if (list[j] == param) return true;
        }
        return false;
    }   

    var input = "";
    var delay = 0;

    function updateTable(e)
    {
        input = e;
        params[e].value =params[e].element.value * map[params[e].unit];
        now = new Date();
        last_user_action_time = now.getTime();
    }
	
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();

    function Calculate()
    {                       
     $.get('ActionServlet',{action:"calculate", selectedGroup:getSelectedGroup(), isInList:isInList(groups["ssmf"], input),input:input, Cm:params["Cm"].value, rho_s:params["rho_s"].value,
        rho_f:params["rho_f"].value, rho_sus:params["rho_sus"].value,Cv:params["Cv"].value,C:params["C"].value},function(responseText) {
        		var s = 0;
				for(var i = 0; i < 100000000; ++i) {
 					s += i;
				}
                params["Cm"].value = responseText.Cm;
		        params["rho_s"].value = responseText.rho_s;
		        params["rho_f"].value = responseText.rho_f;
		        params["rho_sus"].value = responseText.rho_sus;
		        params["Cv"].value = responseText.Cv;
		        params["C"].value = responseText.C;	
		        Render();				        
	        });
    }

    function Render()
    {        
        for(var key in params)
        {
            if(key == input) 
                {
                    continue;
                }
            params[key].element.value = Number((params[key].value / map[params[key].unit]).toFixed(5));
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
            <option value="rho_f" role="option" selected="selected" >Filtrate Density (rho_f)</option>
            <option value="rho_s" role="option">Solids Density (rho_s)</option>
            <option value="rho_sus" role="option">Suspension Density (rho_sus)</option>
            <option value="ssmf" role="option">Suspension Solids Mass Fraction (Cm, Cv, C)</option>
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

        var map={"kg/m3":1, "g/l":1, "%":0.01}

        var groups={"rho_f":["rho_f"],
            "rho_s":["rho_s"],
            "rho_sus":["rho_sus"],
            "ssmf":["Cm", "Cv","C"]}

        var params = {
            "rho_f":{"name":"rho_f", "unit":"kg/m3","value":"1418","editable":"true", "element":null},
            "rho_s":{"name":"rho_s", "unit":"kg/m3","value":"1000","editable":"true", "element":null},
            "rho_sus":{"name":"rho_sus", "unit":"kg/m3","value":"1350","editable":"true", "element":null},
            "Cm":{"name":"Cm", "unit":"%", "value":"0.12","editable":"true", "element":null},
            "Cv":{"name":"Cv", "unit":"%", "value":"0.162","editable":"true", "element":null},
            "C":{"name":"C", "unit":"g/l", "value":"162","editable":"true", "element":null}
            }

            var table = document.getElementById("pt");
            var body = document.createElement("tbody");
            table.appendChild(body);

            for(var key in groups)
            {
                var group = groups[key];
                for(i = 0 ; i< group.length; i++)
                {
                    var p = group[i];
                    var el = createRow(params[p], body);
                    params[p].element = el;   
                }
                var em_row = document.createElement("tr");
                em_row.appendChild(document.createElement("td"));
                em_row.appendChild(document.createElement("td"));
                em_row.appendChild(document.createElement("td"));                 

                em_row.setAttribute("class","rowseparator");
                body.appendChild(em_row);
            }
           
        function createRow (param, tbody)
        {
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

            editbox.setAttribute("onkeyup",  "javascript: updateTable('"+param.name+"');" );
            if(!param.editable)
            {
                editbox.setAttribute("readOnly","true");
                editbox.setAttribute("class","disabled");
               // row.setAttribute("class", "noneditable");
            }
 
            el.appendChild(editbox);
            result = editbox;               
            
            row.appendChild(el);
            row.setAttribute("class", param.editable? "editable":"noneditable");
            tbody.appendChild(row);
            return result;
        }
        paramChanged();
</script>

    
</body>
</html>