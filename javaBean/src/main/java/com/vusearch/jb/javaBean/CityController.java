package com.vusearch.jb.javaBean;

import java.util.*;
import java.util.concurrent.TimeUnit;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.google.gson.*;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


import com.mashape.unirest.*;

import javax.servlet.http.HttpServletResponse;

@RestController
public class CityController {

    @Autowired
    CityRepository repository;

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");




    public HttpResponse <JsonNode> getCityTweetsFromAPI (String cityStr) {
        HttpResponse<JsonNode> res = null;
        try {
            res = Unirest.post("http://Buzzai-env-2.us-east-2.elasticbeanstalk.com/buzz10/internal")
                    .header("Content-Type", "application/x-www-form-urlencoded").field("placeName", cityStr)
                    .asJson();
        } catch (Exception e) {

        }
        return res;

    }

    // returning a list of supported city names.
    @RequestMapping("/getCityList")
    public @ResponseBody List<String> getCityLst() {
        System.out.println("Requested list of cities at " + dateTimeFormatter.format(LocalDateTime.now()));
        List<City> lst = repository.findAll();
        List<String> ret = new ArrayList<>();
        Iterator<City> it = lst.iterator();
        while(it.hasNext()) {
            ret.add(it.next().getName());
        }
        return ret;
    }

    @RequestMapping("/sanity")
    public String index() {
        return "I'm alive!";
    }

    // abt cron expression https://www.freeformatter.com/cron-expression-generator-quartz.html
    // 0 0 12 * * ?   for 12 PM every day
    // scheduled every day at what time? the time when the server starts
    @RequestMapping("/updateDB")
    @Scheduled(cron = "0 0 12 * * ?")
    public String updateDB() {
        this.updateDB(20);
        System.out.println("Updated tweets at " + dateTimeFormatter.format(LocalDateTime.now()));
        return "Success";
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

                    TimeUnit.SECONDS.sleep(20);
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

            // avoid duplicate
            Set<String> set = new HashSet<>();
            for (Tweet x : tl) {
                set.add(x.getName());
            }

            // linear search to find the correct city
            for (City tmp : newCities) {
                if (tmp.getName().equals(name)) newC = tmp;
            }

            // when network error and no newC, then we keep the origin city info of mongodb
            if (newC == null) {
                toBeUploaded.add(c);  // so we did nothing but just putting back
                continue;
            }

            for (Tweet t : newC.getTweetsLst()) {
                if (!set.contains(t.getName()))
                    c.getTweetsLst().add(t);
            }

            while (tl.size() > tweetLimit) tl.remove(0);  // if size > limit, remove first until limit
            toBeUploaded.add(c);
        }

        repository.deleteAll();
        for (City cc : toBeUploaded) {
            repository.save(cc);
            System.out.println("Saved to DB " + cc.getName());
        }


    }

    // call only when initial setup. necessary when the DB was reset. Never call it when the DB is living normally
    @RequestMapping("/init")
    public String oneTimeInitCityDB () {
        List<City> localCityList = CityListParser.getList();
        repository.deleteAll();
        for (City c : localCityList) {
            repository.save(c);
        }
        return "Success";
    }


    @RequestMapping("/getAccumlatedCityBuzz")
    public @ResponseBody ArrayList<Tweet> getAccumlatedCityBuzz(@RequestParam(value="city", defaultValue = "Tokyo") String cityName) {
        City c = repository.findByname(cityName);
        if (c != null) {
            System.out.println("Requested to get tweets for " + c.getName());
            List<Tweet> tmp = c.getTweetsLst();
            return (ArrayList)tmp;
        }

        return new ArrayList<>();
    }
}
