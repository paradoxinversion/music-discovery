ARG NODE_VERSION=18.20.2
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

# Copy base dependencies
COPY package.json yarn.lock tsconfig.json ./
COPY apps/backend ./apps/backend

# Install dependencies
RUN corepack enable && yarn install

EXPOSE 3001

CMD [ "yarn", "workspace", "backend", "dev" ]
