FROM python:3.12

WORKDIR /ftt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ARG DOMAIN

# RUN	openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
# 	-out /ssl/selfsigned.crt \
# 	-keyout /ssl/selfsigned.key \
# 	-subj "/C=CH/ST=Vaud/L=Renens/O=42/OU=/CN=localhost"

RUN pip install certbot
RUN certbot certonly --standalone -d $DOMAIN --test-cert --cert-path "/ssl/privkey.pem" --key-path "/ssl/cert.pem"

# /etc/letsencrypt/live/$DOMAIN

RUN mkdir /ssl
COPY --link ./ftt /ftt/ftt
COPY --link ./pong /ftt/pong
COPY --link ./manage.py /ftt/manage.py
COPY --link ./requirements.txt /ftt/requirements.txt
RUN pip install --no-cache-dir -U -r requirements.txt
RUN export DJANGO_SETTINGS_MODULE=ftt.settings
RUN python manage.py collectstatic --noinput
RUN python manage.py makemigrations pong
RUN python manage.py migrate

# ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
ENTRYPOINT ["daphne", "-e", "ssl:443:privateKey=/ssl/privkey.pem:certKey=/ssl/cert.pem", "ftt.asgi:application"]
