package com.vusearch.jb.javaBean;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@EnableScheduling
@SpringBootApplication
public class JavaBeanApplication {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static void main(String[] args) {
		System.out.println("Server started -- VuSearch. It's " + dateTimeFormatter.format(LocalDateTime.now()));
	    SpringApplication.run(JavaBeanApplication.class, args);
	}
}
