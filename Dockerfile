FROM openjdk:17-jdk-slim

# JAR 파일 복사
COPY target/JamJam_BE-0.0.1-SNAPSHOT.jar app.jar

# 실행 포트
EXPOSE 8081

# 실행 명령
ENTRYPOINT ["java", "-jar", "/app.jar"]
