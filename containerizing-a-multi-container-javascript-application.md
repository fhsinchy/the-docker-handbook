# Containerizing a Multi-container JavaScript Application

Now that you've learned enough about networks in Docker, in this sub-section you'll learn to containerize a full-fledged multi-container project. The project you'll be working with is a simple `notes-api` powered by Express.js and PostgreSQL.

In this project there are two containers in total that you'll have to connect using a network. Apart from this, you'll also learn about concepts like environment variables and named volumes. So without further ado, lets jump right in.

## Running the Database Server

The database server in this project is a simple PostgreSQL server and uses the official [postgres](https://hub.docker.com/_/postgres) image. According to the official docs, in order to run a container with this image, you must provide the `POSTGRES_PASSWORD` environment variable. Apart from this one, I'll also provide a name for the default database using the `POSTGRES_DB` environment variable. PostgreSQL by default listens on `5432` port so you need to publish that as well.

To run the database server you can execute the following command:

```text
docker container run --detach --name=notes-api-db --env POSTGRES_DB=notesdb --env POSTGRES_PASSWORD=secret postgres:12

# a7b287d34d96c8e81a63949c57b83d7c1d71b5660c87f5172f074bd1606196dc

docker container ls

# CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS      NAMES
# a7b287d34d96   postgres:12   "docker-entrypoint.s…"   About a minute ago   Up About a minute   5432/tcp   notes-api-db
```

The `--env` option for the `container run` and `container create` commands can be used for providing environment variables to a container. As you can see, the database container has been created successfully and is running now.

Although the container is running, there is a small problem. Databases like PostgreSQL, MongoDB, MySQL persist their data in a directory. PostgreSQL uses the `/var/lib/postgresql/data` directory inside the container to persist data. Now what if the container gets destroyed for some reason? You'll lose all your data. To solve this problem, a named volume can be used.

## Working With Named Volumes

Previously you've worked with bind mounts and anonymous volumes. A named volume is very similar to an anonymous volume except the fact that you can refer to a named volume using its name. Volumes are also logical objects in Docker and can be manipulated using the CLI. The `volume create` command can be used for creating a named volume.

Generic syntax for the command is as follows:

```text
docker volume create <volume name>
```

To create a volume named `notes-api-db-data` you can execute the following command:

```text
docker volume create notes-api-db-data

# notes-api-db-data

docker volume ls

# DRIVER    VOLUME NAME
# local     notes-api-db-data
```

This volume can now be mounted as `/var/lib/postgresql/data` directory inside the `notes-api-db` container. To do so, stop and remove the `notes-api-db` container:

```text
docker container stop notes-api-db

# notes-api-db

docker container rm notes-api-db

# notes-api-db
```

Now run a new container and assign the volume using the `--volume` or `-v` option.

```text
docker container run --detach --volume notes-api-db-data:/var/lib/postgresql/data --name=notes-api-db --env POSTGRES_DB=notesdb --env POSTGRES_PASSWORD=secret postgres:12

# 37755e86d62794ed3e67c19d0cd1eba431e26ab56099b92a3456908c1d346791
```

Now inspect the `notes-api-db` container to make sure that the mounting was succesful:

```text
docker container inspect --format='{{range .Mounts}} {{ .Name }} {{end}}' notes-api-db

#  notes-api-db-data
```

Now the data will safely stored inside the `notes-api-db-data` volume and can be reused in the future. A bind mount can also be used instead of a named volume here but I prefer a named volume in such scenarios.

## Accessing Logs From a Container

In order to see the logs from a container, you can use the `container logs` command. Generic syntax for the command is as follows:

```text
docker container logs <container identifier>
```

To access the logs from the `notes-api-db` container, you can execute the following commnad:

```text
docker container logs notes-api-db

# The files belonging to this database system will be owned by user "postgres".
# This user must also own the server process.

# The database cluster will be initialized with locale "en_US.utf8".
# The default database encoding has accordingly been set to "UTF8".
# The default text search configuration will be set to "english".

# Data page checksums are disabled.

# fixing permissions on existing directory /var/lib/postgresql/data ... ok
# creating subdirectories ... ok
# selecting dynamic shared memory implementation ... posix
# selecting default max_connections ... 100
# selecting default shared_buffers ... 128MB
# selecting default time zone ... Etc/UTC
# creating configuration files ... ok
# running bootstrap script ... ok
# performing post-bootstrap initialization ... ok
# syncing data to disk ... ok


# Success. You can now start the database server using:

#     pg_ctl -D /var/lib/postgresql/data -l logfile start

# initdb: warning: enabling "trust" authentication for local connections
# You can change this by editing pg_hba.conf or using the option -A, or
# --auth-local and --auth-host, the next time you run initdb.
# waiting for server to start....2021-01-25 13:39:21.613 UTC [47] LOG:  starting PostgreSQL 12.5 (Debian 12.5-1.pgdg100+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 8.3.0-6) 8.3.0, 64-bit
# 2021-01-25 13:39:21.621 UTC [47] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
# 2021-01-25 13:39:21.675 UTC [48] LOG:  database system was shut down at 2021-01-25 13:39:21 UTC
# 2021-01-25 13:39:21.685 UTC [47] LOG:  database system is ready to accept connections
#  done
# server started
# CREATE DATABASE


# /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*

# 2021-01-25 13:39:22.008 UTC [47] LOG:  received fast shutdown request
# waiting for server to shut down....2021-01-25 13:39:22.015 UTC [47] LOG:  aborting any active transactions
# 2021-01-25 13:39:22.017 UTC [47] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
# 2021-01-25 13:39:22.017 UTC [49] LOG:  shutting down
# 2021-01-25 13:39:22.056 UTC [47] LOG:  database system is shut down
#  done
# server stopped

# PostgreSQL init process complete; ready for start up.

# 2021-01-25 13:39:22.135 UTC [1] LOG:  starting PostgreSQL 12.5 (Debian 12.5-1.pgdg100+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 8.3.0-6) 8.3.0, 64-bit
# 2021-01-25 13:39:22.136 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
# 2021-01-25 13:39:22.136 UTC [1] LOG:  listening on IPv6 address "::", port 5432
# 2021-01-25 13:39:22.147 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
# 2021-01-25 13:39:22.177 UTC [75] LOG:  database system was shut down at 2021-01-25 13:39:22 UTC
# 2021-01-25 13:39:22.190 UTC [1] LOG:  database system is ready to accept connections
```

Evident by the text in line 57, the database is up and ready for accepting connections from the outside. There is also the `--follow` or `-f` option for the command which lets you attach the console to the logs output and get a continuous stream of text.

## Creating a Network and Attaching the Database Server

As you've learned in the previous section, the containers have to be attached to a user-defined bridge network in order to communicate with each other using container names. To do so, create a network named `notes-api-network` in your system:

```text
docker network create notes-api-network
```

Now attach the `notes-api-db` container to this network by executing the following command:

```text
docker network connect notes-ap-network notes-api-db
```

Now the database server is complete ready to be bugged by the API.

