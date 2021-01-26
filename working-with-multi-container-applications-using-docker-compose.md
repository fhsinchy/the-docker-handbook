# Composing Projects Using Docker-Compose

In the previous section, you've learned about managing a multi-container project and the difficulties of it. Instead of writing so many commands, there is an easier to manage multi-container projects, a tool called [Docker Compose](https://docs.docker.com/compose/).

According to the Docker [documentation](https://docs.docker.com/compose/),

> “Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.”

Although Compose works in all environments, it's more focused on development and testing. Using Compose on a production environment is not recommended at all.

## Compose Basics

In the last section, I told that you'll be working with the `Dockerfile.dev` file later. Well now is the time. Lets begin by taking a look at the `Dockerfile.dev` file itself:

```text
# stage one
FROM node:lts-alpine as builder

# install dependencies for node-gyp
RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
RUN npm install

# stage two
FROM node:lts-alpine

ENV NODE_ENV=development

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=builder /app/node_modules /home/node/app/node_modules

CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
```

The code is almost identical to the `Dockerfile` that you worked with in the previous section. The three differences in this file are as follows:

* On line 10, we run `npm install` instead of `npm run install --only=prod` because we want the development dependencies also.
* On line 15, we set the `NODE_ENV` environment variable to `development` instead of `production`.
* On line 24, we use a tool called [nodemon](https://nodemon.io/) to get hot-reload feature for the API.

You already know that this project has two containers:

* `notes-db` - A database server powered by PostgreSQL.
* `notes-api` - A REST API powered by Express.js

In the world of compose, each container that makes up the application is known as a service and the first step to composing a multi-container project is to define these services.

Just like the Docker daemon uses a `Dockerfile` for building images, Docker Compose uses `docker-compose.yaml` file to read service definitions from.

Head over to the `notes-api` directory, create a new file called `docker-compose.yaml` and put following code in there:

```text

```

Using Compose is basically a three-step process:

1. Define your app’s environment with a `Dockerfile` so it can be reproduced anywhere.
2. Define the services that make up your application in a YAML file so they can be run together in an isolated environment.
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
        container_name: notes-db-dev
        volumes: 
            - notes-db-dev-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
    api:
        build:
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        environment: 
            DB_HOST: db ## same as the database service name
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        volumes: 
            - /home/node/app/node_modules
            - ./api:/home/node/app
        ports: 
            - 3000:3000

volumes:
    notes-db-dev-data:
        name: notes-db-dev-data
```

Every valid `docker-compose.yaml` file starts by defining the file version. At the time of writing, `3.8` is the latest version. You can look up the latest version [here](https://docs.docker.com/compose/compose-file/).

Blocks in an YAML file are defined by indentation. I will go through each of the blocks and will explain what they do.

* The `services` block holds the definitions for each of the services or containers in the application. `db` and `api` are the two services that comprise this project.
* The `db` block defines a new service in the application and holds necessary information to start the container. Every service requires either a pre-built image or a `Dockerfile` to run a container. For the `db` service we're using the official PostgreSQL image.
* Unlike the `db` service, a pre-built image for the `api` service doesn't exist. Hence, we use the `Dockerfile.dev` file.
* The `volumes` block defines any name volume needed by any of the services. At the time it only enlists `notes-db-dev-data` volume used by the `db` service.

Now that have a high level overview of the `docker-compose.yaml` file, lets have a closer look at the individual services.

Definition code for the `db` service is as follows:

```text
db:
    image: postgres:12
    container_name: notes-db-dev
    volumes: 
        - db-data:/var/lib/postgresql/data
    environment:
        POSTGRES_DB: notesdb
        POSTGRES_PASSWORD: secret
```

* The `image` key holds the image repository and tag used for this container. We're using the `postgres:12` image for running the database container.
* The `container_name` indicates the name of the container. By default containers are named following `<project directory name>_<service name>` syntax. You can override that using `container_name`.
* The `volumes` array holds the volume mappings for the service and supports named volumes, anonymous volumes, bind mounts. The syntax `<source>:<destination>` is identical to what you've seen before. 
* The `environment` map holds the values of the various environment variables needed for the service.

Definition code for the `api` service is as follows:

```text
api:
    build:
        context: ./api
        dockerfile: Dockerfile.dev
    image: notes-api:dev
    container_name: notes-api-dev
    environment: 
        DB_HOST: db ## same as the database service name
        DB_DATABASE: notesdb
        DB_PASSWORD: secret
    volumes: 
        - /home/node/app/node_modules
        - ./api:/home/node/app
    ports: 
        - 3000:3000
```

* The `api` service doesn't come with a pre-built image instead what it has is a build configuration. Under the `build` block we define the context and the name of the Dockerfile for building an image. You should have a understanding of context and Dockerfile by now so I won't spend time explaining those.
* The `image` key holds the name of the image to be built. If not assigned the image will be named following the `<project directory name>_<service name>` syntax.
* In the `volumes` map, you can see an anonymous volume and a bind mount described. The syntax is identical to what you've seen in previous sections.
* The `ports` map defines any port mapping. The syntax, `<host port>:<container port>` is identical to the `--publish` option you used before.

Finally code for the `volumes` is as follows:

```text
volumes:
    db-data:
        name: notes-db-dev-data
```

Any named volume used in any of the services has to be defined here. If you don't define a name, the volume will be named following the `<project directory name>_<volume key>` and the key here is `db-data`. You can learn about the different options for volume configuration in the official [docs](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes).

## Starting Services

There are a few ways of starting services defined in a YAML file. The first command that you'll learn about is the `up` command. The `up` command builds any missing images, creates containers and starts them in one go:

```text
docker-compose --file docker-compose.yaml up --detach

# Creating network "notes-api_default" with the default driver
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
#
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 197056ec1964
### LONG INSTALLATION STUFF GOES HERE ###
Removing intermediate container 197056ec1964
 ---> 6609935fe50b
Step 3/13 : WORKDIR /app
 ---> Running in 17010f65c5e7
Removing intermediate container 17010f65c5e7
 ---> b10d12e676ad
Step 4/13 : COPY ./package.json .
 ---> 600d31d9362e
Step 5/13 : RUN npm install
 ---> Running in a14afc8c0743
 ### LONG INSTALLATION STUFF GOES HERE ###
#  Removing intermediate container a14afc8c0743
#  ---> 952d5d86e361
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Running in 0d5376a9e78a
# Removing intermediate container 0d5376a9e78a
#  ---> 910c081ce5f5
# Step 8/13 : USER node
#  ---> Running in cfaefceb1eff
# Removing intermediate container cfaefceb1eff
#  ---> 1480176a1058
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Running in 3ae30e6fb8b8
# Removing intermediate container 3ae30e6fb8b8
#  ---> c391cee4b92c
# Step 10/13 : WORKDIR /home/node/app
#  ---> Running in 6aa27f6b50c1
# Removing intermediate container 6aa27f6b50c1
#  ---> 761a7435dbca
# Step 11/13 : COPY . .
#  ---> b5d5c5bdf3a6
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> 9e1a19960420
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Running in 5bdd62236994
# Removing intermediate container 5bdd62236994
#  ---> 548e178f1386
# Successfully built 548e178f1386
# Successfully tagged notes-api:dev
# Creating notes-api-dev ... done
# Creating notes-db-dev  ... done
```

The `--detach` or `-d` option here functions same as the one you've seen before. The `--file` or `-f` option is only needed if the YAML file is note named `docker-compose.yaml` but I've used here for demonstration purpose.

Apart from the the `up` command there is the `start` command. The main difference between these two is the `start` command doesn't create missing containers, only starts existing containers. It's basically same as the `container start` command.

The `--build` option for the `up` command forces a rebuild of the images. There are some other options for the `up` command that you can see on official [docs](https://docs.docker.com/compose/reference/up/).

## Stopping Services

For stopping services, there are two approaches that you can take. The first one is the `down` command. The `down` command stops all running containers and removes them from the system. It also removes any networks:

```text
docker-compose down --volumes

# Stopping notes-api-dev ... done
# Stopping notes-db-dev  ... done
# Removing notes-api-dev ... done
# Removing notes-db-dev  ... done
# Removing network notes-api_default
# Removing volume notes-db-dev-data
```

The `--volumes` option indicates that you want to remove any named volume defined in the `volumes` block.

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

