package easyliq;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;

@PersistenceCapable
public class UserDocument {
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
