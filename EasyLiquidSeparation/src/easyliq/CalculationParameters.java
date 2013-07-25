package easyliq;

import java.util.HashMap;
import java.util.HashSet;
import java.util.TreeMap;
import java.util.TreeSet;

public class CalculationParameters {
	private HashMap<Parameter, Double> known = new HashMap<Parameter, Double>();
	private HashSet<Parameter> unknown = new HashSet<Parameter>();

	public String toString() {
		return "known: {" + new TreeMap<Parameter, Double>(known).toString()
				+ "}, unknown: {" + new TreeSet<Parameter>(unknown).toString()
				+ "}";
	}

	public boolean needToCalculate(Parameter p) {
		return unknown.contains(p);
	}

	public double get(Parameter p) {
		if (!known.containsKey(p)) {
			return Double.NaN; // If parameter isn't in the known set then
								// return the default value.
		}
		return known.get(p);
	}

	public void set(Parameter p, double value) {
		unknown.remove(p);
		known.put(p, value);
	}

	public void addKnown(Parameter p, double value) throws Exception {
		if (unknown.contains(p)) {
			throw new Exception(
					"Impossible to add known parameter to CalculationParameters when it is already in unknown set.");
		}
		if (known.containsKey(p)) {
			throw new Exception(
					"CalculationParameters already contains added known parameter.");
		}
		known.put(p, value);
	}

	public void addUnknown(Parameter p) throws Exception {
		if (known.containsKey(p)) {
			throw new Exception(
					"Impossible to add unknown parameter to CalculationParameters when it is already in known set.");
		}
		if (unknown.contains(p)) {
			throw new Exception(
					"CalculationParameters already contains added unknown parameter.");
		}
		unknown.add(p);
	}
}
