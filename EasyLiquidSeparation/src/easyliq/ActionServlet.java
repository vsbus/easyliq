package easyliq;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import easyliq.Calculators.Calculator;
import easyliq.Calculators.Density;
import easyliq.Calculators.RfFromCakeSaturation;
import easyliq.dbobject.*;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

/**
 * Servlet implementation class ActionServlet
 */

public class ActionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger log = Logger.getLogger(ActionServlet.class
            .getName());

    public ActionServlet() {
        // TODO Auto-generated constructor stub
    }

    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) {
        String action = request.getParameter("action");
        if (action == null) {
            return;
        }
        try {
            if (action.equals("calculate")) {
                Calculate(request, response);
            }
            if (action.equals("removefolder")) {
                RemoveFolder(request, response);
            }
            if (action.equals("removedoc")) {
                RemoveDoc(request, response);
            }
            if (action.equals("loadfolders")) {
                LoadFolders(request, response);
            }
            if (action.equals("loadsettings")) {
                loadSettings(request, response);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

	protected void doPost(HttpServletRequest request,
            HttpServletResponse response) {
        String action = request.getParameter("action");
        if (action == null) {
            return;
        }
        try {
            if (action.equals("savedoc")) {
                SaveDoc(request, response);                
            }
            if (action.equals("movedoctofolder")) {
                MoveDocToFolder(request, response);
            }
            if (action.equals("savefolder")) {
                SaveFolder(request, response);
            }
            if (action.equals("removedoc")) {
                RemoveDoc(request, response);
            }
            if (action.equals("savesettings")) {
                saveSettings(request, response);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void MoveDocToFolder(HttpServletRequest request,
            HttpServletResponse response) {
        PersistenceManager pm = PMF.get().getPersistenceManager();
        String docId = request.getParameter("doc");
        Query query = pm.newQuery(DocumentLocation.class, "docKey == '" + docId + "'" );
        @SuppressWarnings("unchecked")
        List<DocumentLocation> location = (List<DocumentLocation>) query.execute();
        if (location.isEmpty()) {
            DocumentLocation fd = new DocumentLocation(request.getParameter("folder"), docId);
            pm.makePersistent(fd);
        } else {
            location.get(0).setParentFolderKey(request.getParameter("folder"));
            pm.makePersistent(location.get(0));
        }
    }
    
    private void Calculate(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Calculator calculator = CreateCalculator(request
                .getParameter("calculator"));
        HashSet<Parameter> parameters = calculator.getParametersSet();
        CalculationParameters calcParams = new CalculationParameters();
        for (Parameter p : parameters) {
            String parStr = request.getParameter(p.toString());
            if (parStr == null) {
                calcParams.addUnknown(p);
            } else {
                calcParams.addKnown(p, Double.parseDouble(parStr));
            }
        }
        calculator.Calculate(calcParams);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String json = "{";
        boolean isFirst = true;
        for (Parameter p : parameters) {
            if (!isFirst) {
                json = json + ",";
            } else {
                isFirst = false;
            }
            json = json
                    + JsonPair(p.toString(), String.valueOf(calcParams.get(p)));
        }
        json = json + "}";
        response.getWriter().write(json);
        response.getWriter().flush();
    }

    private Calculator CreateCalculator(String calculator) {
        if (calculator.equals("DensityConcentration")) {
            return new Density();
        }
        if (calculator.equals("RfFromCakeSaturation")) {
            return new RfFromCakeSaturation();
        }
        return null;
    }

    private void RemoveDoc(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        PersistenceManager pm = PMF.get().getPersistenceManager();
        String id = request.getParameter("id");
        try {
            pm.deletePersistent(pm.getObjectById(UserDocument.class, id));
            Query query = pm.newQuery(DocumentLocation.class, "docKey == '" + id +"'");
            List<DocumentLocation> dl = (List<DocumentLocation>)query.execute();
            for(DocumentLocation el : dl) {
                pm.deletePersistent(el);
            }
            // Hack to force data store to apply deletion: As pm.getObjectById
            // throws exceptions for not existing objects we are using
            // pm.flush() here that works fine with deleting but not with
            // changing elements.
            pm.flush();
        } finally {
            pm.close();
        }
    }
    
    private void RemoveFolder(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        PersistenceManager pm = PMF.get().getPersistenceManager();
        String id = request.getParameter("id");
        try {
            pm.deletePersistent(pm.getObjectById(UserFolder.class, id));
            Query query = pm.newQuery(DocumentLocation.class, "parentFolderKey == '" + id + "'");
            List<DocumentLocation> fdList = (List<DocumentLocation>)query.execute();
            if(!fdList.isEmpty()) {
                for(DocumentLocation fd : fdList) {
                    pm.deletePersistent(pm.getObjectById(UserDocument.class, fd.getDocKey()));
                }
                
                for(DocumentLocation fd : fdList) {
                    pm.deletePersistent(fd);
                }
            }
            // Hack to force data store to apply deletion: As pm.getObjectById
            // throws exceptions for not existing objects we are using
            // pm.flush() here that works fine with deleting but not with
            // changing elements.
            pm.flush();
        } finally {
            pm.close();
        }
    }

    private void SaveFolder(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        pm.setIgnoreCache(true);
        String name = request.getParameter("folderName");
        String id = request.getParameter("id");
        String comments = request.getParameter("comments");
        Boolean isActiveDoc = Boolean.parseBoolean(request.getParameter("isactive"));
        try {
            if (id.isEmpty()) {
                UserFolder fld = new UserFolder(name, user.getEmail(), comments);
                pm.makePersistent(fld);
                String key = fld.getKey();
                response.getWriter().write(key);
                // Hack to force data store to apply changes: Query to the added
                // element.
                pm.getObjectById(UserFolder.class, key);
            } else {
                UserFolder f = pm.getObjectById(UserFolder.class, id);
                f.setName(name);
                f.setComments(comments);
                response.getWriter().write(id);
                // Hack to force data store to apply changes: Query to the added
                // element.
                pm.getObjectById(UserFolder.class, id);
            }
        } finally {
            pm.close();
        }
    }

    private void LoadFolders(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String query = "select from " + UserFolder.class.getName()
                + " where authorEmail=='" + user.getEmail()
                + "' order by creationDate";
        @SuppressWarnings("unchecked")
        List<UserFolder> folders = (List<UserFolder>) pm.newQuery(query)
                .execute();
        if (folders.isEmpty()) {
            return;
        }
        String json = "[";
        boolean isFirst = true;
        for (UserFolder f : folders) {
            if (!isFirst) {
                json = json + ",";
            }
            isFirst = false;
            json = json + "{" + JsonPair("folderName", f.getName());
            json = json + "," + JsonPair("id", f.getKey());
            json = json + "," + JsonPair("comments", f.getComments());
            List<UserDocument> docs = GetDocumentsOfFolder(f);
            json = json + "," + "\"documents\" : [";
            if (!docs.isEmpty()) {
                boolean isFirstDoc = true;
                for (UserDocument doc : docs) {
                    if (!isFirstDoc) {
                        json = json + ",";
                    }
                    isFirstDoc = false;
                    json = json + GetDocumentJson(doc);
                }
            }
            json = json + "]}";
        }
        json = json + "]";
        pm.close();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    private List<UserDocument> GetDocumentsOfFolder(UserFolder f) throws Exception {
        List<UserDocument> result = new ArrayList<UserDocument>();
        PersistenceManager pm = PMF.get().getPersistenceManager();
        String query = "select docKey from " + DocumentLocation.class.getName()
                + " where parentFolderKey == '" + f.getKey() + "'";
        List<String> docsKeys = (List<String>) pm.newQuery(query).execute();
        
        if (!docsKeys.isEmpty()) {
            List<UserDocument> docs = new ArrayList<UserDocument>();
            for (String docKey : docsKeys) {
                UserDocument doc = pm.getObjectById(UserDocument.class, docKey);
                docs.add(doc);
            }
            Collections.sort(docs, new Comparator<UserDocument>() {
                public int compare(UserDocument userdoc1, UserDocument userdoc2) {
                    Date date1 = userdoc1.getCreationDate();
                    Date date2 = userdoc2.getCreationDate();
                    if (date1 == null) {
                        return date2 == null ? 0 : -1;
                    }
                    if (date2 == null) {
                        return 1;
                    }
                    return date1.compareTo(date2);
                }
            });
            result = docs;
        }
        return result;
    }

    private void SaveDoc(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        pm.setIgnoreCache(true);
        String name = request.getParameter("docName");
        String id = request.getParameter("id");
        String comments = request.getParameter("comments");
        Boolean isActiveDoc = Boolean.parseBoolean(request
                .getParameter("isactive"));
        String[] s = request.getParameterValues("modules[]");
        List<String> modules = new ArrayList<String>();
        if (s != null) {
            modules = Arrays.asList(s);
        }
        try {
            if (id.isEmpty()) {
                UserDocument doc = new UserDocument(name, user.getEmail(),
                        modules, comments);
                pm.makePersistent(doc);
                String key = doc.getKey();
                response.getWriter().write(key);
                // Hack to force data store to apply changes: Query to the added
                // element.
                pm.getObjectById(UserDocument.class, key);
            } else {
                UserDocument doc = pm.getObjectById(UserDocument.class, id);
                doc.setName(name);
                doc.setModules(modules);
                doc.setComments(comments);
                response.getWriter().write(id);
                // Hack to force data store to apply changes: Query to the added
                // element.
                pm.getObjectById(UserDocument.class, id);
            }
        } finally {
            pm.close();
        }
    }

    private void saveSettings(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        String email = userService.getCurrentUser().getEmail();
        String settings = request.getParameter("settings");
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            Query query = pm.newQuery(UserInfo.class, "email=='" + email + "'");
            List<UserInfo> ui = (List<UserInfo>) query.execute();
            if (ui.isEmpty()) {
                UserInfo uInfo = new UserInfo(email, settings);
                pm.makePersistent(uInfo);
            } else {
                UserInfo uInfo = ui.get(0);
                uInfo.setSettingsJson(settings);
                pm.makePersistent(uInfo);
            }
        } finally {
            pm.close();
        }
    }

    private void loadSettings(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        String email = userService.getCurrentUser().getEmail();
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            Query query = pm.newQuery(UserInfo.class, "email=='" + email + "'");
            List<UserInfo> ui = (List<UserInfo>) query.execute();
            if (ui.isEmpty()) {
                response.getWriter().write("");
            } else {
                UserInfo uInfo = ui.get(0);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(uInfo.getSettingsJson());
            }
        } finally {
            pm.close();
        }
    }

    private String LoadDocByKeyJson(String key) throws IOException {
	    String json = "";
	    PersistenceManager pm = PMF.get().getPersistenceManager();
	    UserDocument doc = pm.getObjectById(UserDocument.class, key);
	    if (doc != null) {
	        json = GetDocumentJson(doc);
        }
        pm.close();
	    return json;
	}
	
    
    private String GetDocumentJson(UserDocument doc) throws IOException {
        String json = "";
        if (doc != null) {
            json = "{" + JsonPair("docName", doc.getName());
            json = json + "," + JsonPair("id", doc.getKey());
            json = json + "," + JsonPair("comments", doc.getComments());
            json = json + ",\"modules\":[";
            boolean isFirstModule = true;
            for (String m : doc.getModules()) {
                if (!isFirstModule) {
                    json = json + ",";
                }
                isFirstModule = false;
                json = json + m;
            }
            json = json + "]}";            
        }
        return json;
    }
	private String JsonPair(String name, String value) {
		StringBuilder jsonValue = new StringBuilder();
		for (char c : value.toCharArray()) {
			if (c == '\n') {
				jsonValue.append("\\n");
			} else {
				jsonValue.append(c);
			}
		}
	    return "\"" + name + "\":\"" + jsonValue.toString() + "\"";
	}
}