package easyliq;

import static org.junit.Assert.*;

import java.util.*;
import java.util.Map.Entry;

import org.junit.Test;

import easyliq.DensityCalculator.*;

public class TestDensityCalculator {

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

		CalculationParameters expect = GetCalcParamsFromMap(parameters);

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

		TestEquation(parameters, new CmRhoEquation());
	}
	
	@Test
	public void testCvRhoEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.CV, 0.16);	
		
		TestEquation(parameters, new CvRhoEquation());
	}
	
	@Test
	public void testCRhoEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_F, 1000.0);
		parameters.put(Parameter.RHO_S, 2250.0);
		parameters.put(Parameter.RHO_SUS, 1200.0);
		parameters.put(Parameter.C, 360.0);
		
		TestEquation(parameters, new CRhoEquation());
		
	}

	private void TestEquation(HashMap<Parameter, Double> parameters,
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

	private CalculationParameters GetCalcParamsFromMap(HashMap<Parameter, Double> parameters) throws Exception {
		CalculationParameters expect = new CalculationParameters(); 
		for (Entry<Parameter, Double> p : parameters.entrySet()) {
			expect.addKnown(p.getKey(), p.getValue());
		}
		return expect;
	}
	
}
