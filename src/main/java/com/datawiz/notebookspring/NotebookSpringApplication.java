package com.datawiz.notebookspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class NotebookSpringApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(NotebookSpringApplication.class, args);

        System.out.println(run.isActive() + " is  Active");
        System.out.println(run.isRunning() + " is  Running");
    }

}
