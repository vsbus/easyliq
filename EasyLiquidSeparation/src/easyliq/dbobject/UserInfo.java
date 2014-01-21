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
public class UserInfo {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

	@Persistent
	private String email;

	@Persistent
	private String activeDocKey;

	public UserInfo(String email, String activeDocKey) {
		this.email = email;
		this.activeDocKey = activeDocKey;
	}

	public String getKey() {
		return KeyFactory.keyToString(key);
	}

	public String getActiveDocKey() {
		return activeDocKey;
	}

	public void setActiveDocKey(String key) {
		activeDocKey = key;
	}

	public String getEmail() {
		return email;
	}

	public void getActiveDocKey(Key key) {
		activeDocKey = KeyFactory.keyToString(key);
	}
}
