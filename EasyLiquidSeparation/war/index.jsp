<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- !DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd" -->
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>
<script src="assets/js/scripts.js"></script>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="assets/js/modules/module.js"></script>
<script src="assets/js/modules/DensityConcentrationCalculator.js"></script>
<script src="assets/js/modules/RfFromCakeSaturation.js"></script>
<link href="assets/css/bootstrap.css" type="text/css" rel="stylesheet" media="screen"/>
<script src="assets/js/bootstrap.js"></script>


<script  type="text/javascript">
    
    var currentModules = [];
    
    function createModule(m) {
        currentModules.push(m)
        var mainDiv = document.getElementsByClassName("row")[0];
        var o = createModuleBlock(m);
        mainDiv.appendChild(o);
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
            if (currentModules[i] == m) {
                currentModules[i].editTime = (new Date()).getTime();
            }
        }
    }
        
    function Calculate(m) {    
        m.calculate();       
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
            Calculate(currentModules[i]);
            last_processing_time = now.getTime();
        }
    }

    setInterval(Process, delay)

</script>
</head>


<body  style="background-color:#2F3945">
    <form>
    <div class = "content ">
    <div class = "inputbar">
<%
UserService userService = UserServiceFactory.getUserService();
User user = userService.getCurrentUser();
if (user != null) {
  pageContext.setAttribute("user", user);
%><div> <p>Hello, ${fn:escapeXml(user.nickname)}! (
<a href="<%= userService.createLogoutURL(request.getRequestURI()) %>">sign out</a>.)</p></div>
<%
    } else {
    response.sendRedirect(userService.createLoginURL(request.getRequestURI()));
    }
%>
<input type="button" onclick="alert('<%= session.getId() %>');" value="session ID" />

 </div>
<div class="row">       
    <div class = "main_div inputbar">
        <input type="button" onclick="javascript: createModule(new DensityConcentrationCalculator());" value="DensityConcentrationCalculator"/>
        <input type="button" onclick="javascript: createModule(new RfFromCakeSaturation());" value="RfFromCakeSaturation"/>        
        <input type="button" onclick="javascript: SaveAll();" value="Save all"/>
        <input type="button" onclick="javascript: LoadAll();" value="Load all"/>
    </div>
    </div>
</div>
</form>
 <script  type="text/javascript">
    var map = {"kg/m3":1, "g/l":1, "%":0.01}


    function Serialize(module) {
        var values = {}
        for (p in module.parameters_meta) {
            values[p] = module.parameters_meta[p].value
        }
        var map = {
            name : module.constructor.name,
            position : module.position,
            parameters : values
        }
        return JSON.stringify(map)
    }
    
    function Deserialize(m) {
        var module;
        switch (m.name) {
            case "RfFromCakeSaturation":
                module = new RfFromCakeSaturation();
                break;
            case "DensityConcentrationCalculator":
                module = new DensityConcentrationCalculator();
                break;
        }
        module.updateParameters(m.parameters);
        module.id = m.id;
        module.position = m.position;
        return module
    }

    userdocId = ""
    
    function SaveAll() {
        var modules = []
        for(var i in currentModules) {
            modules[i] = Serialize(currentModules[i])
        } 
        var request = {
            id : userdocId,
            action : "save",
            modules : modules,
        }
        $.get('ActionServlet', request, function(responseText) {
            if (request["action"] == "save") {
                userdocId = responseText;
            }
        });
    }

    function LoadAll() {
        $.get('ActionServlet', {"action" : "load"}, function(response) {
            // Remove controls from UI.
            for (var i in currentModules) {
                var m = currentModules[i];  
                m.control.parentNode.removeChild(m.control);
            }
            // Clear modules array.
            currentModules = []
            // Create new modules that downloaded from DB.
            for (var i in response) {
                var m = Deserialize(response[i])
                createModule(m)
            }
        });
    }

    
</script>

    
</body>
</html>
