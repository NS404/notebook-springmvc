package com.datawiz.notebookspring.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import java.util.Properties;

@Configuration
public class ExceptionConfig {

    @Bean(name = "simpleMappingExceptionResolver")
    public SimpleMappingExceptionResolver createMappingExceptionResolver(){

        SimpleMappingExceptionResolver resolver = new SimpleMappingExceptionResolver();

        Properties mappings = new Properties();
        mappings.setProperty("DatabaseException", "databaseException");
        mappings.setProperty("ItemNotFoundException", "itemNotFoundException");

        resolver.setExceptionMappings(mappings);
        resolver.setExceptionAttribute("ex"); //default "exception"
        resolver.setDefaultErrorView("defaultErrorPage");



        return resolver;
    }


}
