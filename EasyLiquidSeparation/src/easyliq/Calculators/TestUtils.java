package easyliq.Calculators;

import static org.junit.Assert.fail;

import java.util.HashMap;
import java.util.Map.Entry;

import easyliq.CalculationParameters;
import easyliq.Parameter;

public class TestUtils {
	static public void TestEquation(HashMap<Parameter, Double> parameters,
			Equation equation) throws Exception {
		CalculationParameters expect = GetCalcParamsFromMap(parameters);
		String err = "";
		for (Parameter result : parameters.keySet()) {
			CalculationParameters calcParams = new CalculationParameters();
			for (Entry<Parameter, Double> p : parameters.entrySet()) {
				Parameter key = p.getKey();
				if (key == result) {
					calcParams.addUnknown(key);
				} else {
					calcParams.addKnown(key, p.getValue());
				}
			}
			equation.Calculate(calcParams);
			if (!calcParams.toString().equals(expect.toString())) {
				err = err + "\nexpect:\n  " + expect.toString() + "\n got:\n  "
						+ calcParams.toString() + "\n";
			}
		}
		if (err.length() > 0) {
			fail(err);
		}
	}

	static public CalculationParameters GetCalcParamsFromMap(HashMap<Parameter, Double> parameters) throws Exception {
		CalculationParameters expect = new CalculationParameters(); 
		for (Entry<Parameter, Double> p : parameters.entrySet()) {
			expect.addKnown(p.getKey(), p.getValue());
		}
		return expect;
	}

}
