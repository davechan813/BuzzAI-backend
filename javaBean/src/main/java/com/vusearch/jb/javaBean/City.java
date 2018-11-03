package com.vusearch.jb.javaBean;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import com.vusearch.jb.javaBean.Tweet;

public class City {
    @Id
    private ObjectId _id;
    private String name;
    private List<Tweet> tweetsLst;

    public City(ObjectId id, String name, List<Tweet> tweetsLst) {
        this._id = id;
        this.name = name;
        this.tweetsLst = tweetsLst;
    }

    public ObjectId getId() {
        return _id;
    }

    public void setId(ObjectId id) {
        this._id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Tweet> getTweetsLst() {
        return tweetsLst;
    }

    public void setTweetsLst(List<Tweet> tweetsLst) {
        this.tweetsLst = tweetsLst;
    }
}
