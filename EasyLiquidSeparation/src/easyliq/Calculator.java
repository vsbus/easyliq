package easyliq;

abstract public class Calculator {
	private Equation[] equations;
	public Calculator(Equation[] equations) {
		this.equations = equations;
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
