package easyliq.Calculators;

import static org.junit.Assert.*;

import java.util.*;
import java.util.Map.Entry;
import org.junit.Test;
import easyliq.CalculationParameters;
import easyliq.Parameter;
import easyliq.Calculators.DensityCalculator.*;

public class DensityCalculatorTest {

	@Test
	public void testDensityCalculator() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.CM, 0.3);
		parameters.put(Parameter.CV, 0.16);
		parameters.put(Parameter.C, 360.0);

		Parameter tests[][] = new Parameter[][] {
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
						Parameter.RHO_SUS },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
						Parameter.CM },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_S,
						Parameter.CV },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_S, Parameter.C },
				new Parameter[] { Parameter.RHO_S, Parameter.RHO_SUS,
						Parameter.CM },
				new Parameter[] { Parameter.RHO_S, Parameter.RHO_SUS,
						Parameter.CV },
				new Parameter[] { Parameter.RHO_S, Parameter.RHO_SUS,
						Parameter.C },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_SUS,
						Parameter.CM },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_SUS,
						Parameter.CV },
				new Parameter[] { Parameter.RHO_F, Parameter.RHO_SUS,
						Parameter.C }, };

		CalculationParameters expect = TestUtils
				.GetCalcParamsFromMap(parameters);

		String err = "";
		for (Parameter[] inputs : tests) {
			CalculationParameters calcParams = new CalculationParameters();
			for (Entry<Parameter, Double> p : parameters.entrySet()) {
				Parameter key = p.getKey();
				if (Arrays.asList(inputs).contains(key)) {
					calcParams.addKnown(key, p.getValue());
				} else {
					calcParams.addUnknown(key);
				}
			}
			String before = calcParams.toString();
			new DensityCalculator().Calculate(calcParams);
			if (!calcParams.toString().equals(expect.toString())) {
				err = err + "\nbefore:\n    " + before + "\nexpect:\n    "
						+ expect.toString() + "\ngot:\n    "
						+ calcParams.toString() + "\n";
			}
		}
		if (err.length() > 0) {
			fail(err);
		}
	}

	@Test
	public void testCmRhoEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.CM, 0.3);

		TestUtils.TestEquation(parameters, new CmRhoEquation());
	}

	@Test
	public void testCvRhoEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.CV, 0.16);

		TestUtils.TestEquation(parameters, new CvRhoEquation());
	}

	@Test
	public void testCRhoEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.C, 360.0);

		TestUtils.TestEquation(parameters, new CRhoEquation());
	}
}
