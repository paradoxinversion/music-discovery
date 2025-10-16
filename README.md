# music-discovery-app (MDA)

MDA is a platform designed to encourage users and lesser-known musicians to find each other.

## Requirements

MDA utilizes multiple containerized services in separate Yarn Workspaces to simplify setup and deployment. To develop and run this project, you'll need:

- Node v22.16.0+
- Yarn v4
- Docker

## Getting Started

### Editor SDKs

For IDEs such as VSCode to properly parse Typescript, you will need to follow [these instructions](https://yarnpkg.com/getting-started/editor-sdks).

### Running the Platform

Follow these steps to run the platform:

- Clone the repository
- From the main branch...
  - Start containers in development mode with `docker compose up --build`
  - Start containers in production mode with `docker compose -f compose.prod.yml up --build`
  - Start containers in test mode with `docker compose -f compose.test.yml`

## Workspaces

This project utilizes Yarn Workspaces. Each workspace and service/resource has its own `README.md` file where you can find more information about it.

### apps/\*

This workspace contains the main platform services. At the moment, there exists a `frontend` and `backend` service. Services in this workspace may integrate features from the `common` or `components` workspaces.

### common

This workspace contains logic/types that are used across multiple workspaces (particularly common TS types).

### components

This workspace is the central location for reusable frontend components and includes Storybook for developing components in isolation.

## Development

- Ensure you're using Node v22.16.0+
- Run `yarn install` from the root directory

Services located in the `/apps/` folder require MongoDB and Redis to be running and available at their default ports. These are included in all `compose*.yml` files. While you can install and run these from your host machine, **it is recommended to use Docker compose with `compose.yml`**, as this method allows hot reloading for the front and back end. MongoDB and Redis are **not** required for the workspaces in `common` or `components`.

### Installing New Dependencies

When instaling dependencies to workspaces, either set the desired workspace as the CWD or use `yarn workspace <workspace> add ...`, ie, `yarn workspace backend add helm`.

## Troubleshooting

### Inspecting Failing Containers

If a particular container is failing after its `CMD`, you can replace the Dockerfile directive with `CMD ["tail", "-f", "/dev/null"]` to run the container indefinitely.

## Roadmap

### MVP Features

- Users
  - Users can create accounts
  - Users with accounts can create artist profiles with social links (ie, Meta, YouTube channels, etc)
  - Users with artist profiles can upload information about their tracks (ie, genre, release dates, where to listen, etc)
  - Users can add tracks and artists to a list of favorites
  - Users can delete their accounts
    - Account deletion also deletes the user's Artist and Track resources, as well as removes them from other user's favorites for consistency
- Music Discovery
  - Users can browse a simple discovery page that surfaces a random sampling of tracks
  - Track pages recommend tracks of the same genre
  - Artist pages recommend artists of the same genre

## CI/CD

Due to the cost associated, this project does not use any paid services for CI/CD at this time.

As an alternative, a local instance of Jenkins running via Docker can be utilized.

## A final note

This is a solo project maintained by Jedai Saboteur, with intent to expand in the future. Due to the workload, some documentation, features, tests, etc, may take time to materialize as I'm able to give them proper attention.
