# Managing Multi-Container Projects using Docker-Compose

So far we've only worked with applications that are comprised of only one container.

Now assume an application with multiple containers. Maybe an API that requires a database service to work properly, or maybe a full-stack application where you have to work with an back-end API and a front-end application together.

In this section, you'll learn about working with such applications using a tool called [Docker Compose](https://docs.docker.com/compose/).

According to the Docker [documentation](https://docs.docker.com/compose/),

> “Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.”

Although Compose works in all environments, it's more focused on development and testing. Using Compose on a production environment is not recommended at all.

## Compose Basics

If you've cloned the project code repository, then go inside the `notes-api` directory. This is a simple CRUD API where you can create, read, update, and delete notes. The application uses PostgreSQL as its database system.

The project already comes with a `Dockerfile.dev` file. Content of the file is as follows:

```text
FROM node:lts

WORKDIR /usr/app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

Just like the ones we've written in the previous section. We're copying the `package.json` file, installing the dependencies, copying the project files and starting the development server by executing `npm run dev`.

Using Compose is basically a three-step process:

1. Define your app’s environment with a `Dockerfile` so it can be reproduced anywhere.
2. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.
3. Run `docker-compose up` and Compose starts and runs your entire app.

Services are basically containers with some additional stuff. Before we start writing your first YML file together, let's list out the services needed to run this application. There are only two:

1. `api` - an Express application container run using the `Dockerfile.dev` file in the project root.
2. `db` - a PostgreSQL instance, run using the official [postgres](https://hub.docker.com/_/postgres) image.

Create a new `docker-compose.yml` file in the project root and let's define your first service together. You can use `.yml` or `.yaml` extension. Both work just fine. We'll write the code first and then I'll break down the code line-by-line. Code for the `db` service is as follows:

```text
version: "3.8"

services: 
    db:
        image: postgres:12
        volumes: 
            - ./docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
        environment:
            POSTGRES_PASSWORD: 63eaQB9wtLqmNBpg
            POSTGRES_DB: notesdb
```

Every valid `docker-compose.yml` file starts by defining the file version. At the time of writing, `3.8` is the latest version. You can look up the latest version [here](https://docs.docker.com/compose/compose-file/).

Blocks in an YML file are defined by indentation. I will go through each of the blocks and will explain what they do.

The `services` block holds the definitions for each of the services or containers in the application. `db` is a service inside the services block.

The `db` block defines a new service in the application and holds necessary information to start the container. Every service requires either a pre-built image or a Dockerfile to run a container. For the `db` service we're using the official PostgreSQL image.

The `docker-entrypoint-initdb.d` directory in the project root contains a SQL file for setting up the database tables. This directory is for keeping initialization scripts. There isn't a way to copy directories inside a `docker-compose.yml` file, that's why we have to use a volume.

The environment block holds environment variables. List of the valid environment variables can be found on the [postgres image page](https://hub.docker.com/_/postgres) on Docker Hub. The `POSTGRES_PASSWORD` variable sets the default password for the server and `POSTGRES_DB`  creates a new database with the given name.

Now let's add the `api` service. Append following code to the file. Be very careful to match the indentation with the `db` service:

```text
    ##
    ## make sure to align the indentation properly
    ##
    
    api:
        build:
            context: .
            dockerfile: Dockerfile.dev
        volumes: 
            - /usr/app/node_modules
            - ./:/usr/app
        ports: 
            - 3000:3000
        environment: 
            DB_CONNECTION: pg
            DB_HOST: db ## same as the database service name
            DB_PORT: 5432
            DB_USER: postgres
            DB_DATABASE: notesdb
            DB_PASSWORD: 63eaQB9wtLqmNBpg
```

We don't have a pre-built image for the `api` service, but we have a `Dockerfile.dev` file. The `build` block defines the build's `context` and the `filename` of the Dockerfile to use. If the file is named just `Dockerfile` then the `filename` is unnecessary.

Mapping of the volumes is identical to what you've seen in the previous section. One anonymous volume for the `node_modules` directory and one named volume for the project root.

Port mapping also works in the same way as the previous section. The syntax is `<host system port>:<container port>`. We're mapping the port 3000 from the container to port 3000 of the host system.

In the `environment` block, we're defining the information necessary to setup the database connection. The application uses [Knex.js](https://www.freecodecamp.org/news/p/3212b0d0-7db7-483d-b4ee-60218503cac8/knexjs.org/) as an ORM which requires these information to connect to the database.

`DB_PORT: 5432` and `DB_USER: postgres` is default for any PostgreSQL server. `DB_DATABASE: notesdb` and `DB_PASSWORD: 63eaQB9wtLqmNBpg` needs to match the values from the `db` service. `DB_CONNECTION: pg` indicates to the ORM that we're using PostgreSQL.

Any service defined in the `docker-compose.yml` file can be used as a host by using the service name. So the `api` service can actually connect to the `db` service by treating that as a host instead of a value like `127.0.0.1`. That's why we're setting the value of `DB_HOST` to `db`.

Now that the `docker-compose.yml` file is complete it's time for us to start the application. The Compose application can be accessed using a CLI tool called `dokcer-compose`. `docker-compose` CLI for Compose is what `docker` CLI is for Docker. To start the services, execute the following command:

```text
docker compose up
```

Executing the command will go through the `docker-compose.yml` file, create containers for each of the services and start them. Go ahead and execute the command. The startup process may take some time depending on the number of services.

Once done, you should see the logs coming in from all the services in your terminal window:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-3.14.17-PM.png)

The application should be running on `http://127.0.0.1:3000` address and upon visiting, you should see a JSON response as follows:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-3.15.50-PM.png)

The API has full CRUD functionalities implemented. If you want to know about the end-points go look at the `/tests/e2e/api/routes/notes.test.js` file.

The `up` command builds the images for the services automatically if they don't exist. If you want to force a rebuild of the images, you can use the `--build` option with the `up` command. You can stop the services by closing the terminal window or by hitting the `ctrl + c` key combination.

## Running Services in Detached Mode

As I've already mentioned, services are containers and like any other container, services can be run in the background. To run services in detached mode you can use the the `-d` or `--detach` option with the `up` command.

To start the current application in detached mode, execute the following command:

```text
docker-compose up -d
```

This time you shouldn't see the long wall of text that you saw in the previous sub-section.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-4.40.37-PM.png)

You should still be able to access the API at the `http://127.0.0.1:3000` address.

## Listing Services

Just like the `docker ps` command, Compose has a `ps` command of its own. The main difference is the `docker-compose ps` command only lists containers part of a certain application. To list all the containers running as part of the `notes-api` application, run the following command in the project root:

```text
docker-compose ps
```

Running the command inside the project directory is important. Otherwise it won't execute. Output from the command should be as follows:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-4.47.58-PM.png)

The `ps` command for Compose shows services in any state by default. Usage of an option like `-a` or `--all` is unnecessary.

## Executing Commands Inside a Running Service

Assume that our `notes-api` application is running and you want to access the `psql` CLI application inside the `db` service. There is a command called `exec` to do that. Generic syntax for the command is as follows:

```text
docker-compose exec <service name> <command>
```

Service names can be found in the `docker-compose.yml` file. The generic syntax for starting the `psql` CLI application is as follows:

```text
psql <database> <username>
```

Now to start the `psql` application inside the `db` service where the database name is `notesdb` and the user is `psql`, the following command should be executed:

```text
docker-compose exec db psql notesdb postgres
```

You should directly land on the `psql` application:![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-5.29.07-PM.png)Output from `docker-compose exec db psql notesdb postgres` command

You can run any valid [postgres command](https://www.postgresql.org/docs/10/app-psql.html) here. To exit out of the program write `\q` and hit enter.

## Starting Shell Inside a Running Service

You can also start a shell inside a running container using the `exec` command. Generic syntax of the command should be as follows:

```text
docker-compose exec <service name> sh
```

You can use `bash` in place of `sh` if the container comes with that. To start a shell inside the `api` service, the command should be as follows:

```text
docker-compose exec api sh
```

This should land you directly on the shell inside the `api` service.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-5.41.11-PM.png)

In there, you can execute any valid shell command. You can exit by executing the `exit` command.

#### Accessing Logs From a Running Service <a id="accessing-logs-from-a-running-service"></a>

If you want to view logs from a container, the dashboard can be really helpful.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-5.48.38-PM.png)

You can also use the `logs` command to retrieve logs from a running service. The generic syntax for the command is as follows:

```text
docker-compose logs <service name>
```

To access the logs from the `api` service execute the following command:

```text
docker-compose logs api
```

You should see a wall of text appear on your terminal window.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-6.13.39-PM.png)

This is just a portion from the log output. You can kind of hook into the output stream of the service and get the logs in real-time by using the `-f` or `--follow` option. Any later log will show up instantly in the terminal as long as you don't exit by pressing `ctrl + c` key combination or closing the window. The container will keep running even if you exit out of the log window.

## Stopping Running Services

Services running in the foreground can be stopped by closing the terminal window or hitting the `ctrl + c` key combination. For stopping services in in the background, there are a number of commands available. I'll explain each of them one by one.

* `docker-compose stop` - attempts to stop the running services gracefully by sending a `SIGTERM` signal to them. If the services don't stop within a grace period, a `SIGKILL` signal is sent.
* `docker-compose kill` - stops the running services immediately by sending a `SIGKILL` signal. A `SIGKILL` signal can not be ignored by a recipient.
* `docker-compose down` - attempts to stop the running services gracefully by sending a `SIGTERM` signal and removes the containers afterwards.

If you want to keep the containers for the services you can use the `stop` command. If you want to removes the containers as well use the `down` command.

## Composing a Full-stack Application

In this sub-section, we'll be adding a front-end application to our notes API and turn it into a complete application. I won't be explaining any of the `Dockerfile.dev` files in this sub-section \(except the one for the `nginx` service\) as they are identical to some of the others you've already seen in previous sub-sections.

If you've cloned the project code repository, then go inside the `fullstack-notes-application` directory. Each directory inside the project root contains the code for each services and the corresponding Dockerfile.

Before we start with the `docker-compose.yml` file let's look at a diagram of how the application is going to work:

![](https://www.freecodecamp.org/news/content/images/2020/07/ng.svg)

Instead of accepting requests directly like we previously did, in this application, all the requests will be first received by a Nginx server. Nginx will then see if the requested end-point has `/api` in it. If yes, Nginx will route the request to the back-end or if not, Nginx will route the request to the front-end.

The reason behind doing this is that when you run a front-end application it doesn't run inside a container. It runs on the browser, served from a container. As a result, Compose networking doesn't work as expected and the front-end application fails to find the `api` service.

Nginx on the other hand runs inside a container and can communicate with the different services across the entire application.

I will not get into the configuration of Nginx here. That topic is kinda out of scope of this article. But if you want to have a look at it, go ahead and checkout the `/nginx/default.conf` file. Code for the `/nginx/Dockerfile.dev` for the is as follows:

```text
FROM nginx:stable

COPY ./default.conf /etc/nginx/conf.d/default.conf
```

All it does is just copying the configuration file to `/etc/nginx/conf.d/default.conf` inside the container.

Let's start writing the `docker-compose.yml` file by defining the services you're already familiar with. The `db` and `api` service. Create the `docker-compose.yml` file in the project root and put following code in there:

```text
version: "3.8"

services: 
    db:
        image: postgres:12
        volumes: 
            - ./docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
        environment:
            POSTGRES_PASSWORD: 63eaQB9wtLqmNBpg
            POSTGRES_DB: notesdb
    api:
        build: 
            context: ./api
            dockerfile: Dockerfile.dev
        volumes: 
            - /usr/app/node_modules
            - ./api:/usr/app
        environment: 
            DB_CONNECTION: pg
            DB_HOST: db ## same as the database service name
            DB_PORT: 5432
            DB_USER: postgres
            DB_DATABASE: notesdb
            DB_PASSWORD: 63eaQB9wtLqmNBpg
```

As you can see, these two services are almost identical to the previous sub-section, the only difference is the `context` of the `api` service. That's because codes for that application now resides inside a dedicated directory named `api`. Also, there is no port mapping as we don't want to expose the service directly.

The next service we're going to define is the `client` service. Append following bit of code to the compose file:

```text
    ##
    ## make sure to align the indentation properly
    ##
    
    client:
        build:
            context: ./client
            dockerfile: Dockerfile.dev
        volumes: 
            - /usr/app/node_modules
            - ./client:/usr/app
        environment: 
            VUE_APP_API_URL: /api
```

We're naming the service `client`. Inside the `build` block, we're setting the `/client` directory as the `context` and giving it the Dockerfile name.

Mapping of the volumes is identical to what you've seen in the previous section. One anonymous volume for the `node_modules` directory and one named volume for the project root.

Value of the `VUE_APP_API_URL` variable inside the `environtment` will be appended to each request that goes from the `client` to the `api` service. This way, Nginx will be able to differentiate between different requests and will be able to re-route them properly.

Just like the `api` service, there is no port mapping here, because we don't want to expose this service either.

Last service in the application is the `nginx` service. To define that, append following code to the compose file:

```text
    ##
    ## make sure to align the indentation properly
    ##
    
    nginx:
        build:
            context: ./nginx
            dockerfile: Dockerfile.dev
        ports: 
            - 80:80
```

Content of the `Dockerfile.dev` has already been talked about. We're naming the service `nginx`. Inside the `build` block, we're setting the `/nginx` directory as the `context` and giving it the Dockerfile name.

As I've already shown in the diagram, this `nginx` service is going to handle all the requests. So we have to expose it. Nginx runs on port 80 by default. So I'm mapping port 80 inside the container to port 80 of the host system.

We're done with the full `docker-compose.yml` file and now it's time to run the service. Start all the services by executing following command:

```text
docker-compose up
```

Now visit `http://localhost:80` and voilà!

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-8.23.46-PM-1.png)

Try adding and deleting notes to see if the application works properly or not. Multi-container applications can be a lot more complicated than this, but for this article, this is enough.

