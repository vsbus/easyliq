package easyliq.dbobject;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class UserDocument {
    
    /* if it says that class "UserDocument" is not persistable. blah blah blah", it is an issue of DataNucleus Enhancer.
     * To solve this problem open an entity classes and change something (add a space or something) and save.
     */
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
    
    @Persistent
    private String authorEmail;
    
    @Persistent
    private List<String> modules;
        
    public UserDocument(String authorEmail, List<String> modules) {
        this.authorEmail = authorEmail;
        this.modules = modules;
    }
    
    public String getKey() {
        return KeyFactory.keyToString(key);
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public List<String> getModules() {
        return modules;
    }

    public void setAuthorEmail(String email) {
        this.authorEmail = email;
    }
    
    public void setModules(List<String> modules) {
        this.modules = new ArrayList<String>(modules);
    }    
}
