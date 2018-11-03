package com.vusearch.jb.javaBean;

import java.util.*;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.vusearch.jb.javaBean.CityRepository;
import com.vusearch.jb.javaBean.City;
import com.vusearch.jb.javaBean.Tweet;

@RestController
public class CityController {

    @Autowired
    CityRepository repository;




    @RequestMapping("/save")
    public String index() {


        Tweet twt = new Tweet("Guo", "hhhh..", "", "hh", 1);

        List<Tweet> lst = new ArrayList<>();
        lst.add(twt);

        City myCity = new City(new ObjectId(), "Beijing",  lst);

        repository.save(myCity);
        return "Hello, world!";
    }

    public List<City> fetchCityFromDB() {
        // for every city and its tweets fetched from the nodejs API
        // need some http request library
        // return an arraylist of <City>, each city has a filled List<Tweet> from nodejs api

        return new ArrayList<City>();
    }

    public void updateDB(List<City> lst) {
        // fetch all Cities from mongodb
        // merge with lst. but the lst of each city has a limit, so kick some of tweets out of the list,
        // replace with new tweets from lst, then upload updated City objects to DB
    }
}
