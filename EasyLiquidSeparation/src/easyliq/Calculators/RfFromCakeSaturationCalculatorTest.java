package easyliq.Calculators;

import java.util.HashMap;
import org.junit.Test;
import easyliq.Parameter;
import easyliq.Calculators.RfFromCakeSaturationCalculator.*;

public class RfFromCakeSaturationCalculatorTest {

	@Test
	public void testMoistureContentFromCakeSaturationEquation() throws Exception {
		HashMap<Parameter, Double> parameters = new HashMap<Parameter, Double>();
		parameters.put(Parameter.RHO_L, 1000.0);
		parameters.put(Parameter.RHO_S, 3000.0);
		parameters.put(Parameter.EPS, 0.50);
		parameters.put(Parameter.S, 1.0);
		parameters.put(Parameter.RF, 0.25);
		TestUtils.TestEquation(parameters, new MoistureContentFromCakeSaturationEquation());
	}
}
