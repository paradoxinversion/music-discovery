## Environment (Backend)

### Environment Variables

Non-secret environment variables should be accessible to the application via `process.env.VARIABLE_NAME`. The variables are specified in their relative `compose` file at the root of the directory.

#### `DB_HOST`

The target host for the MongoDB database.

> Default: mongo

#### `DB_PORT`

The target port for the MongoDB database.

> Default: 27017

#### `DB_NAME`

The name of the database to connect to.

> Development Default: music-production-app-dev
>
> Production Default: music-production-app-prod

#### `PORT`

The port the application should run on within the host machine

> Default: 3001

### Secrets

Secrets are handled via Docker and available at `run/secrets/SECRET_NAME` within the docker container. Some secrets are only used in production, as noted below.

> Handling runtime secrets via docker is a temporary solution, until a 3rd party secrets manager can be integrated. See `documentation/secrets` in the root directory for more information.

#### `DB_USER` (PROD)

The username to authenticate against MongDB

#### `DB_PASSWORD` (PROD)

The password to authenticate against MongDB

#### `SESSION_SECRET`

The secret used to sign session ID cookies
