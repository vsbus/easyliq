package easyliq;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
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
        if (request.getParameter("action") != null
                && request.getParameter("action").equals("calculate")) {
            try {
                Calculate(request, response);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        if (request.getParameter("action") != null
                && request.getParameter("action").equals("save")) {
            try {
                Save(request, response);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        if (request.getParameter("action") != null
                && request.getParameter("action").equals("update")) {
            try {
                Update(request, response);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        if (request.getParameter("action") != null
                && request.getParameter("action").equals("delete")) {
            try {
                Delete(request, response);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        if (request.getParameter("action") != null
                && request.getParameter("action").equals("get")) {
            try {
                DownloadUserDocument(request, response);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
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
            json = json + JsonPair(p.toString(), String.valueOf(calcParams.get(p)));
        }
        json = json + "}";
        response.getWriter().write(json);
        response.getWriter().flush();
    }

    private Calculator CreateCalculator(String calculator) {
        switch (calculator) {
        case "DensityConcentrationCalculator":
            return new Density();
        case "RfFromCakeSaturation":
            return new RfFromCakeSaturation();
        }
        return null;
    }

    private void DownloadUserDocument(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String query = "select from " + UserDocument.class.getName();// where author.getUserId()=="+user.getUserId();
        List<UserDocument> userdoc = (List<UserDocument>) pm.newQuery(query).execute();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String json = "{";
        if (userdoc.isEmpty()) {
            json = json + JsonPair("error", "no documents found");
        } else {
            json = json + "\"documents\":[";
            boolean isFirst = true;
            for (UserDocument g : userdoc) {
                if (!g.getAuthor().getEmail().equals(user.getEmail())) {
                    continue;
                }
                if (!isFirst) {
                    json = json + ",";
                }
                json = json + "{";
                json = json + JsonPair("id", String.valueOf(g.getKey())) + ",";
                if (g.getAuthor() == null) {
                    json = json + JsonPair("author", "anonymous");
                } else {
                    json = json + JsonPair("author", g.getAuthor().getNickname());
                }

                Module m = g.getContent();

                json = json + "," + JsonPair("module_name", m.getName());
                List<ParameterData> pd = m.getData();
                for (ParameterData p : pd) {
                    json = json + ",";
                    json = json + JsonPair(p.getName(), String.valueOf(p.getValue()));
                }
                json = json + "}";
                isFirst = false;
            }
        }
        json = json + "]}";
        response.getWriter().write(json);
        response.getWriter().flush();
        pm.close();
    }

    private String JsonPair(String name, String value) {
        return "\"" + name + "\":\"" + value+"\"";
    }
    private void Save(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        Date date = new Date();

        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        List<ParameterData> data = new ArrayList<ParameterData>();
        Calculator calculator = CreateCalculator(request.getParameter("name"));
        HashSet<Parameter> parameters = calculator.getParametersSet();
        for (Parameter p : parameters) {
            String parStr = request.getParameter(p.toString());
            data.add(new ParameterData(p.toString(), Double.parseDouble(parStr)));
        }
        UserDocument userDoc = new UserDocument(user, new Module(
                request.getParameter("name"), data), date);
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            pm.makePersistent(userDoc);
        } finally {
            pm.close();
        }
        response.getWriter().write(String.valueOf(userDoc.getKey()));
    } 

    private void Update(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        List<ParameterData> data = new ArrayList<ParameterData>();
        Calculator calculator = CreateCalculator(request.getParameter("name"));
        HashSet<Parameter> parameters = calculator.getParametersSet();
        for (Parameter p : parameters) {
            String parStr = request.getParameter(p.toString());
            data.add(new ParameterData(p.toString(), Double.parseDouble(parStr)));
        }
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            UserDocument ud = pm.getObjectById(UserDocument.class,
                    Long.parseLong(request.getParameter("id")));
            ud.setContent(new Module(request.getParameter("name"), data));
        } finally {
            pm.close();
        }
    }

    private void Delete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            UserDocument ud = pm.getObjectById(UserDocument.class,
                    Long.parseLong(request.getParameter("id")));
            pm.deletePersistent(ud);
        } finally {
            pm.close();
        }
    }
}
