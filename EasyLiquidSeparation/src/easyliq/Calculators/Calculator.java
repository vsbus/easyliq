package easyliq.Calculators;

import java.util.HashSet;

import easyliq.CalculationParameters;
import easyliq.Parameter;

abstract public class Calculator {
	private Equation[] equations;
	public Calculator(Equation[] equations) {
		this.equations = equations;
	}
	
	public HashSet<Parameter> getParametersSet() {
		HashSet<Parameter> res = new HashSet<Parameter>();
		for (Equation e: equations) {
			for (Parameter p: e.getParametersSet()) {
				res.add(p);
			}
		}
		return res;
	}
	
	public void Calculate(CalculationParameters calcParams) {
		boolean calculated;
		do {
			calculated = false;
			for (Equation e: equations) {
				if (e.Calculate(calcParams)) {
					calculated = true;
				}
			}
		} while (calculated);
	}
}
