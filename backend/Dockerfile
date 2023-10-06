FROM node:latest

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
RUN pnpm install

CMD pnpm -r dotenv-safe/config start:dev