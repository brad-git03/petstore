package com.manalese.petstore.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;

/**
 * HikariCP Connection Pool Configuration
 * 
 * Optimized for Render free-tier deployment with max 5 connections.
 * Manages database connection pooling and resource efficiency.
 */
@Configuration
public class DataSourceConfig {



    @Bean
    public DataSource dataSource(DataSourceProperties properties) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(properties.getUrl());
        config.setUsername(properties.getUsername());
        config.setPassword(properties.getPassword());
        config.setDriverClassName(properties.getDriverClassName());
        
        // Render free-tier constraints
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(20000); // 20 seconds
        config.setIdleTimeout(600000); // 10 minutes
        config.setMaxLifetime(1800000); // 30 minutes
        config.setAutoCommit(true);
        config.setLeakDetectionThreshold(60000); // Detect leaks after 60 seconds
        
        return new HikariDataSource(config);
    }
}
