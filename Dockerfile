# ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---------- Deps ----------
FROM base AS deps

RUN corepack enable

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn/ .yarn/

RUN yarn

# ---------- Build ----------
FROM deps AS build
COPY . .
RUN yarn prepack
RUN yarn bundle-server

# ---------- Runtime ----------
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache tini curl

COPY --from=build /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "-g", "--"]

HEALTHCHECK --interval=3s --timeout=1s --start-period=10s --retries=20 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1

USER node

CMD ["node", "dist/server.cjs"]
