<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- !DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd" -->
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>

<link href="assets/css/bootstrap.css" type="text/css" rel="stylesheet" media="screen"/>
<link href="assets/css/docs.css" type="text/css" rel="stylesheet" media="screen"/>
<link href="assets/css/styles.css" type="text/css" rel="stylesheet"/>

<script src="http://code.jquery.com/jquery-latest.js"></script>

<script src="assets/js/bootstrap.js"></script>
<script src="assets/js/events.js"></script>
<script src="assets/js/requests.js"></script>
<script src="assets/js/ui.js"></script>

<script src="assets/js/modules/module.js"></script>
<script src="assets/js/modules/DensityConcentration.js"></script>
<script src="assets/js/modules/RfFromCakeSaturation.js"></script>

<script src="assets/js/main.js"></script>

<script  type="text/javascript">
    userdocId = ""
</script>
</head>

<body  style= "background:url('assets/images/bg.png') repeat scroll left top transparent">
 
    <form>
    <div id = "overlay" > 
        <div style="display: block; height: 100px; left: 35%;position: absolute; top: 45%; width: 30%; z-index: 100;" class="inputbar">
            document name:
            <input type="text" id="doc_name"></input>
            <input type = "button" id="save_doc" value="Save"></input>
        </div>    
    </div>
    <div class="bs-docs-sidebar">
        <ul id="documents_list" class="nav nav-list bs-docs-sidenav affix">
          <li><a>Document:
            <input type="button" onclick="javascript: addDefaultDocument();" value="Add"/>
              <input type="button" onclick="javascript: removeDocumentClick();" value="Remove"/>
              <input type="button" onclick="javascript: renameDocumentClick();" value="Rename"/>
              </a>
          </li>
        </ul>
      </div>
     
    <div class = "container">
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
            
            <div id = "status_message">
            </div>
            <div id = "main_menu">
            <div>
              Add Module: 
              <input type="button" onclick="javascript: addModuleButtonClick(new DensityConcentration());" value="DensityConcentration"/>
              <input type="button" onclick="javascript: addModuleButtonClick(new RfFromCakeSaturation());" value="RfFromCakeSaturation"/>        
            </div>
            </div>
        </div>
  
        <div class="row"> 

            </div>
    </div>
    
</form>
<script  type="text/javascript">
initWorkspace();
$("#overlay").hide();
</script>
</body>
</html>
