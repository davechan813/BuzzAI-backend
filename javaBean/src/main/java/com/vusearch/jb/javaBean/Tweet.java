package com.vusearch.jb.javaBean;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
@Document
public class Tweet implements Serializable {
    private String name, url, promoted_content, query;
    private int tweet_volume;

    public Tweet(String name, String url, String promoted_content, String query, int tweet_volume) {
        this.name = name;
        this.url = url;
        this.promoted_content = promoted_content;
        this.query = query;
        this.tweet_volume = tweet_volume;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPromoted_content() {
        return promoted_content;
    }

    public void setPromoted_content(String promoted_content) {
        this.promoted_content = promoted_content;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getTweet_volume() {
        return tweet_volume;
    }

    public void setTweet_volume(int tweet_volume) {
        this.tweet_volume = tweet_volume;
    }
}
