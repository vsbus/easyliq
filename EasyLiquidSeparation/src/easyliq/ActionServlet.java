package easyliq;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
		String action = request.getParameter("action");
		if (action == null) {
			return;
		}
		try {
			if (action.equals("calculate")) {
				Calculate(request, response);
			}
			if (action.equals("save")) {
				Save(request, response);
			}
			if (action.equals("savedoc")) {
                SaveDoc(request, response);
            }
			if (action.equals("removedoc")) {
                RemoveDoc(request, response);
            }
			if (action.equals("load")) {
				Load(request, response);
			}
			if (action.equals("loaddoc")) {
                LoadDoc(request, response);
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

	private void Load(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		PersistenceManager pm = PMF.get().getPersistenceManager();
		String query = "select from " + UserDocument.class.getName()
				+ " where authorEmail=='" + user.getEmail() + "'";

		@SuppressWarnings("unchecked")
		List<UserDocument> r = (List<UserDocument>) pm.newQuery(query)
				.execute();
		if (!r.isEmpty()) {
			UserDocument userdoc = r.get(0);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			String json = "{\"id\":\""+ userdoc.getKey()+"\",\"modules\": [";
			boolean isFirst = true;
			for (String m : userdoc.getModules()) {
				if (!isFirst) {
					json = json + ",";
				}
				isFirst = false;
				json = json + m;
			}
			json = json + "]}";
			pm.close();
			response.getWriter().write(json);
		}
	}
	

    private void RemoveDoc(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String id = request.getParameter("id");
        try {
                pm.deletePersistent(pm.getObjectById(Document.class, id));
        } finally {
            pm.close();
        }
    }

	private void LoadDoc(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String query = "select from " + Document.class.getName()
                + " where authorEmail=='" + user.getEmail() + "'";
        @SuppressWarnings("unchecked")
        List<Document> r = (List<Document>) pm.newQuery(query)
                .execute();
        if (!r.isEmpty()) {
            Document userdoc = r.get(0);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String json = "[";
            boolean isFirst = true;
            for (Document doc : r) {
                if (!isFirst) {
                    json = json + ",";
                }
                isFirst = false;
                json = json + "{"+ JsonPair("docName", doc.getName());                
                json = json + "," + JsonPair("id", doc.getKey());
                json = json + "}";
            }
            json = json + "]";
            pm.close();
            response.getWriter().write(json);
        }
    }
	private String JsonPair(String name, String value) {
		return "\"" + name + "\":\"" + value + "\"";
	}

	private void Save(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		PersistenceManager pm = PMF.get().getPersistenceManager();
		String[] s = request.getParameterValues("modules[]");
		List<String> m = new ArrayList<String>();
		if (s != null) {
		    m = Arrays.asList(s);
		}
		String id = request.getParameter("id");
		try {
			if (id.isEmpty()) {
				UserDocument userDoc = new UserDocument(user.getEmail(), m);
				pm.makePersistent(userDoc);
				id = userDoc.getKey();
				response.getWriter().write(id);
			} else {
				UserDocument userDoc = pm.getObjectById(UserDocument.class, id);
				userDoc.setModules(m);
				response.getWriter().write(id);
			}
		} finally {
			pm.close();
		}
	}
	
	private void SaveDoc(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        PersistenceManager pm = PMF.get().getPersistenceManager();
        String name = request.getParameter("docName");
        String id = request.getParameter("id");
        try {
            if (id.isEmpty()) {
                Document doc = new Document(name, user.getEmail());
                pm.makePersistent(doc);
                String key = doc.getKey();
                response.getWriter().write(key);
            } else {
                Document doc = pm.getObjectById(Document.class, id);
                doc.setName(name);
                response.getWriter().write(id);
            }
        } finally {
            pm.close();
        }
    }
}
