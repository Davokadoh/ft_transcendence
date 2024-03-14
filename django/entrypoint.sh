#!/bin/sh

set -e

echo "Waiting for postgres..."

# while ! nc -z $DB_HOST $DB_PORT; do
#     sleep 0.1
# done

echo "PostgreSQL started"
python3 manage.py collectstatic --noinput && \
python3 manage.py makemigrations pong && \
python3 manage.py migrate && \
daphne ftt.asgi:application --bind 0.0.0.0 --port 8000