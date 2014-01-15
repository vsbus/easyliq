package easyliq.dbobject;

import java.security.KeyFactory;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class DocumentLocation {

    @Persistent
    private String parentFolderKey ;
    @Persistent
    private String docKey;
    
    public DocumentLocation(String f, String d){
        this.parentFolderKey = f;
        this.docKey = d;
    } 
    
    public String getDocKey(){
        return this.docKey;
    }
    
    public String getParentFolderKey(){
        return this.parentFolderKey;
    }
    public void setParentFolderKey (String f){
        this.parentFolderKey = f;
    }
}
