package easyliq.dbobject;

import java.security.KeyFactory;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class FolderDocument {

    @Persistent
    private String folderKey ;
    @Persistent
    private String docKey;
    
    public FolderDocument(String f, String d){
        this.folderKey = f;
        this.docKey = d;
    } 
    
    public String getDocKey(){
        return this.docKey;
    }
    
    public String getFolderKey(){
        return this.folderKey;
    }
    public void setFolderKey (String f){
        this.folderKey = f;
    }
}
