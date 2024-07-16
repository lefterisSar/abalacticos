package com.example.abalacticos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class AbalacticosApplication {

	public static void main(String[] args) {
		SpringApplication.run(AbalacticosApplication.class, args);
	}



}
