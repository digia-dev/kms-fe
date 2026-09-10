FROM node:22-alpine AS dev

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY apps/web/package.json apps/web/pnpm-lock.yaml* ./

RUN pnpm install --ignore-scripts

COPY apps/web/ .

EXPOSE 3000

CMD ["pnpm", "dev"]
