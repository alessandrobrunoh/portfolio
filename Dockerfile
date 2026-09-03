# syntax=docker/dockerfile:1

# ---- build ----------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Copy manifests first so `npm ci` stays cached until dependencies change.
COPY package.json package-lock.json ./
# --ignore-scripts avoids esbuild's postinstall, which intermittently fails with
# ETXTBSY on Docker's virtualised filesystem. Vite loads esbuild through its JS
# API, which resolves the platform package directly, so nothing here needs it.
RUN npm ci --ignore-scripts --no-audit --no-fund \
      --fetch-retries=5 --fetch-retry-maxtimeout=120000 --fetch-timeout=600000

COPY . .
RUN npm run build

# ---- runtime --------------------------------------------------------------
# The app is a client-rendered SPA (vite.config.ts sets `analog({ ssr: false })`),
# so nginx serving dist/client is the whole story — no Node process at runtime.
FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security.conf /etc/nginx/snippets/security.conf
COPY --from=build /app/dist/client /usr/share/nginx/html

# nginx:alpine ships an unprivileged variant of the config; port 8080 needs no root.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
