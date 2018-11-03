package com.vusearch.jb.javaBean;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.vusearch.jb.javaBean.City;

public interface CityRepository extends MongoRepository<City, String> {
    City findBy_id(ObjectId _id);
}
