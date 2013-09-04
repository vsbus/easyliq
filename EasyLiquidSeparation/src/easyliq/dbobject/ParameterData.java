package easyliq.dbobject;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
public class ParameterData {
    @Persistent
    private String name;
    
    @Persistent
    private double value;
   
    public ParameterData(String name, double value)
    {
        this.name = name;
        this.value = value;
    }
    
    public String getName()
    {
        return name;
    }
    
    public double getValue()
    {
        return value;
    }    
}
