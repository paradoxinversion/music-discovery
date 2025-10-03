# syntax=docker/dockerfile:1
# check=error=true;experimental=CopyIgnoredFile

ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-alpine AS frontend-dev

WORKDIR /app
# Copy root config & dependency artifacts
COPY --from=base app/package.json app/tsconfig.json app/yarn.lock app/.pnp.cjs \
app/.pnp.loader.mjs ./
COPY --from=base /app/.yarn/ ./.yarn/
# Copy component artifacts (& package.json for dependency resolution)
COPY --from=base /app/components/package.json ./components/
COPY --from=base /app/components/dist/ ./components/dist/
# Copy full frontend dir for development
COPY --from=base /app/apps/frontend/ ./apps/frontend/

RUN corepack enable && yarn workspaces focus -A --production
EXPOSE 3000

CMD [ "yarn", "workspace", "frontend", "dev" ]
