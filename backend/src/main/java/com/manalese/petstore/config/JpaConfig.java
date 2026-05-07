package com.manalese.petstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * JPA and Hibernate Configuration
 * 
 * Configures Hibernate dialect, batch processing, and entity scanning
 * for PostgreSQL 15+ database.
 */
@Configuration
@EntityScan("com.manalese.petstore.model")
@EnableJpaRepositories("com.manalese.petstore.repository")
public class JpaConfig {
    // Hibernate settings are configured via application.properties:
    // - Dialect: org.hibernate.dialect.PostgreSQLDialect
    // - Batch size: 20
    // - Order inserts: true
    // - Order updates: true
}
