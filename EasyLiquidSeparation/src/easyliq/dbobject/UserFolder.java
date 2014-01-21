package easyliq.dbobject;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class UserFolder {
    
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
    
    @Persistent    
    private String name;
    
    @Persistent    
    private String authorEmail;
    
    @Persistent    
    private String comment;
    
    @Persistent
    private Date creationDate;    
   
    public UserFolder (String name, String email) {
        this.name = name;        
        this.creationDate = new Date();
        this.authorEmail = email;
    }
    
    public String getName() {
        return this.name;
    }
    
    public Date getCreationDate(){
        return this.creationDate;
    }

    public String getKey() {
        return KeyFactory.keyToString(key);
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public void setAuthorEmail(String email) {
        this.authorEmail = email;
    }
    public String getAuthorEmail() {
        return this.authorEmail;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    public String getComment() {
        return this.comment;
    }
}
