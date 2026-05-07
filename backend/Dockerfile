FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/petstore-backend-1.0.0.jar ./petstore-backend-1.0.0.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "export SPRING_DATASOURCE_URL=$(printf '%s' \"$DATABASE_URL\" | sed 's|^postgresql://|jdbc:postgresql://|'); exec java -jar /app/petstore-backend-1.0.0.jar"]