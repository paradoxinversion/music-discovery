ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

# Copy base dependencies
COPY package.json yarn.lock tsconfig.json ./
COPY apps/frontend ./apps/frontend
COPY common/types ./common/types
COPY components ./components

# Install dependencies
RUN corepack enable && yarn install
RUN yarn workspace @mda/components build
EXPOSE 3000

CMD [ "yarn", "workspace", "frontend", "dev" ]
