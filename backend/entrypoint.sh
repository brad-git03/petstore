#!/bin/sh
set -eu

database_url="${DATABASE_URL:-}"
if [ -z "$database_url" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

database_url="${database_url#postgresql://}"
database_url="${database_url#postgres://}"
database_url="${database_url%%\?*}"

credentials_and_host="${database_url%%/*}"
database_name="${database_url#*/}"
username="${credentials_and_host%%:*}"
password_and_host="${credentials_and_host#*:}"
password="${password_and_host%%@*}"
host_and_port="${password_and_host#*@}"

export SPRING_DATASOURCE_URL="jdbc:postgresql://${host_and_port}/${database_name}"
export SPRING_DATASOURCE_USERNAME="${username}"
export SPRING_DATASOURCE_PASSWORD="${password}"

exec java -jar /app/petstore-backend-1.0.0.jar