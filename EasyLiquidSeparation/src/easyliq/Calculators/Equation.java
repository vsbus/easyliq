package easyliq.Calculators;

import java.util.HashSet;

import easyliq.CalculationParameters;
import easyliq.Parameter;

public abstract class Equation {
	private Parameter[] parameters;

	protected Equation(Parameter[] parameters) {
		this.parameters = parameters;
	}
	
	public HashSet<Parameter> getParametersSet() {
		HashSet<Parameter> res = new HashSet<Parameter>();
		for (Parameter p: parameters) {
			res.add(p);
		}
		return res;
	}

	public boolean Calculate(CalculationParameters calcParams) {
		Parameter result = null;
		for (Parameter p : parameters) {
			if (p == result) { // Sometimes m_parameters may have duplications.
				continue; // For example in product equations like x * x = a
			}
			if (calcParams.needToCalculate(p)) {
				if (result == null) {
					result = p;
				} else {
					return false;
				}
			}
		}
		if (result == null) {
			return false;
		}
		return Calculate(result, calcParams);
	}

	protected abstract boolean Calculate(Parameter result,
			CalculationParameters calcParams);
}
