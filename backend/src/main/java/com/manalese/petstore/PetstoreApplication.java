package com.manalese.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PetStore API - Spring Boot Application Entry Point
 * 
 * Enables component scanning, auto-configuration, and property file support
 * for the PetStore backend REST API.
 */
@SpringBootApplication
public class PetstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetstoreApplication.class, args);
    }
}
