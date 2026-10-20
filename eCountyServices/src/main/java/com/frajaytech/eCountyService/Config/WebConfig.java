package com.frajaytech.eCountyService.Config;

import com.frajaytech.eCountyService.Service.FileStorageService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Serves uploaded images at /uploads/<random-name>. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final FileStorageService files;

    public WebConfig(FileStorageService files) { this.files = files; }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(files.root().toUri().toString());
    }
}
