# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs
RUN npm install
RUN npm run build
WORKDIR /app/backend
RUN mkdir -p src/main/resources/static
RUN cp -r ../frontend/dist/* src/main/resources/static/
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-Dserver.port=${PORT:8081}","-jar","/app/app.jar"]
