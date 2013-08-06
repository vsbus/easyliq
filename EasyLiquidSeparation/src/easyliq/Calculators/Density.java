package easyliq.Calculators;

import easyliq.CalculationParameters;
import easyliq.Parameter;

public class Density extends Calculator {

	public Density() {
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
			double rf = calcParams.get(Parameter.RHO_F);
			double rs = calcParams.get(Parameter.RHO_S);
			double ru = calcParams.get(Parameter.RHO_SUS);
			double cm = calcParams.get(Parameter.CM);
			switch (result) {
			case CM:
				calcParams.set(result, rs * (rf - ru) / (ru * (rf - rs)));
				return true;
			case RHO_F:
				calcParams.set(result, (cm - 1) * rs * ru / (cm * ru - rs));
				return true;
			case RHO_S:
				calcParams.set(result, cm * rf * ru / ((cm - 1) * ru + rf));
				return true;
			case RHO_SUS:
				calcParams.set(result, rf * rs / (cm * rf - cm * rs + rs));
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
			double rf = calcParams.get(Parameter.RHO_F);
			double rs = calcParams.get(Parameter.RHO_S);
			double ru = calcParams.get(Parameter.RHO_SUS);
			double cv = calcParams.get(Parameter.CV);
			switch (result) {
			case CV:
				calcParams.set(result, (rf - ru) / (rf - rs));
				return true;
			case RHO_F:
				calcParams.set(result, (cv * rs - ru) / (cv - 1));
				return true;
			case RHO_S:
				calcParams.set(result, ((cv - 1) * rf + ru) / cv);
				return true;
			case RHO_SUS:
				calcParams.set(result, -cv * rf + cv * rs + rf);
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
			double rf = calcParams.get(Parameter.RHO_F);
			double rs = calcParams.get(Parameter.RHO_S);
			double ru = calcParams.get(Parameter.RHO_SUS);
			double c = calcParams.get(Parameter.C);
			switch (result) {
			case C:
				calcParams.set(result, rs * (rf - ru) / (rf - rs));
				return true;
			case RHO_F:
				calcParams.set(result, rs * (c - ru) / (c - rs));
				return true;
			case RHO_S:
				calcParams.set(result, c * rf / (c + rf - ru));
				return true;
			case RHO_SUS:
				calcParams.set(result, -c * rf / rs + c + rf);
				return true;
			default:
				return false;
			}
		}
	}

}
