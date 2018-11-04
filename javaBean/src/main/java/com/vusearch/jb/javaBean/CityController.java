package com.vusearch.jb.javaBean;

import java.util.*;
import java.util.concurrent.TimeUnit;

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


        this.updateDB(5);

        return "hello";
    }

    public List<City> fetchCityFromAPI(List<String> cityList) {
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
                JsonObject jsonObject = null;
                try {
                     jsonObject = jsonElement.getAsJsonObject();
                } catch (Exception e) {
                    System.out.println("!!!CIty is " + s);
                    continue;
                }
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
                System.out.println("Successfully added " + s);
                try {

                    TimeUnit.SECONDS.sleep(2);
                } catch (Exception e) {
                    continue;
                }

            } else {
                continue;
            }

        }


        return lst;
    }

    public void updateDB(int tweetLimit) {
        // fetch all Cities from mongodb
        // merge with lst. but the lst of each city has a limit, so kick some of tweets out of the list,
        // replace with new tweets from lst, then upload updated City objects to DB
        List<City> onlineCityLst = repository.findAll();

        List<City> localCityList = CityListParser.getList();

        List<String> cityNameList = new ArrayList<>();

        List<City> toBeUploaded = new ArrayList<>();

        for (City c : localCityList) {
            cityNameList.add(c.getName());
        }

        // here we assume every city from onlineCitylst there will be a match for it from localCitylst


        // for each city from onlinecity list, modify its tweets list field.

        List<City> newCities = this.fetchCityFromAPI(cityNameList);  // cities from API

        for (City c : onlineCityLst) {
            List<Tweet> tl = c.getTweetsLst();
            // add new tweet to tl
            String name = c.getName();
            City newC = null;

            // linear search to find the correct city
            for (City tmp : newCities) {
                if (tmp.getName() == name) newC = tmp;
            }

            // when network error and no newC, then we keep the origin city info of mongodb
            if (newC == null) {
                toBeUploaded.add(c);  // so we did nothing but just putting back
                continue;
            }

            for (Tweet t : newC.getTweetsLst()) {
                c.getTweetsLst().add(t);
            }

            while (tl.size() > tweetLimit) tl.remove(0);  // if size > limit, remove first until
            toBeUploaded.add(c);
        }



        System.out.println(toBeUploaded.size());


    }

    @RequestMapping("/init")
    public String oneTimeInitCityDB () {
        List<City> localCityList = CityListParser.getList();
        for (City c : localCityList) {
            repository.save(c);
        }
        return "Success";
    }
}
