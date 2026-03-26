# Stage 1: Build the application using a Maven container
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy all project files into the Docker container
COPY . .

# Build the Spring Boot application (this also triggers the frontend build automatically)
RUN mvn clean package -DskipTests

# Stage 2: Run the application using a lightweight Java environment
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the generated mega-jar from the build stage
COPY --from=build /app/target/anitigravity_project-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (Render detects this natively)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
