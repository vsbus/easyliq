package easyliq.dbobject;

import java.util.List;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
public class Module {
    @Persistent
    private String name;
    
    @Persistent
    private List<ParameterData> data;
    
    public Module(String name, List<ParameterData> data)
    {
        this.name = name;
        this.data = data;
    }    
    
    public String getName()
    {
        return name;    
    }
    
    public List<ParameterData> getData()
    {
        return data;
    }
}
