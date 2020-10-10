# Manipulating Containers

In the previous sections, you've learned about the building blocks of Docker and have also run a container using the `docker run` command. In this section, you'll be learning about container manipulation in a lot more detail. Given container manipulation is one of the most common task you'll be performing every single day, having a proper understanding of the various commands is absolutely crucial.

Keep in mind though, this is not an exhaustive list of all the commands you can execute on Docker. I'll be talking only about the most common ones. Anytime you want to learn more about the available commands, just visit the official [reference](https://docs.docker.com/engine/reference/commandline/container/) for the Docker CLI.

## Running Containers

In the previous section, you've used `docker run` to create and start a container using the `hello-world` image. The generic syntax for this command is:

```text
docker run <image name>
```

Although this is a perfectly valid command, there is a better way of dispatching commands to the `docker` client. Prior to version `1.13`, Docker had only the command previously mentioned command syntax. Later on the CLI was [restructured](https://www.docker.com/blog/whats-new-in-docker-1-13/) to have the following syntax:

```text
docker <command> <sub-command> <options>
```

Where command is a logical docker object i.e. `container` and the sub-command is what was previously regarded as a command i.e. `run`. Following this syntax, the `docker run` command will be as follows:

```text
docker container run <image name>
```

This is much more expressive and organized compared to the previously shown syntax. Throughout the rest of the article, I'll be following this syntax.

In the `run` command, the `image name` can be any of image from an online registry or your local machine and `<options>` can be any valid parameter that changes the way the container runs. As an example, you can try to run a container using the [fhsinchy/hello-dock](https://hub.docker.com/repository/docker/fhsinchy/hello-dock) image. This image contains a simple [Vue.js](https://vuejs.org/) application that runs on port 80 inside the container. To run a container using this image, execute following command on your terminal:

```text
docker container run --publish 8080:80 fhsinchy/hello-dock

# /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
# /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
# 10-listen-on-ipv6-by-default.sh: Getting the checksum of /etc/nginx/conf.d/default.conf
# 10-listen-on-ipv6-by-default.sh: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
# /docker-entrypoint.sh: Configuration complete; ready for start up
```

In this command:

* `container` is the command which is a logical object in the world of Docker.
* `run` is the sub-command which indicates the task that needs to be carried out.
* `--publish` is an option of the `run` command used for publishing port 80 from inside the container to port 8080 of the local network.
* `fhsinchy/hello-dock` is the mage name.

Now in order to access the application, open up your browser and visit `http://127.0.0.1:8080` address.

![](.gitbook/assets/hello-dock.png)

The container can be stopped by simply hitting `ctrl + c` key combination while the terminal window is in focus or closing off the terminal window completely.

Another very popular option of the `run` sub-command is the `--detach` command. As you've seen in the example above, in order for the container to keep running, you had to keep the terminal window open. Closing the terminal window also stopped the running container.

This is because by default containers run in the foreground and attach themselves to the terminal like any other normal program invoked from the terminal. In order to override this behavior and keep a container running in background, you can include the `--detach` option to the `run` sub-command as follows:

```text
docker container run --detach --publish 8080:80 fhsinchy/hello-dock

# b6ada76e29c1327b3c4653f7599a30720cd0ae241afc5c868fbfd33fbae24563
```

Unlike the previous example, you won't get a wall of text thrown at you this time. Instead what you'll get is the ID of the newly created container.

The order of the options you provide doesn't really matter. If you put the `--publish` option before the `--detach` option, it'll work just the same. One thing that you have to keep in mind in case of the `run` sub-command is that the image name must come at last. If you put anything after the image name then that'll be passed as an argument to the container itself and may result in unexpected situations.

## Listing Containers

In the previous section you've learned about running containers both in foreground and background. In this section I'll show you how you can list out the containers currently running or has previously run in your system.

The `ls` sub-command can be used to list out containers that are currently running. To do so execute following command:

```text
docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b6ada76e29c1        fhsinchy/hello-dock   "/docker-entrypoint.…"   8 minutes ago       Up 8 minutes        0.0.0.0:8080->80/tcp   wonderful_bose
```

As you can see in the output, a container named `wanderful_bose` is running. In was created `8 minutes ago` and the status is the status is `Up 8 minutes,` which indicates that the container is running fine since it's creation.

The id if the container is `b6ada76e29c1` which is the first 12 characters of the full container id. The full container id is `b6ada76e29c1327b3c4653f7599a30720cd0ae241afc5c868fbfd33fbae24563` which is 64 characters long. This full container id was printed as the output of the `docker container run` command in the previous section.

You can also see that port 8080 from your local network is pointing towards port 80 inside the container. The name `wanderful_bose` is generated by Docker and can be something completely different in your computer.

The `ls` sub-command only lists the containers that are currently running on your system. In order to list out the containers that has run in the past you can use the `--all` option.

```text
docker container ls --all

# CONTAINER ID        IMAGE                                   COMMAND                  CREATED             STATUS                        PORTS                  NAMES
# b6ada76e29c1        fhsinchy/hello-dock                     "/docker-entrypoint.…"   20 minutes ago      Up 20 minutes                 0.0.0.0:8080->80/tcp   wonderful_bose
# 88f876042021        fhsinchy/hello-dock                     "/docker-entrypoint.…"   33 minutes ago      Exited (0) 20 minutes ago                            ecstatic_satoshi
```

As you can see the second `ecstatic_satoshi` was created earlier and has exited with the status code 0, which indicates that no error was produced during the runtime of the container.

## Stopping or Killing a Running Container

Containers running in the foreground can be stopped by simply closing the terminal window or hitting `ctrl + c` key combination. Containers running in the background, however, can not be stopped in the same way.

There are two sub-commands under the `container` command that deals with this task. The first one is the `stop` sub-command. Generic syntax for the sub-command is as follows:

```text
docker container stop <container identifier>
```

Where `container identifier` can either be the id or the name of the container. I hope that you remember the container you started in the previous section. It's still running in the background. Get the identifier for that container using `docker container ls` , I'll be using `b6ada76e29c1` identifier, which is the container id in my case. Now execute following command to stop the container:

```text
docker container stop b6ada76e29c1

# b6ada76e29c1
```

If you use the name as identifier, you'll get the name thrown back to you as output. The `stop` sub-command shuts down a container gracefully by sending a `SIGTERM` signal. If the container doesn't stop within a grace period, a `SIGKILL` signal is sent which shuts down the container immediately.

In case if you want to send a `SIGKILL` signal instead of a `SIGTERM` signal, you may use the `kill` sub-command instead. The `kill` sub-command follows the same syntax as the `stop` sub-command.

## Restarting Containers

When I say restart I mean two scenarios specifically. They are as follows:

* Restarting a container that has been previously stopped or killed.
* Rebooting a running container.

As you've already learned from a previous section, stopped containers remain in your system. If you want you can actually restart them. The `start` sub-command can be used any existing container. The syntax of the command is as follows:

```text
docker container start <container identifier>
```

Just like the previous sub-commands, container identifier can be either the name or the id of the container. You can get the list of all stopped container by using the `ls` sub-command with the `--all` option:

```text
docker container ls --all

# CONTAINER ID        IMAGE                                   COMMAND                  CREATED             STATUS                     PORTS               NAMES
# b6ada76e29c1        fhsinchy/hello-dock                     "/docker-entrypoint.…"   2 hours ago         Exited (0) 2 hours ago                         wonderful_bose
# 88f876042021        fhsinchy/hello-dock                     "/docker-entrypoint.…"   2 hours ago         Exited (0) 2 hours ago                         ecstatic_satoshi
```

For a change, I'll be using the container name instead of the id this time. Now to restart the `wonderful_bose` container, you may execute the following command:

```text
docker container start wonderful_bose

# wonderful_bose
```

Now you can ensure that the container is running by looking at the list of running containers using the `ls` sub-command. The `start` command starts any container in detached mode by default and retains any port configurations made previously. So if you visit `http://127.0.0.1:8080` now, you should be able to access the `hello-dock` application just like before.

Now, in scenarios where you would like to reboot a running container you may use the `restart` sub-command. The `restart` sub-command follows the exact syntax as the `start` sub-command.

## Cleaning Up Dangling Containers

Containers that have exited already remain in the system. These dangling or unnecessary containers take up space and can even create issues at later times.

There are a few ways of cleaning up containers. If we want to remove a container specifically, we can use the `rm` command. Generic syntax for this command is as follows:

```text
docker rm <container id>
```

To remove a container with id `e210d4695c51`, execute following command:

```text
docker rm e210d4695c51
```

And you should get the id of the removed container as output. If we want to clean up all Docker objects \(images, containers, networks, build cache\) we can use the following command:

```text
docker system prune
```

Docker will ask for confirmation. We can use the `-f` or `--force` option to skip this confirmation step. The command will show the amount of reclaimed space at the end of its successful execution.

## Running Containers in Interactive Mode

So far we've only run containers built from the hello-world image. The default command for hello-world image is to execute the single [hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c) program that comes with the image.

All images are not that simple. Images can encapsulate an entire operating system inside them. Linux distributions such as [Ubuntu](https://ubuntu.com/), [Fedora](https://fedora.org/), [Debian](https://debian.org/) all have official Docker images available in the hub.

We can run Ubuntu inside a container using the official [ubuntu](https://hub.docker.com/_/ubuntu) image. If we try to run an Ubuntu container by executing `docker run ubuntu` command, we'll see nothing happens. But if we execute the command with `-it` option as follows:

```text
docker run -it ubuntu
```

We should land directly on bash inside the Ubuntu container. In this bash window, we'll be able to do tasks, that we usually do in a regular Ubuntu terminal. I have printed out the OS details by executing the standard `cat /etc/os-release` command:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-7.21.01-PM.png)

The reason behind the necessity of this `-it` option is that the Ubuntu image is configured to start bash upon startup. Bash is an interactive program – that means if we do not type in any commands, bash won't do anything.

To interact with a program that is inside a container, we have to let the container know explicitly that we want an interactive session.

The `-it` option sets the stage for us to interact with any interactive program inside a container. This option is actually two separate options mashed together.

* The `-i` option connects us to the input stream of the container, so that we can send inputs to bash.
* The `-t` option makes sure that we get some good formatting and a native terminal like experience.

We need to use the `-it` option whenever we want to run a container in interactive mode. Executing `docker run -it node` or `docker run -it python` should land us directly on the node or python [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) program.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-2.07.09-AM.png)

We can not run any random container in interactive mode. To be eligible for running in interactive mode, the container has to be configured to start an interactive program on startup. Shells, REPLs, CLIs, and so on are examples of some interactive programs.

## Creating Containers Using Executable Images

Up until now I've been saying that Docker images have a default command that they execute automatically. That's not true for every image. Some images are configured with an entry-point \(`ENTRYPOINT`\) instead of a command \(`CMD`\).

An entry-point allows us to configure a container that will run as an executable. Like any other regular executable, we can pass arguments to these containers. The generic syntax for passing arguments to an executable container is as follows:

```text
docker run <image name> <arguments>
```

The Ubuntu image is an executable, and the entry-point for the image is bash. Arguments passed to an executable container will be passed directly to the entry-point program. That means any argument that we pass to the the Ubuntu image will be passed directly to bash.

To see a list of all directories inside the Ubuntu container, you can pass the `ls` command as an argument.

```text
docker run ubuntu ls
```

 You should get a list of directories like the following:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-11.12.18-PM.png)

Notice that we're not using the `-it` option, because we don't want to interact with bash, we just want the output. We can pass any valid bash command as arguments. Like passing the `pwd` command as an argument will return the present working directory.

The list of valid arguments usually depends on the entry-point program itself. If the container uses the shell as entry-point, any valid shell command can be passed as arguments. If the container uses some other program as the entry-point then the arguments valid for that particular program can be passed to the container.

## Running Containers in Detached Mode

Assume that you want to run a [Redis](https://redis.io/) server on your computer. Redis is a very fast in-memory database system, often used as cache in various applications. We can run a Redis server using the official [redis](https://hub.docker.com/_/redis) image. To do that by execute the following command:

```text
docker run redis
```

It may take a few moments to fetch the image from the hub and then you should see a wall of text appear on your terminal.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-11.41.16-PM.png)

As you can see, the Redis server is running and is ready to accept connections. To keep the server running, you have to keep this terminal window open \(which is a hassle in my opinion\).

You can run these kind of containers in detached mode. Containers running in detach mode run in the background like a service. To detach a container, we can use the `-d` or `--detach` option. To run the container in detached mode, execute the following command:

```text
docker run -d redis
```

You should get the container id as output.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-11.45.41-PM.png)

The Redis server is now running in the background. You can inspect it using the dashboard or by using the `ps` command.

## Executing Commands Inside a Running Container

Now that you have a Redis server running in the background, assume that you want to perform some operations using the `redis-cli` tool. You can not just go ahead and execute `docker run redis redis-cli`. The container is already running.

For situations like this, there is a command for executing other commands inside a running container called `exec`, and the generic syntax for this command is as follows:

```text
docker exec <container id> <command>
```

If the id for the Redis container is `5531133af6a1` then the command should be as follows:

```text
docker exec -it 5531133af6a1 redis-cli
```

And you should land right into the `redis-cli` program:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-12.19.10-AM.png)

Notice we're using the `-it` option as this is going to be an interactive session. Now you can run any [valid Redis command](https://redis.io/commands) in this window and the data will be persisted in the server.

You can exit simply by pressing `ctrl + c` key combination or closing the terminal window. Keep in mind however, the server will keep running in the background even if you exit out of the CLI program.

## Starting Shell Inside a Running Container

Assume that you want to use the shell inside a running container for some reason. You can do that by just using the `exec` command with `sh` being the executable like the following command:

```text
docker exec -it <container id> sh
```

If the id of the redis container is `5531133af6a1` the, execute the following command to start a shell inside the container:

```text
docker run exec -it 5531133af6a1 sh
```

You should land directly on a shell inside the container.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-11-at-11.15.27-PM.png)

You can execute any valid shell command here.

## Accessing Logs From a Running Container

If we want to view logs from a container, the dashboard can be really helpful.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-1.59.16-AM.png)

We can also use the `logs` command to retrieve logs from a running container. The generic syntax for the command is as follows:

```text
docker logs <container id>
```

If the id for Redis container is `5531133af6a1` then execute following command to access the logs from the container:

```text
docker logs 5531133af6a1
```

You should see a wall of text appear on your terminal window.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-12.58.44-AM.png)

This is just a portion from the log output. You can kind of hook into the output stream of the container and get the logs in real-time by using the `-f` or `--follow` option.

Any later log will show up instantly in the terminal as long as you don't exit by pressing `ctrl + c` key combination or closing the window. The container will keep running even if you exit out of the log window.

## Mapping Ports

Assume that you want to run an instance of the popular [Nginx](https://www.nginx.com/) web server. You can do that by using the official [nginx](https://hub.docker.com/_/nginx) image. Execute the following command to run a container:

```text
docker run nginx
```

Nginx is meant to be kept running, so you may as well use the `-d` or `--detach` option. By default Nginx runs on port 80. But if you try to access `http://localhost:80` you should see something like the following:![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-1.03.52-AM.png)http://localhost:80

That's because Nginx is running on port 80 inside the container. Containers are isolated environments and your host system knows nothing about what's going on inside a container.

To access a port that is inside a container, you need to map that port to a port on the host system. You can do that by using the `-p` or `--port` option with the `docker run` command. Generic syntax for this option is as follows:

```text
docker run -p <host port:container port> nginx
```

Executing `docker run -p 80:80 nginx` will map port 80 on the host machine to port 80 of the container. Now try accessing `http://localhost:80` address:![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-1.09.57-AM.png)http://localhost:80

If you execute `docker run -p 8080:80 nginx` instead of `80:80` the Nginx server will be available on port 8080 of the host machine. If you forget the port number after a while you can use the dashboard to have a look at it:![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-2.22.43-PM.png)Port mapping in the Docker Dashboard

The _Inspect_ tab contains information regarding the port mappings. As you can see, I've mapped port 80 from the container to port 8080 of the host system.

