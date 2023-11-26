FROM node:slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./app /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm i vite

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
# Copiez les fichiers de la police Spoof depuis le répertoire local vers l'image Docker
# COPY src/fonts/Spoof /app/src/fonts/Spoof
COPY --from=build /frontend/app/src/fonts/Spoof/ /frontend/app/src/fonts/Spoof/

CMD [ "pnpm", "vite"]