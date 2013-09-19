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
<script src="assets/js/index.js"></script>
<script src="assets/js/perpetum.js"></script>
<script src="assets/js/requests.js"></script>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="assets/js/modules/module.js"></script>
<script src="assets/js/modules/DensityConcentration.js"></script>
<script src="assets/js/modules/RfFromCakeSaturation.js"></script>
<link href="assets/css/bootstrap.css" type="text/css" rel="stylesheet" media="screen"/>
<script src="assets/js/bootstrap.js"></script>


<script  type="text/javascript">
    userdocId = ""
    
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
        <input type="button" onclick="javascript: createModule(new DensityConcentration());" value="DensityConcentration"/>
        <input type="button" onclick="javascript: createModule(new RfFromCakeSaturation());" value="RfFromCakeSaturation"/>        
        <input type="button" onclick="javascript: SaveAll();" value="Save all"/>
        <input type="button" onclick="javascript: LoadAll();" value="Load all"/>
    </div>
    </div>
</div>
</form>
 <script  type="text/javascript">
</script>

    
</body>
</html>
