# Containerizing a Node.js API with Postgres

Now that you've containerized a modern frontend application and understand how Dockerfiles, builds, and container execution fit together, it's time for you to tackle something more involved. In this chapter, you'll containerize a REST API built with Node.js that depends on a Postgres database.

This is the first time in this book where you'll deal with **multi-container applications** using raw Docker commands. The API runs in one container, the database runs in another, and they need to talk to each other over a network. You'll do everything manually first -- creating networks, running database containers, writing Dockerfiles, and wiring it all together. Then, at the end, I'll show you how Docker Compose collapses all of that into a single file.

The project you'll be working with is called `notes-api-node` and it lives inside the `docker-handbook-projects/notes-api-node/` directory within the companion projects repository. The `starter/` directory contains the starting point for this chapter, and the `completed/` directory contains the final version with the Dockerfile and Compose file already in place.

## Understanding the Project

Before you containerize anything, lets take a quick look at what this project actually does. The `notes-api-node` project is a simple REST API for managing notes. It's built with Express and uses the `pg` package to connect to a Postgres database.

The project structure is straightforward:

- `index.js` -- the entry point that sets up the Express server and mounts the routes.
- `routes.js` -- defines the CRUD routes for notes \(create, read, update, delete\).
- `db.js` -- creates a connection pool to Postgres using environment variables.
- `migrate.js` -- a migration script that creates the `notes` table in the database.
- `package.json` -- lists `express` and `pg` as dependencies.

The API exposes the following endpoints:

- `GET /health` -- returns a simple health check response.
- `GET /notes` -- lists all notes.
- `POST /notes` -- creates a new note.
- `GET /notes/:id` -- gets a single note by its ID.
- `PUT /notes/:id` -- updates a note by its ID.
- `DELETE /notes/:id` -- deletes a note by its ID.

The database connection is configured through environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. If these are not set, the application falls back to default values that assume Postgres is running on `localhost` with the password `secret` and a database called `notesdb`.

Don't worry if you don't know Express or Node.js in depth. The focus here is on the Docker side of things, not the application code.

## Setting Up the Network

As you've already learned in the networking chapter, containers need to be on the same **user-defined bridge network** in order to communicate with each other by name. The default bridge network doesn't provide automatic DNS resolution between containers, so you need to create your own.

To create a new network for this project, execute the following command:

```text
docker network create notes-api-network

# 7a8f4e2b9c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
```

The command outputs the ID of the newly created network. You can verify that it exists by listing all networks:

```text
docker network ls

# NETWORK ID     NAME                DRIVER    SCOPE
# a1b2c3d4e5f6   bridge              bridge    local
# 9f8e7d6c5b4a   host                host      local
# 3a2b1c0d9e8f   none                null      local
# 7a8f4e2b9c1d   notes-api-network   bridge    local
```

As you can see, the `notes-api-network` shows up in the list with the `bridge` driver. Both the database container and the API container will be attached to this network so they can find each other by container name.

## Running the Database Container

The API needs a Postgres database to store its data. Instead of installing Postgres on your machine, you'll run it as a container using the official `postgres` image from Docker Hub.

Before running the database, you need to think about data persistence. By default, all data inside a container is lost when the container is removed. For a database, that would be a disaster. Hence, you need a **named volume** to persist the database files outside the container's writable layer.

To create a named volume for the database data, execute the following command:

```text
docker volume create notes-db-data

# notes-db-data
```

Named volumes are managed entirely by Docker and are stored somewhere on the host filesystem \(the exact location depends on your operating system\). The important thing is that the data in this volume will survive even if you remove and recreate the database container. I prefer named volumes over bind mounts for databases because they are portable and don't depend on a specific directory structure on the host.

Now you can run the Postgres container. Execute the following command:

```text
docker container run \
    --detach \
    --name notes-db \
    --network notes-api-network \
    --volume notes-db-data:/var/lib/postgresql/data \
    --env POSTGRES_DB=notesdb \
    --env POSTGRES_PASSWORD=secret \
    postgres:16-alpine

# a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4
```

There is a lot going on in this command, so let me break it down:

- `--detach` runs the container in the background so you get your terminal back.
- `--name notes-db` gives the container a memorable name. This name also doubles as the hostname on the `notes-api-network`, which is how the API container will connect to it.
- `--network notes-api-network` attaches the container to the network you created earlier.
- `--volume notes-db-data:/var/lib/postgresql/data` mounts the named volume to the directory where Postgres stores its data files inside the container. This ensures the data persists across container restarts and removals.
- `--env POSTGRES_DB=notesdb` tells Postgres to create a database called `notesdb` on first startup.
- `--env POSTGRES_PASSWORD=secret` sets the password for the default `postgres` user.
- `postgres:16-alpine` is the image to use. I'm going with version 16 on Alpine Linux to keep the image size small.

Keep in mind that the `POSTGRES_DB` and `POSTGRES_PASSWORD` environment variables are specific to the official Postgres image. They are not general Docker options. The image's documentation on Docker Hub explains all the available configuration options.

## Checking the Database Logs

After starting the database container, it's a good idea to check its logs and make sure everything started up properly. To view the logs, execute the following command:

```text
docker container logs notes-db

# PostgreSQL Database directory appears to contain a database; Skipping initialization
#
# 2025-01-15 10:30:00.123 UTC [1] LOG:  starting PostgreSQL 16.4 on x86_64-pc-linux-musl
# 2025-01-15 10:30:00.123 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
# 2025-01-15 10:30:00.456 UTC [1] LOG:  listening on IPv6 address "::", port 5432
# 2025-01-15 10:30:00.789 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
# 2025-01-15 10:30:01.012 UTC [1] LOG:  database system is ready to accept connections
```

Your output will look slightly different depending on whether this is the first time the volume is being used, but the key line to look for is `database system is ready to accept connections`. If you see that, Postgres is running and ready to go.

If you see errors instead, you can use `docker container logs --follow notes-db` to watch the logs in real time. Press `Ctrl + C` to stop following.

## Writing the Dockerfile

Now it's time to write a Dockerfile for the API itself. Navigate to the `notes-api-node/starter/` directory and create a new file called `Dockerfile` with the following content:

```text
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

Explanation for this code is as follows:

- `FROM node:22-alpine` -- uses the official Node.js 22 image based on Alpine Linux as the base. As I've mentioned before, I prefer Alpine-based images for their small size.
- `WORKDIR /app` -- sets the working directory inside the image to `/app`.
- `COPY package*.json ./` -- copies `package.json` and `package-lock.json` into the working directory. Copying these files first allows Docker to cache the dependency installation layer.
- `RUN npm ci --omit=dev` -- installs only production dependencies. The `--omit=dev` flag skips development dependencies like testing tools, which you don't need in a production image.
- `COPY . .` -- copies the rest of the project files into the image.
- `EXPOSE 3000` -- documents that the API listens on port `3000`.
- `CMD ["node", "index.js"]` -- starts the API server when the container runs.

You should also create a `.dockerignore` file in the same directory to prevent unnecessary files from being included in the build context:

```text
node_modules
npm-debug.log
.env
.git
.gitignore
```

The most important entry here is `node_modules`. You don't want to copy local dependencies into the image because the `RUN npm ci --omit=dev` instruction installs them fresh during the build. Including `node_modules` from your host could cause platform mismatches \(for example, native modules compiled on macOS won't work inside a Linux container\).

## Building the API Image

With the Dockerfile in place, you can build the image. Execute the following command from inside the `notes-api-node/starter/` directory:

```text
docker image build \
    --tag notes-api:latest \
    .

# [+] Building 18.3s (10/10) FINISHED                           docker:default
#  => [internal] load build definition from Dockerfile                    0.0s
#  => [internal] load metadata for docker.io/library/node:22-alpine      1.1s
#  => [internal] load .dockerignore                                      0.0s
#  => [1/5] FROM docker.io/library/node:22-alpine@sha256:abc123...       3.2s
#  => [internal] load build context                                      0.0s
#  => [2/5] WORKDIR /app                                                 0.1s
#  => [3/5] COPY package*.json ./                                        0.0s
#  => [4/5] RUN npm ci --omit=dev                                       12.5s
#  => [5/5] COPY . .                                                     0.1s
#  => exporting to image                                                 1.2s
#  => => naming to docker.io/library/notes-api:latest                    0.0s
```

The image is now built and tagged as `notes-api:latest`. You can verify it exists by running `docker image ls` and looking for it in the list.

## Running the API Container

Now that both the database and the API image are ready, you can run the API container. This is where you connect the dots -- the API container needs to know how to reach the database, and you provide that information through environment variables.

Execute the following command:

```text
docker container run \
    --detach \
    --name notes-api \
    --network notes-api-network \
    --publish 3000:3000 \
    --env DB_HOST=notes-db \
    --env DB_PORT=5432 \
    --env DB_USER=postgres \
    --env DB_PASSWORD=secret \
    --env DB_NAME=notesdb \
    notes-api:latest

# f1e2d3c4b5a6978069584736251403f2e1d0c9b8a7968574635241302f1e0d9c8
```

Let me walk through the important parts:

- `--name notes-api` -- gives the container a recognizable name.
- `--network notes-api-network` -- attaches it to the same network as the database container. This is critical. Without this, the API would not be able to find the database.
- `--publish 3000:3000` -- publishes port `3000` on the host so you can reach the API from your browser or `curl`.
- `--env DB_HOST=notes-db` -- this is the key piece. The value `notes-db` is the name of the database container. Because both containers are on the same user-defined bridge network, Docker's built-in DNS resolves `notes-db` to the IP address of the database container. This is why I gave the database container a meaningful name earlier.
- The remaining `--env` flags provide the database credentials and name, matching what you configured when starting the Postgres container.

You can check that the API container is running with `docker container ls`:

```text
docker container ls

# CONTAINER ID   IMAGE              COMMAND            CREATED          STATUS          PORTS                    NAMES
# f1e2d3c4b5a6   notes-api:latest   "node index.js"    5 seconds ago    Up 4 seconds    0.0.0.0:3000->3000/tcp   notes-api
# a3b4c5d6e7f8   postgres:16-alpine "docker-entryp..." 2 minutes ago    Up 2 minutes    5432/tcp                 notes-db
```

Both containers are up and running on the same network.

## Running the Database Migration

The API is running, but the database doesn't have the `notes` table yet. If you tried to create a note right now, it would fail. The project includes a migration script in `migrate.js` that creates the table.

To run the migration, you use `docker container exec` to execute a command inside the already-running API container:

```text
docker container exec notes-api node migrate.js

# Migration complete: notes table created.
```

The `docker container exec` command runs a process inside a running container. Here, you're executing `node migrate.js` inside the `notes-api` container. The migration script connects to Postgres \(using the same environment variables the API uses\), creates the `notes` table if it doesn't already exist, and exits.

You only need to run this once. After the table is created, the data persists in the named volume. Even if you stop and restart the containers, the table and its data will still be there.

## Testing the API

Now that everything is set up, lets put the API through its paces. You'll use `curl` to make HTTP requests to the API running on `http://localhost:3000`.

First, check the health endpoint to make sure the API is responding:

```text
curl -s http://localhost:3000/health | python3 -m json.tool

# {
#     "status": "ok"
# }
```

The API is alive and well. Now create a new note:

```text
curl -s \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"title": "My first note", "body": "This note was created from a containerized API."}' \
    http://localhost:3000/notes | python3 -m json.tool

# {
#     "id": 1,
#     "title": "My first note",
#     "body": "This note was created from a containerized API.",
#     "created_at": "2025-01-15T10:35:00.123Z"
# }
```

The note was created with an `id` of `1`. Lets create one more:

```text
curl -s \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"title": "Docker is great", "body": "Running a database in a container is surprisingly easy."}' \
    http://localhost:3000/notes | python3 -m json.tool

# {
#     "id": 2,
#     "title": "Docker is great",
#     "body": "Running a database in a container is surprisingly easy.",
#     "created_at": "2025-01-15T10:35:30.456Z"
# }
```

Now list all the notes:

```text
curl -s http://localhost:3000/notes | python3 -m json.tool

# [
#     {
#         "id": 2,
#         "title": "Docker is great",
#         "body": "Running a database in a container is surprisingly easy.",
#         "created_at": "2025-01-15T10:35:30.456Z"
#     },
#     {
#         "id": 1,
#         "title": "My first note",
#         "body": "This note was created from a containerized API.",
#         "created_at": "2025-01-15T10:35:00.123Z"
#     }
# ]
```

As you can see, both notes are returned in reverse chronological order. You can also fetch a single note by its ID:

```text
curl -s http://localhost:3000/notes/1 | python3 -m json.tool

# {
#     "id": 1,
#     "title": "My first note",
#     "body": "This note was created from a containerized API.",
#     "created_at": "2025-01-15T10:35:00.123Z"
# }
```

The API is fully functional. It's running inside a container, connected to a Postgres database running in another container, and both are communicating over a user-defined bridge network. That's a real multi-container setup, built entirely from the command line.

## The Compose Approach

Well, that was a lot of commands. You had to create a network, create a volume, run the database container with a pile of flags, build the API image, run the API container with another pile of flags, and then run the migration. That's six separate steps, each with its own set of options to remember.

This is exactly the kind of problem Docker Compose was designed to solve. Instead of typing all those commands one by one, you can describe your entire multi-container setup in a single `compose.yaml` file and bring it all up with one command.

Here is the `compose.yaml` file that replaces everything you just did manually:

```text
services:
  db:
    image: postgres:16-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: notesdb
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: secret
      DB_NAME: notesdb
      PORT: 3000
    depends_on:
      - db

volumes:
  db-data:
```

Let me walk through what each part does and how it maps to the manual commands you ran earlier:

- `services` defines the containers. Each key under `services` becomes a container \(and a hostname on the network\).
- The `db` service uses the `postgres:16-alpine` image, mounts a named volume for data persistence, and sets the same environment variables you passed with `--env` earlier. The `ports` mapping makes Postgres accessible from the host if you want to connect to it directly with a database client.
- The `api` service uses `build: .` to build an image from the Dockerfile in the current directory. It publishes port `3000`, sets all the database connection environment variables, and declares that it `depends_on` the `db` service. Notice that `DB_HOST` is set to `db` -- that's the service name, which Compose uses as the hostname on the network it creates automatically.
- The `volumes` section at the bottom declares the named volume `db-data`. Compose creates this automatically if it doesn't exist.

Here's what you don't need to do when using Compose: you don't need to create a network manually. Compose creates a default network for each project and attaches all services to it. You also don't need to name your containers -- Compose handles that with a predictable naming scheme.

To bring everything up, you just run:

```text
docker compose up --build --detach

# [+] Building 2.1s (10/10) FINISHED
# [+] Running 3/3
#  ✓ Network starter_default     Created
#  ✓ Container starter-db-1      Started
#  ✓ Container starter-api-1     Started
```

The `--build` flag ensures the API image is rebuilt from the Dockerfile. The `--detach` flag runs everything in the background. In a matter of seconds, your entire stack is up and running.

You still need to run the migration after the first startup:

```text
docker compose exec api node migrate.js

# Migration complete: notes table created.
```

Notice that with Compose you use `docker compose exec` instead of `docker container exec`, and you refer to the service name \(`api`\) rather than the container name.

To stop and remove everything:

```text
docker compose down

# [+] Running 3/3
#  ✓ Container starter-api-1     Removed
#  ✓ Container starter-db-1      Removed
#  ✓ Network starter_default     Removed
```

Keep in mind that `docker compose down` removes the containers and the network, but it does not remove the named volume. Your database data is still safe. If you want to remove the volumes as well, you can pass the `--volumes` flag, but be careful -- that will delete all your data.

The completed version of this project with the Dockerfile, `.dockerignore`, and `compose.yaml` already in place lives in the `docker-handbook-projects/notes-api-node/completed/` directory.

## Cleaning Up

If you followed along with the manual approach and still have those containers running, it's time to clean up before moving on. Stop and remove the containers, then remove the network:

```text
docker container stop notes-api notes-db

# notes-api
# notes-db

docker container rm notes-api notes-db

# notes-api
# notes-db

docker network rm notes-api-network

# notes-api-network
```

If you want to remove the volume as well, you can do so with `docker volume rm notes-db-data`. I would suggest keeping it around for now if you plan to experiment more with this project.

In the next chapter, you'll containerize a Go service. The approach will feel familiar, but you'll see how multi-stage builds can produce really small final images, since Go compiles to a static binary.
