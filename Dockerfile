FROM node:16.18.0-alpine3.15 as build

RUN npm i -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node:16.18.0-alpine3.15 as deploy

WORKDIR /app
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

ENV NODE_ENV production

CMD [ "node", "dist/main" ]