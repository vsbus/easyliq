package easyliq;

import java.util.HashSet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import easyliq.Calculators.Calculator;
import easyliq.Calculators.Density;
import easyliq.Calculators.RfFromCakeSaturation;

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

	private void Calculate(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Calculator calculator = CreateCalculator(request.getParameter("calculator"));
		HashSet<Parameter> parameters = calculator.getParametersSet();
		CalculationParameters calcParams = new CalculationParameters();
		for (Parameter p: parameters) {
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

	private Calculator CreateCalculator(String calculator) {
		switch (calculator) {
		case "Density":
			return new Density();
		case "RfFromCakeSaturation":
			return new RfFromCakeSaturation();
		}
		return null;
	}
}
