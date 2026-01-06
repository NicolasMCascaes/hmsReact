package com.hms.AppointmentsMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AppointmentsMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppointmentsMsApplication.class, args);
	}

}
