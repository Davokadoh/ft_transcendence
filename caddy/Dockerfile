FROM caddy:2.4-builder AS caddy-build

RUN xcaddy build --with github.com/caddyserver/replace-response

FROM caddy:2.4

COPY --from=caddy-build /usr/bin/caddy /usr/bin/caddy
WORKDIR /my-site
COPY Caddyfile /etc/caddy/Caddyfile