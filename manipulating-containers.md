# Manipulating Containers

In the previous section, we've had a brief encounter with the Docker client. It is the command-line interface program that takes our commands to the Docker daemon. In this section, you'll learn about more advanced ways of manipulating containers in Docker.

## Running Containers

In the previous section, we've used `docker run` to create and run a container using the hello-world image. The generic syntax for this command is:

```text
docker run <image name>
```

Here `image name` can be any image from Docker Hub or our local machine. I hope that you've noticed that I've been saying **create and run** and not just **run**, the reason behind that is the `docker run` command actually does the job of two separate docker commands. They are:

1. `docker create <image name>` - creates a container from given image and returns the container id.
2. `docker start <container id>` - starts a container by given id of a already created command.

To create a container from the hello-world image execute the following command:

```text
docker create hello-world
```

The command should output a long string like `cb2d384726da40545d5a203bdb25db1a8c6e6722e5ae03a573d717cd93342f61` – this is the container id. This id can be used to start the built container.

The first 12 characters of the container id are enough for identifying the container. Instead of using the whole string, using `cb2d384726da` should be fine.

To start this container execute the following command:

```text
docker start cb2d384726da
```

You should get the container id back as output and nothing else. You may think that the container hasn't run properly. But if you check the dashboard, you'll see that the container has run and exited successfully.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-11.33.11-PM.png)

What happened here is we didn't attach our terminal to the output stream of the container. UNIX and LINUX commands usually open three I/O streams when run, namely `STDIN`, `STDOUT`, and `STDERR`.

If you want to learn more, there is an amazing [article](https://www.digitalocean.com/community/tutorials/an-introduction-to-linux-i-o-redirection) out there on the topic.

To attach your terminal to the output stream of the container you have to use the `-a` or `--attach` option:

```text
docker start -a cb2d384726da
```

If everything goes right, then you should see the following output:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-12.02.16-AM.png)

We can use the `start` command to run any container that is not already running. Using `run` command will create a new container every time.

## Listing Containers

You may remember from the previous section, that the dashboard can be used for inspecting containers with ease.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-10.23.40-PM.png)

It's a pretty useful tool for inspecting individual containers, but is too much for viewing a plain list of the containers. That's why there is a simpler way to do that. Execute the following command in your terminal:

```text
docker ps -a
```

And you should see a list of all the containers on your terminal.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-10.25.36-PM.png)

The `-a` or `--all` option indicates that we want to see not only the running containers but also the stopped ones. Executing `ps` without the `-a` option will list out the running containers only.

## Restarting Containers

We've already used the `start` command to run a container. There is another command for starting containers called `restart`. Though the commands seem to serve the same purpose on the surface, they have a slight difference.

The `start` command starts containers that are not running. The `restart` command, however, kills a running container and starts that again. If we use `restart` with a stopped container then it'll function just as same as the `start` command.

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

## Stopping or Killing a Running Container

Containers running in the foreground can be stopped by simply closing the terminal window or hitting `ctrl + c` key combination. Containers running in the background, however, can not be stopped in the same way.

There are two commands for stopping a running container:

* `docker stop <container id>` - attempts to stop the container gracefully by sending a `SIGTERM` signal to the container. If the container doesn't stop within a grace period, a `SIGKILL` signal is sent.
* `docker kill <container id>` - stops the container immediately by sending a `SIGKILL` signal. A `SIGKILL` signal can not be ignored by a recipient.

To stop a container with id `bb7fadc33178` execute `docker stop bb7fadc33178` command. Using `docker kill bb7fadc33178` will terminate the container immediately without giving a chance to clean up.

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

