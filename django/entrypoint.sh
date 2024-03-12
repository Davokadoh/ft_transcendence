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
daphne -e tcp:80 -e ssl:443:privateKey=/ssl/privkey.key:certKey=/ssl/cert.crt ftt.asgi:application