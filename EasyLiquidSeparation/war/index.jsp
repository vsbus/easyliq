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
<script src="assets/js/modules.js"></script>
<script src="assets/js/DensityConcentrationCalculator.js"></script>
<script src="assets/js/RfFromCakeSaturation.js"></script>
<link href="assets/css/bootstrap.css" type="text/css" rel="stylesheet" media="screen"/>
<script src="assets/js/bootstrap.js"></script>


<script  type="text/javascript">
    
    var currentModules = [];
    
    function ceateModule(m) {
        var moduleData = generateModuleData(m);
        currentModules.push(moduleData)
        var mainDiv = document.getElementsByClassName("row")[0];
        var o = generateModuleBlock(moduleData);
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
            if (currentModules[i].module == m) {
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
            Calculate(currentModules[i].module);
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
        <input type="button" onclick="javascript: ceateModule(new DensityConcentrationCalculator());" value="DensityConcentrationCalculator"/>
        <input type="button" onclick="javascript: ceateModule(new RfFromCakeSaturation());" value="RfFromCakeSaturation"/>
        <input type="button" onclick="javascript: Get();" value="Get"/>
        <input type="button" onclick="javascript: SaveAll();" value="Save all"/>
    </div>
    </div>
</div>
</form>
 <script  type="text/javascript">
    var map = {"kg/m3":1, "g/l":1, "%":0.01}
    
         
    function Get() {
        var request = {
            action : "get"
        }        
        $.get('ActionServlet', request, function(responseText) {
            if (responseText["error"]!= null) {
                alert(responseText["error"]);
                return;
            }
            for (var i in responseText["documents"]) {
                var m = new Module();
                switch (responseText["documents"][i]["module_name"]) {
                    case "RfFromCakeSaturation":
                        m = new RfFromCakeSaturation();
                        m.updateParameters(responseText["documents"][i]);
                        m.id = responseText["documents"][i]["id"];
                        m.position = responseText["documents"][i]["position"];
                        ceateModule(m);
                        break;
                    case "DensityConcentrationCalculator":
                        m = new DensityConcentrationCalculator();
                        m.updateParameters(responseText["documents"][i]);
                        m.id = responseText["documents"][i]["id"];
                        m.position = responseText["documents"][i]["position"];
                        ceateModule(m);
                        break;
                }
            }
        });
    }
    
    function SaveAll() {
        for(var i = 0; i < currentModules.length; i++) {
            currentModules[i].module.position = i;
            currentModules[i].module.Save(currentModules[i].module);
        } 
    }
</script>

    
</body>
</html>
