package com.hms.VideoCallMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class VideoCallMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(VideoCallMsApplication.class, args);
	}

}
