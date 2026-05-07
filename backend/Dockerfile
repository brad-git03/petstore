FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/petstore-backend-1.0.0.jar ./petstore-backend-1.0.0.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "connection_string=\"$DATABASE_URL\"; connection_string=${connection_string#postgresql://}; credentials_and_host=${connection_string%%/*}; database_name=${connection_string#*/}; username=${credentials_and_host%%:*}; password_and_host=${credentials_and_host#*:}; password=${password_and_host%%@*}; host_and_port=${password_and_host#*@}; export SPRING_DATASOURCE_URL=jdbc:postgresql://$host_and_port/$database_name; export SPRING_DATASOURCE_USERNAME=$username; export SPRING_DATASOURCE_PASSWORD=$password; exec java -jar /app/petstore-backend-1.0.0.jar"]