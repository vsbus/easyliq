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
    private User author;
    
    @Persistent
    private Date date;
    
    @Persistent
    private Module content;
    
    public UserDocument(User author, Module content, Date date) {
        this.author = author;
        this.content = content;
        this.date = date;
    }
    
    public long getKey() {
        return key.getId();
    }

    public User getAuthor() {
        return author;
    }

    public Module getContent() {
        return content;
    }

    public Date getDate() {
        return date;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public void setContent(Module content) {
        this.content = content;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    
}
