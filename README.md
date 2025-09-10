# music-discovery-app

## Installing New Dependencies

When instaling dependencies to workspaces, either set the desired workspace as the CWD or use `yarn workspace <workspace> add ...`

## Running Applications in Development

`docker compose up --build`

## Running tests

`docker compose -f ./compose.test.yml up --build`

## Inspecting Failing Containers

Replace the Dockerfile CMD with `CMD ["tail", "-f", "/dev/null"]` to run the container indefinitely