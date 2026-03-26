# Stage 1: Build the React Frontend natively using the official Node container
FROM node:20 AS frontend-build
WORKDIR /app/frontend

# Install dependencies and build
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build the Java Backend cleanly
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Copy the POM and Java code
COPY pom.xml .
COPY src ./src

# Create the static folder and copy the built frontend directly into Spring Boot
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /app/frontend/dist /app/src/main/resources/static

# Build the Java server securely
RUN mvn clean package -DskipTests -Dskip.frontend=true

# Stage 3: The final lightweight production server
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the unified server file
COPY --from=backend-build /app/target/anitigravity_project-0.0.1-SNAPSHOT.jar app.jar

# Expose port and Boot!
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
