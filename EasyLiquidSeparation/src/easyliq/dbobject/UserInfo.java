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
	private String settingsJson;

	public UserInfo(String email, String settingsJson) {
		this.email = email;
		this.settingsJson = settingsJson;
	}

	public String getKey() {
		return KeyFactory.keyToString(key);
	}

	public String getSettingsJson() {
		return settingsJson;
	}

	public void setSettingsJson(String settingsJson) {
		this.settingsJson = settingsJson;
	}

	public String getEmail() {
		return email;
	}
}
