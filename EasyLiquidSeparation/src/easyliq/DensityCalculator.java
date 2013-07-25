package easyliq;

public class DensityCalculator extends Calculator {

	public DensityCalculator() {
		super(new Equation[] { new CmRhoEquation(), new CvRhoEquation(),
				new CRhoEquation() });
	}

	static public class CmRhoEquation extends Equation {
		protected CmRhoEquation() {
			super(new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
					Parameter.RHO_SUS, Parameter.CM });
		}

		@Override
		protected boolean Calculate(Parameter result,
				CalculationParameters calcParams) {
			double f = calcParams.get(Parameter.RHO_F);
			double s = calcParams.get(Parameter.RHO_S);
			double u = calcParams.get(Parameter.RHO_SUS);
			double c = calcParams.get(Parameter.CM);
			switch (result) {
			case CM:
				calcParams.set(result, s * (f - u) / (u * (f - s)));
				return true;
			case RHO_F:
				calcParams.set(result, (c - 1) * s * u / (c * u - s));
				return true;
			case RHO_S:
				calcParams.set(result, c * f * u / ((c - 1) * u + f));
				return true;
			case RHO_SUS:
				calcParams.set(result, f * s / (c * f - c * s + s));
				return true;
			default:
				return false;
			}
		}
	}

	static public class CvRhoEquation extends Equation {
		protected CvRhoEquation() {
			super(new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
					Parameter.RHO_SUS, Parameter.CV });
		}

		@Override
		protected boolean Calculate(Parameter result,
				CalculationParameters calcParams) {
			double f = calcParams.get(Parameter.RHO_F);
			double s = calcParams.get(Parameter.RHO_S);
			double u = calcParams.get(Parameter.RHO_SUS);
			double c = calcParams.get(Parameter.CV);
			switch (result) {
			case CV:
				calcParams.set(result, (f - u) / (f - s));
				return true;
			case RHO_F:
				calcParams.set(result, (c * s - u) / (c - 1));
				return true;
			case RHO_S:
				calcParams.set(result, ((c - 1) * f + u) / c);
				return true;
			case RHO_SUS:
				calcParams.set(result, -c * f + c * s + f);
				return true;
			default:
				return false;
			}
		}
	}

	static public class CRhoEquation extends Equation {
		protected CRhoEquation() {
			super(new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
					Parameter.RHO_SUS, Parameter.C });
		}

		@Override
		protected boolean Calculate(Parameter result,
				CalculationParameters calcParams) {
			double f = calcParams.get(Parameter.RHO_F);
			double s = calcParams.get(Parameter.RHO_S);
			double u = calcParams.get(Parameter.RHO_SUS);
			double c = calcParams.get(Parameter.C);
			switch (result) {
			case C:
				calcParams.set(result, s * (f - u) / (f - s));
				return true;
			case RHO_F:
				calcParams.set(result, s * (c - u) / (c - s));
				return true;
			case RHO_S:
				calcParams.set(result, c * f / (c + f - u));
				return true;
			case RHO_SUS:
				calcParams.set(result, -c * f / s + c + f);
				return true;
			default:
				return false;
			}
		}
	}

}
