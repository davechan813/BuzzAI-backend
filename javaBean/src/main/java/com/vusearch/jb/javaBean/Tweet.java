package com.vusearch.jb.javaBean;

public class Tweet {
    private String name, url, promoted_content, query;
    private int tweet_volume;

    public Tweet(String name, String url, String promoted_content, String query, int tweet_volume) {
        this.name = name;
        this.url = url;
        this.promoted_content = promoted_content;
        this.query = query;
        this.tweet_volume = tweet_volume;
    }
}
