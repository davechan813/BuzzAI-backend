package com.vusearch.jb.javaBean;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class City {
    @Id
    private ObjectId id;
    private String name;
    private List<Tweet> tweetsLst;

    public City(ObjectId id, String name, List<Tweet> tweetsLst) {
        this.id = id;
        this.name = name;
        this.tweetsLst = tweetsLst;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
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
