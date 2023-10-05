curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm add -D dotenv-safe
pnpm add -D @nestjs/cli
pnpm nest new ${PROJECT_NAME}
pnpm -r dotenv-safe/config start:dev
CMD pnpm -r dotenv-safe/config start:dev