package easyliq;

import java.io.IOException;

import javax.servlet.ServletException;
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
			HttpServletResponse response) throws ServletException, IOException {
		if (request.getParameter("action") != null
				&& request.getParameter("action") != "calculate") {
			Calculate(request, response);
		}
	}

	public enum Parameter {
		RHO_F, RHO_S, RHO_SUS, CM, CV, C;
	}

	public enum CalculationOption {
		CALC_RHO_F, CALC_RHO_S, CALC_RHO_SUS, CALC_CMCVC;
	}

	private double parameterValue(HttpServletRequest r, Parameter p) {
		return Double.parseDouble(r.getParameter(p.toString()));
	}

	private void Calculate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		double rho_s = parameterValue(request, Parameter.RHO_S);
		double rho_f = parameterValue(request, Parameter.RHO_F);
		double rho_sus = parameterValue(request, Parameter.RHO_SUS);
		double Cm = parameterValue(request, Parameter.CM);
		double Cv = parameterValue(request, Parameter.CV);
		double C = parameterValue(request, Parameter.C);

		CalculationOption option = CalculationOption.valueOf(request
				.getParameter("selectedGroup"));
		Parameter input = Parameter.valueOf(request.getParameter("input"));

		Boolean isInList = Boolean.parseBoolean(request
				.getParameter("isInList"));

		if (option == CalculationOption.CALC_CMCVC) {
			Cm = rho_s * (rho_f - rho_sus) / rho_sus / (rho_f - rho_s);
			Cv = (rho_f - rho_sus) / (rho_f - rho_s);
			C = rho_s * (rho_f - rho_sus) / (rho_f - rho_s);
		} else {
			boolean calc_rho_f = option == CalculationOption.CALC_RHO_F;
			boolean calc_rho_s = option == CalculationOption.CALC_RHO_S;
			boolean calc_rho_sus = option == CalculationOption.CALC_RHO_SUS;

			if (isInList) {
				if (input == Parameter.CV && calc_rho_f) {
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
					Cm = rho_s * Cv / rho_sus;
					C = Cv * rho_s;
				}
				if (input == Parameter.CV && calc_rho_s) {
					rho_s = (Cv * rho_f + rho_sus - rho_f) / Cv;
					Cm = rho_s * Cv / rho_sus;
					C = Cv * rho_s;
				}
				if (input == Parameter.CV && calc_rho_sus) {
					rho_sus = rho_f - Cv * (rho_f - rho_s);
					C = Cv * rho_s;
					Cm = C / rho_sus;
				}
				// cm
				if (input == Parameter.CM && calc_rho_f) {
					C = Cm * rho_sus;
					Cv = C / rho_s;
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if (input == Parameter.CM && calc_rho_s) {
					C = Cm * rho_sus;
					rho_s = C * rho_f / (C + rho_f - rho_sus);
					Cv = C / rho_s;
				}
				if (input == Parameter.CM && calc_rho_sus) {
					rho_sus = rho_s * rho_f / (Cm * (rho_f - rho_s) + rho_s);
					C = Cm * rho_sus;
					Cv = C / rho_s;
				}
				// c
				if (input == Parameter.C && calc_rho_f) {
					Cv = C / rho_s;
					Cm = C / rho_sus;
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if (input == Parameter.C && calc_rho_s) {
					Cm = C / rho_sus;
					rho_s = C * rho_f / (C + rho_f - rho_sus);
					Cv = C / rho_s;
				}
				if (input == Parameter.C && calc_rho_sus) {
					Cv = C / rho_s;
					rho_sus = rho_f - Cv * (rho_f - rho_s);
					Cm = C / rho_sus;
				}
			} else {
				if (calc_rho_f) {
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if (calc_rho_s) {
					rho_s = (Cv * rho_f + rho_sus - rho_f) / Cv;
				}
				if (calc_rho_sus) {
					rho_sus = rho_f - Cv * (rho_f - rho_s);
				}
			}
		}

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String json = "{" + "\"rho_s\":\"" + rho_s + "\", " + "\"rho_f\":\""
				+ rho_f + "\", " + "\"rho_sus\":\"" + rho_sus + "\", "
				+ "\"Cm\":\"" + Cm + "\", " + "\"Cv\":\"" + Cv + "\", "
				+ "\"C\":\"" + C + "\"" + "}";
		response.getWriter().write(json);
		response.getWriter().flush();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

	}

}