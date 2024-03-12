FROM python:3.12

WORKDIR /ftt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ARG DOMAIN

RUN mkdir /ssl && openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-out /ssl/cert.crt \
	-keyout /ssl/privkey.key \
	-subj "/C=CH/ST=Vaud/L=Renens/O=42/OU=42Lausanne/CN=${DOMAIN}"

# RUN pip install certbot
# ARG EMAIL
# EXPOSE 80
# RUN certbot certonly --standalone -d $DOMAIN --test-cert --cert-path "/ssl/privkey.pem" --key-path "/ssl/cert.pem" --email $EMAIL --agree-tos --preferred-challenges http --non-interactive

# /etc/letsencrypt/live/$DOMAIN

COPY ./requirements.txt /ftt/requirements.txt
RUN pip install --no-cache-dir -U -r requirements.txt
COPY ./ftt /ftt/ftt
COPY ./pong /ftt/pong
COPY ./manage.py /ftt/manage.py
RUN python manage.py collectstatic --noinput
RUN python manage.py makemigrations pong
RUN python manage.py migrate

# ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
ENTRYPOINT ["daphne", "-e", "ssl:443:privateKey=/ssl/privkey.key:certKey=/ssl/cert.crt", "ftt.asgi:application"]
