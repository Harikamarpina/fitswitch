package com.techtammina.fitSwitch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FitSwitchBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FitSwitchBackendApplication.class, args);
	}

}
