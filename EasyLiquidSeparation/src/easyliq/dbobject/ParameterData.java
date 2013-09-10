package easyliq.dbobject;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import easyliq.Parameter;

@PersistenceCapable
public class ParameterData {
    @Persistent
    private Parameter name;
    
    @Persistent
    private double value;

    public ParameterData(Parameter name, double value)
    {
        this.name = name;
        this.value = value;
    }
    
    public Parameter getName()
    {
        return name;
    }
    
    public double getValue()
    {
        return value;
    }    
}
