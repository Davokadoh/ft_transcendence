FROM python:3.12

WORKDIR /ftt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="$PYTHONPATH:/"
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
RUN pip3 install --no-cache-dir -U -r requirements.txt
COPY ./ftt /ftt/ftt
COPY ./pong /ftt/pong
COPY ./manage.py /ftt/manage.py


COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]