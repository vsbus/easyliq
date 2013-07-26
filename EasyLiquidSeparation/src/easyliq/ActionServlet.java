package easyliq;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ActionServlet
 */

public class ActionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public ActionServlet() {
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) {
		if (request.getParameter("action") != null
				&& request.getParameter("action") != "calculate") {
			try {
				Calculate(request, response);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public enum CalculationOption {
		CALC_RHO_F, CALC_RHO_S, CALC_RHO_SUS, CALC_CMCVC;
	}

	private void Calculate(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		Parameter []parameters = new Parameter[] {
				Parameter.RHO_S,
				Parameter.RHO_F,
				Parameter.RHO_SUS,
				Parameter.CM,
				Parameter.CV,
				Parameter.C				
		};
		
		CalculationParameters calcParams = new CalculationParameters();
		for (Parameter p: parameters) {
			String parStr = request.getParameter(p.toString());
			if (parStr == null) {
				calcParams.addUnknown(p);
			} else {
				calcParams.addKnown(p, Double.parseDouble(parStr));
			}
		}
		new DensityCalculator().Calculate(calcParams);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String json = "{";
		boolean isFirst = true;
		for (Parameter p: parameters) {
			if (!isFirst) {
				json = json + ",";
			} else {
				isFirst = false;
			}
			json = json + "\"" + p.toString() + "\":\"" + calcParams.get(p) + "\""; 
		}
		json = json + "}";
		response.getWriter().write(json);
		response.getWriter().flush();
	}
}