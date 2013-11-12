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
import javax.print.DocFlavor.STRING;
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
            if (action.equals("savedoc")) {
                SaveDoc(request, response);
            }
            if (action.equals("removedoc")) {
                RemoveDoc(request, response);
            }
            if (action.equals("loaddoc")) {
                LoadAllDocs(request, response);
            }
            if (action.equals("savesettings")) {
                saveSettings(request, response);
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
            if (action.equals("calculate")) {
                Calculate(request, response);
            }
            if (action.equals("savedoc")) {
                SaveDoc(request, response);
            }
            if (action.equals("removedoc")) {
                RemoveDoc(request, response);
            }
            if (action.equals("loaddoc")) {
                LoadAllDocs(request, response);
            }
            if (action.equals("savesettings")) {
                saveSettings(request, response);
            }
            if (action.equals("loadsettings")) {
                loadSettings(request, response);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
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
            // Hack to force data store to apply deletion: As pm.getObjectById
            // throws exceptions for not existing objects we are using
            // pm.flush() here that works fine with deleting but not with
            // changing elements.
            pm.flush();
        } finally {
            pm.close();
        }
    }

    private void LoadAllDocs(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String query = "select from " + UserDocument.class.getName()
                + " where authorEmail=='" + user.getEmail() + "'";
        @SuppressWarnings("unchecked")
        List<UserDocument> r = (List<UserDocument>) pm.newQuery(query)
                .execute();
        
        Collections.sort(r, new Comparator<UserDocument>() {
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

        
        if (!r.isEmpty()) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String json = "[";
            boolean isFirst = true;
            for (UserDocument doc : r) {
                if (!isFirst) {
                    json = json + ",";
                }
                isFirst = false;
                json = json + "{" + JsonPair("docName", doc.getName());
                json = json + "," + JsonPair("id", doc.getKey());
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
            json = json + "]";
            pm.close();
            response.getWriter().write(json);
        }
    }

    private String JsonPair(String name, String value) {
        return "\"" + name + "\":\"" + value + "\"";
    }

    private void SaveDoc(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        pm.setIgnoreCache(true);
        String name = request.getParameter("docName");
        String id = request.getParameter("id");
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
                        modules);
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
        String docId = request.getParameter("id");
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            String query = "select from " + UserInfo.class.getName()
                    + " where email=='" + email + "'";
            List<UserInfo> ui = (List<UserInfo>) pm.newQuery(query).execute();
            if (ui.isEmpty()) {
                UserInfo uInfo = new UserInfo(email, docId);
                pm.makePersistent(uInfo);
            } else {
                UserInfo uInfo = ui.get(0);
                uInfo.setActiveDocKey(docId);
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
            String query = "select from " + UserInfo.class.getName()
                    + " where email=='" + email + "'";
            List<UserInfo> ui = (List<UserInfo>) pm.newQuery(query).execute();
            if (ui.isEmpty()) {
                response.getWriter().write("");
            } else {
                UserInfo uInfo = ui.get(0);
                response.getWriter().write(uInfo.getActiveDocKey());
            }
        } finally {
            pm.close();
        }
    }
}
