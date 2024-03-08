FROM nginx:1.24

RUN apt-get update && \
	apt-get install -y openssl && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl

RUN	openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-out /etc/nginx/ssl/ft_transcendence.crt \
	-keyout /etc/nginx/ssl/ft_transcendence.key \
	-subj "/C=CH/ST=Vaud/L=Renens/O=42/OU=/CN=localhost"

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend /usr/src/app/dist /usr/share/nginx/html
COPY --from=backend /app/staticfiles /app/staticfiles
COPY --from=backend /app/media /app/media