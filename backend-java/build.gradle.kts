plugins {
    java
    war
    id("org.springframework.boot") version "3.5.9"
    id("io.spring.dependency-management") version "1.1.7"
}

import org.springframework.boot.gradle.tasks.bundling.BootWar

group = "com.piotr-capecki"
version = "0.0.1-SNAPSHOT"
description = "DreamHouse"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa") {
        exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
    }
    implementation("org.springframework.boot:spring-boot-starter-security") {
        exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
    }
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web") {
        exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
    }
    providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    compileOnly("org.projectlombok:lombok")
    runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

// Exclude logging from runtime - Tomcat will provide it
configurations.runtimeClasspath {
    exclude(group = "ch.qos.logback")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// Optimize WAR size
tasks.named<BootWar>("bootWar") {
    // Exclude debug and source files
    exclude("**/*-sources.jar")
    exclude("**/*-javadoc.jar")
    exclude("META-INF/maven/**")
    exclude("META-INF/*.kotlin_module")

    archiveFileName.set("dreamhome.war")
    
    // Don't package provided dependencies (Tomcat) into WEB-INF/lib-provided
    // This reduces WAR size but makes it non-executable via java -jar
    providedClasspath = files()
}
