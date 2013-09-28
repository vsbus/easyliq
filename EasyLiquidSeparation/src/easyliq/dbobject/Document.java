package easyliq.dbobject;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class Document {
    
    /* if it says that class "DocumentTest" is not persistable. blah blah blah", it is an issue of DataNucleus Enhancer.
     * To solve this problem open an entity classes and change something (add a space or something) and save.
     */
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
    
    @Persistent
    private String authorEmail;
    
    @Persistent
    private String name;
        
    public Document(String name, String authorEmail) {
        this.authorEmail = authorEmail;
        this.name = name;
    }
    
    public long getId() {
        return key.getId();
    }
    
    public Key getKey() {
        return key;
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
}
