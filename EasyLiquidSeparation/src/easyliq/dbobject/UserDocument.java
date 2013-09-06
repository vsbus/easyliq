package easyliq.dbobject;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;

@PersistenceCapable
public class UserDocument {
    
    /* if it sais that class "UserDocument" is not persistable. blah blah blah", it is an issue of DataNucleus Enhancer.
     * To solve this problem open an entity classes and change something (add a space or something) and save.
     */
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
    
    @Persistent
    private String authorEmail;
    
    @Persistent
    private Date date;
    
    @Persistent
    private Module content;
    
    @Persistent
    private int position;
    
    public UserDocument(String authorEmail, Module content, Date date, int position) {
        this.authorEmail = authorEmail;
        this.content = content;
        this.date = date;
        this.position = position;
    }
    
    public long getKey() {
        return key.getId();
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public Module getContent() {
        return content;
    }

    public int getPosition() {
        return position;
    }
    
    public Date getDate() {
        return date;
    }

    public void setAuthorEmail(String email) {
        this.authorEmail = email;
    }
    
    public void setPosition(int position) {
        this.position = position;
    }

    public void setContent(Module content) {
        this.content = content;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    
}
