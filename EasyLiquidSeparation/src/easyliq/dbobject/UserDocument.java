package easyliq.dbobject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class UserDocument {
    
    /* if it says that class "DocumentTest" is not persistable. blah blah blah", it is an issue of DataNucleus Enhancer.
     * To solve this problem open an entity classes and change something (add a space or something) and save.
     */
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key; 
    
    @Persistent
    private String authorEmail;
    
    @Persistent
    private Date creationDate;
    
    @Persistent
    private List<String> modules;
    
    @Persistent
    private String comments;
    
    @Persistent
    private String name;
        
    public UserDocument(String name, String authorEmail, List<String> modules, String comments) {
        this.authorEmail = authorEmail;
        this.name = name;
        this.modules = modules;
        this.creationDate = new Date();
        this.comments = comments;
    }
    
    public String getKey() {
        return KeyFactory.keyToString(key);
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public String getName() {
        return name;
    }

    public void setAuthorEmail(String email) {
        this.authorEmail = email;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public List<String> getModules() {
        return modules;
    }
    
    public void setModules(List<String> modules) {
        this.modules = new ArrayList<String>(modules);
    }    
    
    public void setCreationDate(Date date) {
        this.creationDate = date;
    }
    
    public Date getCreationDate() {
        return this.creationDate;
    }
    
    public String getComments() {
    	return this.comments == null ? "" : this.comments;
    }
    
    public void setComments(String comments) {
    	this.comments = comments;
    }
}
