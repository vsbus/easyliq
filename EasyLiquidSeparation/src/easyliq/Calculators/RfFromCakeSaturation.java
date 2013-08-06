package easyliq.Calculators;

import easyliq.CalculationParameters;
import easyliq.Parameter;

public class RfFromCakeSaturation extends Calculator {
	public RfFromCakeSaturation() {
		super(new Equation[] {});
	}

	static public class MoistureContentFromCakeSaturationEquation extends
			Equation {
		// rf * (1 - eps) * rhos = (1 - rf) * eps * rhol * s
		protected MoistureContentFromCakeSaturationEquation() {
			super(new Parameter[] { Parameter.RHO_L, Parameter.RHO_S,
					Parameter.EPS, Parameter.RF, Parameter.S });
		}

		@Override
		protected boolean Calculate(Parameter result,
				CalculationParameters calcParams) {
			double rhol = calcParams.get(Parameter.RHO_L);
			double rhos = calcParams.get(Parameter.RHO_S);
			double eps = calcParams.get(Parameter.EPS);
			double rf = calcParams.get(Parameter.RF);
			double s = calcParams.get(Parameter.S);
			switch (result) {
			case RHO_L:
				calcParams.set(result, rf * (eps - 1) * rhos
						/ ((rf - 1) * eps * s));
				return true;
			case RHO_S:
				calcParams.set(result, (rf - 1) * eps * rhol * s
						/ ((eps - 1) * rf));
				return true;
			case EPS:
				calcParams.set(result, -rf * rhos
						/ (-rf * rhos - rhol * s + rhol * s * rf));
				return true;
			case RF:
				calcParams.set(result, eps * rhol * s
						/ (rhos - rhos * eps + eps * rhol * s));
				return true;
			case S:
				calcParams.set(result, rf * (eps - 1) * rhos
						/ ((rf - 1) * eps * rhol));
				return true;
			default:
				return false;
			}
		}
	}

}
