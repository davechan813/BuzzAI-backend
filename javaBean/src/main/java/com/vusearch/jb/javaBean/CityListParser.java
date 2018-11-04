package com.vusearch.jb.javaBean;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.*;

public class CityListParser {
    public static List<City> getList() {
        List <City> res = new ArrayList<>();
        Resource resource = new ClassPathResource("static/cities.big");
        try {
            InputStream stream = resource.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(stream));
            String line;
            while ((line = in.readLine()) != null) {
                City city = new City(new ObjectId(), line, new ArrayList<Tweet>());
                res.add(city);
            }
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return res;

    }
}
