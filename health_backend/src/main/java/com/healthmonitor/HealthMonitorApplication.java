package com.healthmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HealthMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthMonitorApplication.class, args);
        System.out.println("\n==================================================");
        System.out.println("🚀 AI Smart Health Monitor Spring Boot Backend Ready!");
        System.out.println("📍 Server URL : http://localhost:8080");
        System.out.println("💾 Database   : H2 Embedded Engine (http://localhost:8080/h2-console)");
        System.out.println("📡 SSE Stream : http://localhost:8080/api/readings/stream");
        System.out.println("==================================================\n");
    }
}
