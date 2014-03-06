<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- !DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd" -->
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <link href="assets/css/bootstrap.css" type="text/css" rel="stylesheet" media="screen" />
    <link href="assets/css/docs.css" type="text/css" rel="stylesheet" media="screen" />
    <link href="assets/css/styles.css" type="text/css" rel="stylesheet" />

    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

    <script src="assets/js/bootstrap.js"></script>
    <script src="assets/js/events.js"></script>
    <script src="assets/js/requests.js"></script>
    <script src="assets/js/ui.js"></script>

    <script src="assets/js/modules/module.js"></script>
    <script src="assets/js/modules/DensityConcentration.js"></script>
    <script src="assets/js/modules/RfFromCakeSaturation.js"></script>

    <script src="assets/js/main.js"></script>

    <script type="text/javascript">
        userdocId = "";
    </script>
</head>

<body style="background:url('assets/images/bg.png') repeat scroll left top transparent">
    <form>
        <div class="">
            <div class="row">
                <div class="span4">
                    <div id="shadow">
                        <div id="overlay"></div>
                        <div class="popup">
                            <div id="newname_popup" class="inputbar">
                                new name:
                                <div id="valid_message"></div>
                                <input type="text" id="new_name"></input>
                                <input type="button" id="save_name" value="Save"></input>
                                <input type="button" onclick="javascript: cancelButtonClick();" value="Cancel" />
                            </div>
                        </div>
                    </div>


                    <div style="padding:10">
	                    <div>Projects:</div>
	                    <input type="button" onclick="javascript: addDefaultFolder();" value="Add" />
	                    <input type="button" onclick="javascript: removeFolderClick();" value="Remove" />
	                    <input type="button" onclick="javascript: renameFolderClick();" value="Rename" />
                    </div>
                    <div class="bs-sidebar hidden-print" role="complementary">
                        <ul id="folders_list" class="nav bs-sidenav">
                        </ul>
                    </div>
                    <div style="padding:10">	                    
	                    <div>Documents:</div>
	                    <input type="button" onclick="javascript: addDocumentToCurrentFolderClick();" value="Add" />
	                    <input type="button" onclick="javascript: removeDocumentClick();" value="Remove" />
	                    <input type="button" onclick="javascript: renameDocumentClick();" value="Rename" />
                    </div>

                </div>
                <div class="span8">
                    <div class="inputbar">
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
                <input type="button" onclick="javascript: addModulesRowButtonClick();" value="New Line"/>
              </div>
              </div>
          </div>
         <div style = "padding-top: 20">
             <input type="button" onclick="javascript: triggerProjectComments();" value="Project Comments"/>
             <textarea id = "project_comments" style="display: none; margin-top: 5px; width: 100%; max-width: 100%; height: 120px">Write your project comments here.</textarea>
         </div>
         <div style = "padding-top: 20">
             <input type="button" onclick="javascript: triggerDocumentComments();" value="Document Comments"/>
             <textarea id="document_comments" onkeyup="javascript: documentCommentsChanged();" style="display: none; margin-top: 5px; width: 100%; max-width: 100%; height: 120px">Write your document comments here.</textarea>
         </div>
         <div id = "modules_div">
         </div>
      </div>
    </div>
  </div>    
</form>
<script  type="text/javascript">
initWorkspace();
$("#shadow").hide();
</script>
</body>
</html>
