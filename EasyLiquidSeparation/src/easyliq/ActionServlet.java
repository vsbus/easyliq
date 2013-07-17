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

	private void Calculate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		double Cm = Double.parseDouble(request.getParameter("Cm"));
		double rho_s = Double.parseDouble(request.getParameter("rho_s"));
		double rho_f = Double.parseDouble(request.getParameter("rho_f"));
		double rho_sus = Double.parseDouble(request.getParameter("rho_sus"));
		double Cv = Double.parseDouble(request.getParameter("Cv"));
		double C = Double.parseDouble(request.getParameter("C"));
		String selectedGroup = request.getParameter("selectedGroup");
		String input = request.getParameter("input");
		Boolean isInList = Boolean.parseBoolean(request
				.getParameter("isInList"));
		if ("ssmf".equals(selectedGroup)) {
			Cm = rho_s * (rho_f - rho_sus) / rho_sus / (rho_f - rho_s);
			Cv = (rho_f - rho_sus) / (rho_f - rho_s);
			C = rho_s * (rho_f - rho_sus) / (rho_f - rho_s);
		} else {
			if (isInList) {
				if (input.equals("Cv") && "rho_f".equals(selectedGroup)) {
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
					Cm = rho_s * Cv / rho_sus;
					C = Cv * rho_s;
				}
				if (input.equals("Cv") && "rho_s".equals(selectedGroup)) {
					rho_s = (Cv * rho_f + rho_sus - rho_f) / Cv;
					Cm = rho_s * Cv / rho_sus;
					C = Cv * rho_s;
				}
				if (input.equals("Cv") && "rho_sus".equals(selectedGroup)) {
					rho_sus = rho_f - Cv * (rho_f - rho_s);
					C = Cv * rho_s;
					Cm = C / rho_sus;
				}
				// cm
				if (input.equals("Cm") && "rho_f".equals(selectedGroup)) {
					C = Cm * rho_sus;
					Cv = C / rho_s;
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if (input.equals("Cm") && "rho_s".equals(selectedGroup)) {
					C = Cm * rho_sus;
					rho_s = C * rho_f / (C + rho_f - rho_sus);
					Cv = C / rho_s;
				}
				if (input.equals("Cm") && "rho_sus".equals(selectedGroup)) {
					rho_sus = rho_s * rho_f /
							(Cm * (rho_f - rho_s) + rho_s);
					C = Cm * rho_sus;
					Cv = C / rho_s;
				}
				// c
				if (input.equals("C") && "rho_f".equals(selectedGroup)) {
					Cv = C / rho_s;
					Cm = C / rho_sus;
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if (input.equals("C") && "rho_s".equals(selectedGroup)) {
					Cm = C / rho_sus;
					rho_s = C * rho_f / (C + rho_f - rho_sus);
					Cv = C / rho_s;
				}
				if (input.equals("C") && "rho_sus".equals(selectedGroup)) {
					Cv = C / rho_s;
					rho_sus = rho_f - Cv * (rho_f - rho_s);
					Cm = C / rho_sus;
				}
			} else {
				if ("rho_f".equals(selectedGroup)) {
					rho_f = (Cv * rho_s - rho_sus) / (Cv - 1);
				}
				if ("rho_s".equals(selectedGroup)) {
					rho_s = (Cv * rho_f + rho_sus - rho_f) / Cv;
				}
				if ("rho_sus".equals(selectedGroup)) {
					rho_sus = rho_f - Cv * (rho_f - rho_s);
				}
			}
		}
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String json = "{\"Cm\":\"" + Cm + "\", \"rho_s\":\"" + rho_s
				+ "\", \"rho_f\":\"" + rho_f + "\", \"rho_sus\":\"" + rho_sus
				+ "\", \"Cv\":\"" + Cv + "\", \"C\":\"" + C + "\"}";
		response.getWriter().write(json);
		response.getWriter().flush();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

	}

}