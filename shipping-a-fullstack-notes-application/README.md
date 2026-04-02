# Shipping a Full-stack Notes Application

Now that you've containerized services in Python, Go, and Node.js individually, it's time to put everything together and ship a real full-stack application. This is the chapter where all the pieces you've been learning -- images, volumes, networks, Compose -- come together into a single project.

The application you'll be working with is a notes app. It lets users create, read, and delete notes through a web interface. Simple on the surface, but underneath it has enough moving parts to exercise almost every Docker concept covered in this book.

## The System at a Glance

The application is made up of four services:

- A **React** frontend that provides the user interface.
- A **Node.js / Express** API that handles all the CRUD operations.
- A **PostgreSQL** database that stores the notes.
- An **NGINX reverse proxy** that sits in front of everything and routes requests to the right place.

The flow looks like this in plain text:

```text
Browser
  |
  v
NGINX (port 8080)
  |
  |--- /api/* ---> Node.js API (port 3000) ---> PostgreSQL (port 5432)
  |
  |--- /*     ---> React Client (port 8080)
```

Every request from the browser first hits NGINX. If the request path starts with `/api`, NGINX forwards it to the Node.js backend. Everything else goes to the React frontend. The database is only accessible to the API -- it's never exposed to the outside world.

If you've been following along with the companion repository, the project lives inside `docker-handbook-projects/fullstack-notes-application/`. Go ahead and navigate to the `completed` directory -- that's the version with all the configuration already in place.

## Why You Need NGINX as a Reverse Proxy

You might be wondering -- why not just let the frontend talk to the API directly using the service name, like you did in the Compose chapter? After all, Docker Compose puts services on the same network, and they can reach each other by name. So why bring NGINX into this?

Well, here's the thing. The React frontend doesn't actually run inside a container. The container serves the static files, but the application itself runs in the user's browser. Once the JavaScript is downloaded and executing in the browser, it has no idea about Docker networks. It can't resolve `api` as a hostname because that DNS resolution only works inside the Docker network, not on your host machine or in a browser.

Hence, you need something that does run inside the Docker network and can route traffic on behalf of the browser. That something is NGINX. It acts as a **reverse proxy** -- it accepts all incoming requests on a single port and decides where to send them based on the URL path.

The NGINX configuration for this project looks like this:

```text
upstream client {
    server client:8080;
}

upstream api {
    server api:3000;
}

server {
    location / {
        proxy_pass http://client;
    }

    location /sockjs-node {
        proxy_pass http://client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location /api {
        rewrite /api/(.*) /$1 break;
        proxy_pass http://api;
    }
}
```

The two `upstream` blocks define the backend destinations using Docker service names -- `client` and `api`. The `server` block contains the routing rules. Requests to `/api` get rewritten \(the `/api` prefix is stripped\) and forwarded to the Node.js API. The `/sockjs-node` block handles WebSocket connections for the development server's hot-reload feature. Everything else goes to the React client.

The NGINX Dockerfile is as simple as it gets:

```text
FROM nginx:stable-alpine

COPY ./development.conf /etc/nginx/conf.d/default.conf
```

All it does is copy the configuration file into the right place inside the container. NGINX takes care of the rest.

## Walking Through the Compose File

Now let's look at the `docker-compose.yaml` file that ties everything together. This is the heart of the project:

```text
version: "3.8"

services:
    db:
        image: postgres:12
        container_name: notes-db-dev
        volumes:
            - db-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
        networks:
            - backend
    api:
        build:
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        volumes:
            - /home/node/app/node_modules
            - ./api:/home/node/app
        environment:
            DB_HOST: db ## same as the database service name
            DB_PORT: 5432
            DB_USER: postgres
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        networks:
            - backend
    client:
        build:
            context: ./client
            dockerfile: Dockerfile.dev
        image: notes-client:dev
        container_name: notes-client-dev
        volumes:
            - /home/node/app/node_modules
            - ./client:/home/node/app
        networks:
            - frontend
    nginx:
        build:
            context: ./nginx
            dockerfile: Dockerfile.dev
        image: notes-router:dev
        container_name: notes-router-dev
        restart: unless-stopped
        ports:
            - 8080:80
        networks:
            - backend
            - frontend

volumes:
    db-data:
        name: notes-db-dev-data

networks:
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

That's a lot of YAML, so let me walk through each service one at a time.

### The Database Service

```text
db:
    image: postgres:12
    container_name: notes-db-dev
    volumes:
        - db-data:/var/lib/postgresql/data
    environment:
        POSTGRES_DB: notesdb
        POSTGRES_PASSWORD: secret
    networks:
        - backend
```

- The `db` service uses the official `postgres:12` image. No custom Dockerfile needed -- the official image handles everything.
- The `volumes` entry maps a **named volume** called `db-data` to `/var/lib/postgresql/data` inside the container. This is where Postgres stores its data files. Without this volume, you'd lose all your notes every time the container restarts.
- The `environment` variables `POSTGRES_DB` and `POSTGRES_PASSWORD` tell the Postgres image to create a database called `notesdb` with the password `secret` on first startup.
- The `networks` entry places this service on the `backend` network only. The database has no business being reachable from the frontend.

### The API Service

```text
api:
    build:
        context: ./api
        dockerfile: Dockerfile.dev
    image: notes-api:dev
    container_name: notes-api-dev
    volumes:
        - /home/node/app/node_modules
        - ./api:/home/node/app
    environment:
        DB_HOST: db ## same as the database service name
        DB_PORT: 5432
        DB_USER: postgres
        DB_DATABASE: notesdb
        DB_PASSWORD: secret
    networks:
        - backend
```

- The `api` service is built from the `Dockerfile.dev` inside the `./api` directory. This is a multi-stage Dockerfile that installs dependencies in one stage and sets up the development environment in another.
- The `volumes` section has two entries. The first one -- `/home/node/app/node_modules` -- is an anonymous volume that prevents the bind mount from overwriting the `node_modules` directory inside the container. I hope you remember this pattern from the mounts chapter. The second entry is a bind mount that syncs your local `./api` directory into the container for hot-reloading.
- The `DB_HOST` environment variable is set to `db` -- the name of the database service. As you've already learned, Compose services on the same network can reach each other by service name. Hence, the API can connect to Postgres simply by using `db` as the hostname.
- The rest of the `DB_*` variables must match the credentials you set on the `db` service.
- Like the database, this service lives on the `backend` network only.

### The Client Service

```text
client:
    build:
        context: ./client
        dockerfile: Dockerfile.dev
    image: notes-client:dev
    container_name: notes-client-dev
    volumes:
        - /home/node/app/node_modules
        - ./client:/home/node/app
    networks:
        - frontend
```

- The `client` service builds the React frontend from the `./client` directory.
- It uses the same anonymous volume and bind mount pattern as the API for preserving `node_modules` while enabling hot-reloading of your source code.
- This service is on the `frontend` network only. It doesn't need to talk to the database or the API directly -- remember, NGINX handles that routing.

### The NGINX Service

```text
nginx:
    build:
        context: ./nginx
        dockerfile: Dockerfile.dev
    image: notes-router:dev
    container_name: notes-router-dev
    restart: unless-stopped
    ports:
        - 8080:80
    networks:
        - backend
        - frontend
```

- The `nginx` service is the only service with a `ports` mapping. Port `8080` on your host maps to port `80` inside the container. This is the single entry point for the entire application.
- The `restart: unless-stopped` policy means NGINX will automatically restart if it crashes, unless you explicitly stop it yourself.
- This is the key part -- the `networks` entry lists both `backend` and `frontend`. NGINX is the bridge between the two networks. It can reach the `client` service on the frontend network and the `api` service on the backend network. This is what makes the routing work.

### Volumes and Networks

```text
volumes:
    db-data:
        name: notes-db-dev-data

networks:
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

- The `volumes` block declares the `db-data` named volume. Any named volume used by a service must be declared here at the top level.
- The `networks` block defines two custom bridge networks. By default, Compose creates a single bridge network and attaches all containers to it. In this project, I wanted proper **network isolation** -- the frontend services shouldn't be able to reach the database, and the database shouldn't be exposed to the frontend. Two separate networks achieve this.

## How the Network Isolation Works

Let me spell this out clearly because it's one of the most important patterns in this project.

The `backend` network connects the `db`, `api`, and `nginx` services. The `frontend` network connects the `client` and `nginx` services. As you can see, `nginx` is the only service that sits on both networks.

This means:

- The `api` service can reach the `db` service because they're both on `backend`.
- The `nginx` service can reach the `api` service because they're both on `backend`.
- The `nginx` service can reach the `client` service because they're both on `frontend`.
- The `client` service cannot reach the `db` service because they're on different networks with no overlap.
- The `db` service cannot reach the `client` service for the same reason.

This is a common pattern in production setups. You don't want your database exposed to any more services than absolutely necessary. The two-network approach gives you that isolation without any complicated firewall rules.

## Building and Running the Application

Make sure your terminal is open in the `fullstack-notes-application/completed` directory where the `docker-compose.yaml` file lives. Then execute the following command:

```text
docker compose up --build --detach

# [+] Building 45.2s (25/25) FINISHED
# ...
# [+] Running 5/5
#  ✔ Network fullstack-notes-application-network-frontend  Created
#  ✔ Network fullstack-notes-application-network-backend   Created
#  ✔ Container notes-db-dev                                Started
#  ✔ Container notes-api-dev                               Started
#  ✔ Container notes-client-dev                             Started
#  ✔ Container notes-router-dev                             Started
```

The `--build` option forces Docker Compose to rebuild all the images before starting. The `--detach` option runs everything in the background so you get your terminal back.

Keep in mind that the first build might take a while because Docker needs to pull the base images and install all the dependencies. Subsequent builds will be much faster thanks to layer caching.

## Verifying Everything Is Running

Once the command finishes, verify that all four containers are up and healthy:

```text
docker compose ps

# NAME                 IMAGE              COMMAND                  SERVICE   CREATED          STATUS          PORTS
# notes-api-dev        notes-api:dev      "docker-entrypoint.s…"   api       30 seconds ago   Up 29 seconds
# notes-client-dev     notes-client:dev   "docker-entrypoint.s…"   client    30 seconds ago   Up 29 seconds
# notes-db-dev         postgres:12        "docker-entrypoint.s…"   db        30 seconds ago   Up 29 seconds   5432/tcp
# notes-router-dev     notes-router:dev   "/docker-entrypoint.…"   nginx     30 seconds ago   Up 29 seconds   0.0.0.0:8080->80/tcp
```

All four services should show a status of `Up`. If any of them exited, check the logs to see what went wrong:

```text
docker compose logs api

# notes-api-dev | [nodemon] 2.0.7
# notes-api-dev | [nodemon] to restart at any time, enter `rs`
# notes-api-dev | [nodemon] watching path(s): *.*
# notes-api-dev | [nodemon] starting `node bin/www`
# notes-api-dev | app running -> http://127.0.0.1:3000
```

Before you can use the application, you need to run the database migration to create the necessary tables. Execute the following command:

```text
docker compose exec api npm run db:migrate

# > notes-api@ db:migrate /home/node/app
# > knex migrate:latest
#
# Using environment: development
# Batch 1 run: 1 migrations
```

Now open your browser and visit `http://localhost:8080`. You should see the notes application running. Try creating a few notes, deleting some, and refreshing the page to confirm that everything persists thanks to the Postgres volume.

## Stopping and Cleaning Up

When you're done playing around with the application, you can bring everything down with a single command:

```text
docker compose down --volumes

# [+] Running 7/7
#  ✔ Container notes-router-dev                             Removed
#  ✔ Container notes-client-dev                             Removed
#  ✔ Container notes-api-dev                                Removed
#  ✔ Container notes-db-dev                                 Removed
#  ✔ Volume notes-db-dev-data                               Removed
#  ✔ Network fullstack-notes-application-network-frontend   Removed
#  ✔ Network fullstack-notes-application-network-backend    Removed
```

The `--volumes` flag removes the named `db-data` volume as well. If you want to keep your data between sessions, just omit that flag and the volume will stick around for next time.

And that's it. You've just shipped a full-stack application with four services, two isolated networks, persistent storage, and a reverse proxy -- all defined in a single YAML file and launched with one command. Every Docker concept from the previous chapters came together here: images, volumes, networks, multi-stage builds, environment variables, and Compose.

In the next chapter, you'll see how these same Docker patterns apply to a very different kind of workload -- running LLM and AI services in containers.
