# Compose v2 and multi-service development

Now that you've learned about container networking and how containers can communicate with each other over user-defined bridge networks, it's time to talk about a tool that makes managing multi-container projects a whole lot easier.

If you think back to the previous chapters, running a multi-container project like the notes API required you to create networks, create volumes, start containers with long lists of options, and remember the exact order of operations. That's a lot of commands to type and a lot of things to keep track of. Imagine doing all of that every single time you want to start your application during development. It's a painful task.

Well, there is a better way. A tool called **Docker Compose** can take all of that manual work and reduce it down to a single command.

## What is Docker Compose

According to the [official docs](https://docs.docker.com/compose/) -- "Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services. Then, with a single command, you create and start all the services from your configuration."

In simple words, instead of running a bunch of `docker container run` commands one after another, you describe your entire application in a single YAML file and let Compose handle the rest. It creates the networks, creates the volumes, builds the images, and starts the containers -- all in one go.

Although Compose works in all environments, it's more focused on development and testing. Using Compose on a production environment is not recommended at all.

## Compose basics

If you've been following Docker development over the years, you may have come across the old `docker-compose` command \(with a hyphen\). That was a separate Python binary that you had to install alongside Docker. It's now considered legacy.

Starting with Docker Desktop 3.4 and Docker Engine 20.10, Compose has been rewritten in Go and ships as a built-in plugin. The new command is `docker compose` \(with a space, no hyphen\). This is what we call **Compose v2**, and it's what you should be using going forward.

Throughout this chapter, every command will use `docker compose` with a space. If you see tutorials or blog posts using the hyphenated `docker-compose`, know that those are using the legacy tool. The commands are almost identical, but I would suggest you stick with the v2 syntax.

You can verify that Compose v2 is available on your system by running the following command:

```text
docker compose version

# Docker Compose version v2.32.4
```

If you see a version number, you're good to go. The exact version may differ on your machine, but anything v2 or above will work for this chapter.

## The compose.yaml file

Just like the Docker daemon uses a `Dockerfile` for building images, Docker Compose uses a YAML file to read service definitions from. The default file name is `compose.yaml`. You may also see `docker-compose.yaml` or `docker-compose.yml` in older projects -- Compose will recognize those too, but the modern convention is simply `compose.yaml`.

In the world of Compose, each container that makes up the application is known as a **service**. The first step to composing a multi-container project is to define these services inside a `compose.yaml` file.

We'll use the `notes-api-node` project from the repository that came with this book. If you've been following along, you already know this project has two containers:

- `db` -- A database server powered by PostgreSQL.
- `api` -- A REST API powered by Node.js.

Head to the `notes-api-node` directory and create a new `compose.yaml` file. Put the following code into the newly created file:

```text
services:
  db:
    image: postgres:16
    container_name: notes-db-dev
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: notesdb
      POSTGRES_PASSWORD: secret
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    image: notes-api:dev
    container_name: notes-api-dev
    environment:
      DB_HOST: db
      DB_DATABASE: notesdb
      DB_PASSWORD: secret
    ports:
      - 3000:3000
    depends_on:
      - db

volumes:
  db-data:
    name: notes-db-dev-data
```

Keep in mind that there is no `version` key at the top of this file. Older Compose files used to start with something like `version: "3.8"` but Compose v2 no longer requires it. If you include it, Compose will simply ignore it and print a warning. So just leave it out.

Now let me walk through the structure of this file. Blocks in a YAML file are defined by indentation. I will go through each of the blocks and explain what they do.

- The `services` block holds the definitions for each of the services or containers in the application. `db` and `api` are the two services that comprise this project.
- The `db` block defines a new service in the application and holds the necessary information to start the container. Every service requires either a pre-built image or a `Dockerfile` to run a container. For the `db` service we're using the official PostgreSQL image.
- Unlike the `db` service, a pre-built image for the `api` service doesn't exist. Hence, we use the `Dockerfile` from the `./api` directory.
- The `volumes` block at the bottom defines any named volume needed by any of the services. At the moment it only enlists `db-data` used by the `db` service.

Now that we have a high level overview of the `compose.yaml` file, lets have a closer look at the individual services.

Definition code for the `db` service is as follows:

```text
db:
  image: postgres:16
  container_name: notes-db-dev
  volumes:
    - db-data:/var/lib/postgresql/data
  environment:
    POSTGRES_DB: notesdb
    POSTGRES_PASSWORD: secret
```

- `image` holds the image repository and tag used for this container. We're using the `postgres:16` image for running the database container.
- `container_name` indicates the name of the container. By default containers are named following the `<project directory name>-<service name>-<instance number>` syntax. You can override that using `container_name`.
- `volumes` holds the volume mappings for the service and supports named volumes, anonymous volumes, and bind mounts. The syntax `<source>:<destination>` is identical to what you've seen before.
- `environment` holds the values of the various environment variables needed for the service. `POSTGRES_DB` sets the name of the default database and `POSTGRES_PASSWORD` sets the password for the `postgres` user.

Definition code for the `api` service is as follows:

```text
api:
  build:
    context: ./api
    dockerfile: Dockerfile
  image: notes-api:dev
  container_name: notes-api-dev
  environment:
    DB_HOST: db
    DB_DATABASE: notesdb
    DB_PASSWORD: secret
  ports:
    - 3000:3000
  depends_on:
    - db
```

- The `api` service doesn't come with a pre-built image. Instead what it has is a build configuration. Under the `build` block we define the context and the name of the Dockerfile for building an image. You should have an understanding of context and Dockerfile by now so I won't spend time explaining those.
- `image` holds the name of the image to be built. If not assigned, the image will be named following the `<project directory name>-<service name>` syntax.
- Inside the `environment` map, the `DB_HOST` variable is set to `db` which is the name of the database service. I'll explain why this works in the next sub-section.
- `ports` defines the port mapping. The syntax `<host port>:<container port>` is identical to the `--publish` option you used before.
- `depends_on` tells Compose that the `api` service depends on the `db` service. Hence, Compose will start the `db` container before starting the `api` container. Keep in mind though, this only controls startup order -- it does not wait for the database to be "ready" before starting the API. For that you'd need a health check, which is a topic for another time.

Finally, code for the `volumes` block is as follows:

```text
volumes:
  db-data:
    name: notes-db-dev-data
```

Any named volume used in any of the services has to be defined here. If you don't define a name, the volume will be named following the `<project directory name>_<volume key>` syntax and the key here is `db-data`. You can learn about the different options for volume configuration in the [official docs](https://docs.docker.com/compose/how-tos/use-volumes/).

## Automatic networking

You may have noticed that there is no network definition anywhere in the `compose.yaml` file. Yet I claimed that the `api` service can reach the `db` service by using `db` as the hostname. How does that work?

Well, Compose has a helpful feature that automatically creates a bridge network for the project and attaches all services to that network. The network is named based on the project directory -- so if your `compose.yaml` file lives inside a directory called `notes-api-node`, the network will be called `notes-api-node_default`.

Since all services are on the same bridge network, they can communicate with each other using service names as hostnames. That is exactly why `DB_HOST: db` works -- the `api` container resolves `db` to the IP address of the database container through Docker's built-in DNS. This is the same user-defined bridge network behavior you learned about in the previous chapter, except Compose sets it up for you automatically.

If you need more control -- for example, isolating front-end services from back-end services on separate networks -- you can define custom networks in the `compose.yaml` file. But for most development setups, the default network is all you need.

## Starting services

There are a few ways of starting services defined in a YAML file. The first command that you'll learn about is the `up` command. The `up` command builds any missing images, creates containers, and starts them in one go.

Before you execute the command though, make sure you've opened your terminal in the same directory where the `compose.yaml` file is. This is very important for every `docker compose` command you execute.

The generic syntax for the `up` command is as follows:

```text
docker compose up --detach
```

Go ahead and execute the command:

```text
docker compose up --detach

# [+] Running 4/4
#  ✔ Network notes-api-node_default  Created
#  ✔ Volume "notes-db-dev-data"      Created
#  ✔ Container notes-db-dev          Started
#  ✔ Container notes-api-dev         Started
```

As you can see, Compose created the default network, the named volume, and both containers in one shot. The `--detach` or `-d` option here functions the same as the one you've seen before -- it runs the containers in the background so you get your terminal back.

If the image for a service needs to be built \(like our `api` service\), Compose will build it automatically the first time. However, if you make changes to the Dockerfile or the application code and want to force a rebuild, you can pass the `--build` flag:

```text
docker compose up --detach --build
```

This tells Compose to rebuild the images before starting the containers. I would suggest using `--build` whenever you've made changes to your code or Dockerfile, just to be safe.

## Listing services

Although service containers started by Compose can be listed using the `docker container ls` command, there is the `ps` command for listing only the containers defined in the YAML file.

```text
docker compose ps

# NAME             IMAGE            COMMAND                  SERVICE   CREATED          STATUS          PORTS
# notes-api-dev    notes-api:dev    "docker-entrypoint.s…"   api       30 seconds ago   Up 29 seconds   0.0.0.0:3000->3000/tcp
# notes-db-dev     postgres:16      "docker-entrypoint.s…"   db        30 seconds ago   Up 29 seconds   5432/tcp
```

This is handy when you have a lot of containers running on your system and you only want to see the ones belonging to the current project.

## Executing commands inside a running service

I hope you remember from the previous chapters that you have to run some migration scripts to create the database tables for this API. Just like the `docker container exec` command, there is an `exec` command for `docker compose`. The generic syntax for the command is as follows:

```text
docker compose exec <service name> <command>
```

To execute the `npm run db:migrate` command inside the `api` service, you can execute the following command:

```text
docker compose exec api npm run db:migrate

# > notes-api@ db:migrate /app
# > knex migrate:latest
#
# Using environment: development
# Batch 1 run: 1 migrations
```

Unlike the `docker container exec` command, you don't need to pass the `-it` flag for interactive sessions. `docker compose` does that automatically.

## Accessing logs from a running service

You can also use the `logs` command to retrieve logs from a running service. The generic syntax for the command is as follows:

```text
docker compose logs <service name>
```

To access the logs from the `api` service, execute the following command:

```text
docker compose logs api

# notes-api-dev  | app running -> http://0.0.0.0:3000
```

This is just a portion of the log output. You can hook into the output stream of the service and get the logs in real-time by using the `-f` or `--follow` option. Any later log will show up instantly in the terminal as long as you don't exit by pressing `ctrl + c` or closing the window. The container will keep running even if you exit out of the log window.

If you want to see the logs for all services at once, just omit the service name:

```text
docker compose logs --follow
```

This will interleave the output from all running services, with each line prefixed by the container name so you can tell them apart.

## Stopping and removing services

For stopping services, there are two approaches that you can take. The first one is the `down` command. The `down` command stops all running containers and removes them from the system. It also removes the default network that Compose created:

```text
docker compose down

# [+] Running 3/3
#  ✔ Container notes-api-dev          Removed
#  ✔ Container notes-db-dev           Removed
#  ✔ Network notes-api-node_default   Removed
```

As you can see, the containers and the network were removed. However, the named volume `notes-db-dev-data` was left intact. This is by design -- you usually don't want to lose your database data every time you stop the project.

If you do want to remove the named volumes as well \(for example, to start with a clean database\), pass the `--volumes` flag:

```text
docker compose down --volumes

# [+] Running 4/4
#  ✔ Container notes-api-dev          Removed
#  ✔ Container notes-db-dev           Removed
#  ✔ Network notes-api-node_default   Removed
#  ✔ Volume notes-db-dev-data         Removed
```

You can learn about additional options for the `down` command in the [official docs](https://docs.docker.com/reference/cli/docker/compose/down/).

## Start vs up

Another command for starting services is the `start` command. The main difference between `up` and `start` is that `start` doesn't create missing containers -- it only starts existing ones that were previously stopped. It's basically the same as the `docker container start` command.

So the workflow is: you use `docker compose up` to create and start everything the first time \(or after a `down`\). If you later stop the services with `docker compose stop`, you can bring them back with `docker compose start` without recreating anything.

In practice, I find myself using `up --detach` almost exclusively. It handles both cases -- creating containers if they don't exist, and starting them if they do. Hence, `start` is not a command you'll reach for very often, but it's good to know it exists.

That wraps up the essentials of Docker Compose. You now know how to define services, start them, execute commands, view logs, and tear everything down. In the next chapter, we'll put this knowledge to use by composing a full-stack application with a front-end, back-end, and database all working together.
