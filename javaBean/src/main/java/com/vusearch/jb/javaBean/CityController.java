package com.vusearch.jb.javaBean;

import java.util.*;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.sun.prism.shader.Solid_ImagePattern_Loader;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.google.gson.*;
import com.vusearch.jb.javaBean.CityRepository;
import com.vusearch.jb.javaBean.City;
import com.vusearch.jb.javaBean.Tweet;
import com.mashape.unirest.*;

@RestController
public class CityController {

    @Autowired
    CityRepository repository;



    public HttpResponse <JsonNode> getCityTweetsFromAPI (String cityStr) {
        HttpResponse<JsonNode> res = null;
        try {
            res = Unirest.post("http://Buzzai-env-2.us-east-2.elasticbeanstalk.com/buzz10")
                    .header("Content-Type", "application/x-www-form-urlencoded").field("placeName", cityStr)
                    .asJson();
        } catch (Exception e) {

        }
        return res;

    }

    @RequestMapping("/save")
    public String index() {


        Tweet twt = new Tweet("Guo", "hhhh..", "", "hh", 1);

        List<Tweet> lst = new ArrayList<>();
        lst.add(twt);

        City myCity = new City(new ObjectId(), "Beijing",  lst);

        repository.save(myCity);
        return "Hello, world!";
    }

    @RequestMapping("/test")
    public String tests() {
        List<String> cityList = new ArrayList<>();
        cityList.add("New York");
        cityList.add("Tokyo");

        List<City> lst = this.fetchCityFromDB(cityList);

        
        return "hello";
    }

    public List<City> fetchCityFromDB(List<String> cityList) {
        // for every city and its tweets fetched from the nodejs API
        // need some http request library
        // return an arraylist of <City>, each city has a filled List<Tweet> from nodejs api

        List<City> lst = new ArrayList<>();

        for (String s : cityList) {
            HttpResponse<JsonNode> response = this.getCityTweetsFromAPI(s);
            if (response != null) {
                String jsonStr = response.getBody().toString();
                jsonStr = jsonStr.substring(1, jsonStr.length() - 1);
                JsonElement jsonElement = new JsonParser().parse(jsonStr);
                JsonObject jsonObject = jsonElement.getAsJsonObject();

                JsonArray trends = jsonObject.getAsJsonArray("trends");

                Iterator<JsonElement> it = trends.iterator();
                List<Tweet> twtLst = new ArrayList<>();
                while(it.hasNext()) {
                    JsonObject jo = it.next().getAsJsonObject();
                    String name = jo.get("name").isJsonNull() ? "" : jo.get("name").getAsString();
                    String url = jo.get("url").isJsonNull() ? "" : jo.get("url").getAsString();
                    String promoted_content = jo.get("promoted_content").isJsonNull() ? "" : jo.get("promoted_content").getAsString();
                    String query = jo.get("query").isJsonNull() ? "" : jo.get("query").getAsString();
                    int tweet_volume = jo.get("tweet_volume").isJsonNull() ? 0 : jo.get("tweet_volume").getAsInt();
                    Tweet twt = new Tweet(name, url, promoted_content, query, tweet_volume);
                    twtLst.add(twt);
                }

                City myCity = new City(new ObjectId(), s, twtLst);
                lst.add(myCity);
            } else {
                continue;
            }

        }


        return lst;
    }

    public void updateDB(List<City> lst) {
        // fetch all Cities from mongodb
        // merge with lst. but the lst of each city has a limit, so kick some of tweets out of the list,
        // replace with new tweets from lst, then upload updated City objects to DB
    }
}
