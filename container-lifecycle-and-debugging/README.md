# Understanding container lifecycle, logs, exec, and cleanup

Now that you've run your first few containers, published ports, and even used detached mode, it's time for you to learn about the full lifecycle of a container. In this chapter, you'll learn about how containers are born, how they live, how they die, and how you clean up after them. You'll also learn how to peek inside a running container, follow its logs in real time, and execute commands inside it. Container manipulation is something you'll be doing every single day as a Docker user, so having a proper understanding of these commands is important.

Keep in mind though, this is not an exhaustive list of all the commands you can execute on Docker. I'll be talking only about the most common ones. Anytime you want to learn more about the available commands, just visit the official [reference](https://docs.docker.com/engine/reference/commandline/container/) for the Docker command-line.

## Container states

Before you go any further, it helps to understand the different states a container can be in. A container is not simply "running" or "not running" -- there is more nuance to it. The possible states of a Docker container are as follows:

* `Created` -- the container has been created \(with `docker container create`\) but has never been started.
* `Running` -- the container is currently running and doing its thing.
* `Paused` -- the container has been paused using `docker container pause` and its processes are temporarily suspended.
* `Exited` -- the container ran and finished, or was stopped. It still exists on disk but is no longer running.
* `Dead` -- the container is in a broken state, usually because Docker tried to remove it and failed. You rarely see this one, but it's good to know it exists.

Let me show you some of these in action. If you've been following along, you may still have some containers from the previous chapter. Let's start fresh by looking at everything on your system. To do so, execute the following command:

```text
docker container ls --all

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS               NAMES
# 9f21cb777058   fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago   Exited (0) 3 minutes ago                        gifted_sammet
# 128ec8ceab71   hello-world           "/hello"                 15 minutes ago   Exited (0) 15 minutes ago                       exciting_chebyshev
```

As you can see, both containers have an `Exited` status. That means they ran at some point and then stopped. The `(0)` after `Exited` is the exit code, where `0` means no error was produced during the runtime of the container.

Now let me create a container without starting it, so you can see the `Created` state:

```text
docker container create --publish 8080:80 fhsinchy/hello-dock

# 2e7ef5098bab92f4536eb9a372d9b99ed852a9a816c341127399f51a6d053856

docker container ls --all

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                      PORTS               NAMES
# 2e7ef5098bab   fhsinchy/hello-dock   "/docker-entrypoint.…"   5 seconds ago    Created                                         nifty_colden
# 9f21cb777058   fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago   Exited (0) 3 minutes ago                        gifted_sammet
# 128ec8ceab71   hello-world           "/hello"                 15 minutes ago   Exited (0) 15 minutes ago                       exciting_chebyshev
```

Evident by the output, the new container `nifty_colden` has a status of `Created`. It's sitting there, configured and ready to go, but it has never been started. The `container create` command sets everything up -- port mappings, volumes, environment variables -- without actually starting the container. You can think of `docker container run` as a shorthand that combines `container create` and `container start` into a single step.

Understanding these states will help you debug issues later on. If a container keeps showing `Exited (1)` or `Exited (137)`, those exit codes tell you something went wrong -- an application error or a forced kill, for example. I would suggest keeping this mental model of container states in mind as you work through the rest of this chapter.

Before going further, lets clean up by removing all the containers from the previous chapter:

```text
docker container rm 2e7ef5098bab 9f21cb777058 128ec8ceab71

# 2e7ef5098bab
# 9f21cb777058
# 128ec8ceab71
```

## Naming containers

By default, every container gets two identifiers. They are as follows:

* `CONTAINER ID` -- a random 64 characters long string.
* `NAME` -- a combination of two random words, joined with an underscore.

Referring to a container based on these two random identifiers is kind of inconvenient. It would be great if the containers could be referred to using a name defined by you.

Naming a container can be achieved using the `--name` option. To run a container using the `fhsinchy/hello-dock` image with the name `hello-dock-container`, you can execute the following command:

```text
docker container run --detach --publish 8080:80 --name hello-dock-container fhsinchy/hello-dock

# b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb
```

Now to verify, run the `container ls` command:

```text
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                  NAMES
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   10 seconds ago   Up 8 seconds    0.0.0.0:8080->80/tcp   hello-dock-container
```

As you can see, a new container with the name of `hello-dock-container` has been started. You can now use this name anywhere you'd use a container ID. I usually name my containers in development because it makes everything much easier to keep track of. In my opinion, random names like `gifted_sammet` are fun to read but terrible to remember.

Let's spin up another one so you have two containers to work with throughout this chapter:

```text
docker container run --detach --publish 8888:80 --name hello-dock-container-2 fhsinchy/hello-dock

# 9f21cb77705810797c4b847dbd330d9c732ffddba14fb435470567a7a3f46cdc
```

The 8080 port on local network is already occupied by `hello-dock-container`, that's why you'll have to use a different port number i.e. 8888.

You can even rename existing containers using the `container rename` command. The generic syntax for this command is as follows:

```text
docker container rename <container identifier> <new name>
```

To rename `hello-dock-container-2` to `hello-dock-secondary`, execute the following command:

```text
docker container rename hello-dock-container-2 hello-dock-secondary
```

The command doesn't yield any output but you can verify that the changes have taken place using the `container ls` command:

```text
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 9f21cb777058   fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8888->80/tcp   hello-dock-secondary
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   3 minutes ago        Up 3 minutes        0.0.0.0:8080->80/tcp   hello-dock-container
```

The `rename` command works for containers both in running state and stopped state.

## Stopping and killing containers

Containers running in the foreground can be stopped by simply closing the terminal window or hitting the `ctrl + c` key combination. Containers running in the background, however, can not be stopped in the same way.

There are two commands that deal with this task. The first one is the `container stop` command. The generic syntax for this command is as follows:

```text
docker container stop <container identifier>
```

Where `container identifier` can either be the id or the name of the container. I hope that you remember the two containers you started in the previous section. They're still running in the background. Now execute the following command to stop `hello-dock-container`:

```text
docker container stop hello-dock-container

# hello-dock-container
```

If you use the name as identifier, you'll get the name thrown back to you as output. The `stop` command shuts down a container gracefully by sending a **SIGTERM** signal to the main process running inside the container. This gives the process a chance to clean up, close connections, save state, and shut down on its own terms. If the container doesn't stop within a certain period \(10 seconds by default\), Docker sends a **SIGKILL** signal which shuts down the container immediately.

In cases where you want to send a `SIGKILL` signal right away instead of a `SIGTERM` signal, you may use the `container kill` command instead. The `container kill` command follows the same syntax as the `stop` command:

```text
docker container kill hello-dock-secondary

# hello-dock-secondary
```

The difference matters more than you might think. Imagine a database container that needs to flush writes to disk before shutting down. A `SIGTERM` gives it a chance to do that. A `SIGKILL` just pulls the plug, and you could lose data. Hence, I would suggest using `container stop` in most situations and reserving `container kill` for containers that are unresponsive or stuck.

Now if you list all containers, you should see both in an exited state:

```text
docker container ls --all

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                        PORTS     NAMES
# 9f21cb777058   fhsinchy/hello-dock   "/docker-entrypoint.…"   5 minutes ago    Exited (137) 10 seconds ago             hello-dock-secondary
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   7 minutes ago    Exited (0) 30 seconds ago               hello-dock-container
```

Notice the difference in exit codes. `hello-dock-container` was stopped gracefully with `container stop` and has exit code `0`. `hello-dock-secondary` was killed with `container kill` and has exit code `137`. The exit code `137` means the process was terminated by a `SIGKILL` signal \(128 + 9, where 9 is the signal number for `SIGKILL`\). Keep in mind that these exit codes can be very useful when debugging why a container stopped.

## Restarting containers

When I say restart I mean two scenarios specifically. They are as follows:

* Restarting a container that has been previously stopped or killed.
* Rebooting a container that is currently running.

As you've already learned, stopped containers remain in your system. If you want you can restart them. The `container start` command can be used to start any stopped or killed container. The generic syntax for this command is as follows:

```text
docker container start <container identifier>
```

To restart the `hello-dock-container`, you may execute the following command:

```text
docker container start hello-dock-container

# hello-dock-container
```

Now you can ensure that the container is running by looking at the list of running containers:

```text
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS         PORTS                  NAMES
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   9 minutes ago    Up 5 seconds   0.0.0.0:8080->80/tcp   hello-dock-container
```

The `container start` command starts any container in detached mode by default and retains any port configurations made previously. So if you visit `http://127.0.0.1:8080` now, you should be able to access the `hello-dock` application just like before.

Now, in scenarios where you would like to reboot a running container you may use the `container restart` command. The `container restart` command follows the exact syntax as the `container start` command:

```text
docker container restart hello-dock-container

# hello-dock-container
```

The main difference between the two commands is that the `container restart` command attempts to stop the target container and then starts it back up, whereas the `container start` command just starts an already stopped container.

In case of a stopped container, both commands are exactly the same. But in case of a running container, you must use the `container restart` command.

## The --rm flag

As you've already seen, containers that have been stopped or killed remain in the system. These dangling containers can pile up over time and take up space or conflict with newer containers. If you are someone who spins up containers frequently for testing, you already know this pain.

The `--rm` option for the `container run` command tells Docker that you want the container removed automatically as soon as it's stopped. To start a `hello-dock` container with the `--rm` option, execute the following command:

```text
docker container run --rm --detach --publish 8888:80 --name hello-dock-volatile fhsinchy/hello-dock

# 0d74e14091dc6262732bee226d95702c21894678efb4043663f7911c53fb79f3
```

You can use the `container ls` command to verify that the container is running:

```text
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 0d74e14091dc   fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8888->80/tcp   hello-dock-volatile
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago       Up 3 minutes        0.0.0.0:8080->80/tcp   hello-dock-container
```

Now if you stop the container and then check again with the `container ls --all` command:

```text
docker container stop hello-dock-volatile

# hello-dock-volatile

docker container ls --all

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                        PORTS                  NAMES
# 9f21cb777058   fhsinchy/hello-dock   "/docker-entrypoint.…"   14 minutes ago   Exited (137) 9 minutes ago                          hello-dock-secondary
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   15 minutes ago   Up 6 minutes                  0.0.0.0:8080->80/tcp   hello-dock-container
```

The `hello-dock-volatile` container has been removed automatically. It doesn't show up in the list at all. From now on I'll use the `--rm` option for most of the containers. I'll explicitly mention where it's not needed.

I prefer using `--rm` for any container that I don't plan on restarting later. It keeps my system clean without me having to think about it.

## Removing dangling containers

Even with the `--rm` flag, you'll inevitably end up with stopped containers lingering on your system. As you can see from the previous section, `hello-dock-secondary` is still sitting there in an exited state. These dangling containers can take up space or can conflict with newer containers.

In order to remove a stopped container you can use the `container rm` command. The generic syntax for this command is as follows:

```text
docker container rm <container identifier>
```

To remove the `hello-dock-secondary` container, execute the following command:

```text
docker container rm hello-dock-secondary

# hello-dock-secondary
```

You can check if the container was deleted or not by using the `container ls --all` command. You can also remove multiple containers at once by passing their identifiers one after another separated by spaces.

Now, what if you want to remove a container that is currently running? Let's try it:

```text
docker container rm hello-dock-container

# Error response from daemon: You cannot remove a running container b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb. Stop the container before attempting removal or force remove
```

As you can see, Docker won't let you remove a running container. You have two options here. You can either stop the container first and then remove it, or you can use the `--force` or `-f` option to force remove a running container:

```text
docker container rm --force hello-dock-container

# hello-dock-container
```

That works, but I would suggest stopping the container first with `container stop` when possible, so the processes inside get a chance to shut down gracefully.

Or, instead of removing individual containers, if you want to remove all stopped containers at one go, you can use the `container prune` command:

```text
docker container prune

# WARNING! This will remove all stopped containers.
# Are you sure you want to continue? [y/N] y
# Total reclaimed space: 0B
```

Docker will ask for confirmation. You can use the `--force` or `-f` option to skip this confirmation step. Once done, the `container prune` command will show the amount of reclaimed space.

You can verify using the `container ls --all` command to make sure that all dangling containers have been removed:

```text
docker container ls --all

# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

A clean slate. I usually run `docker container prune -f` at the start of each working session to make sure I'm not carrying over containers from the day before.

## Running containers in interactive mode

So far you've only run containers created from either the [hello-world](https://hub.docker.com/_/hello-world) image or the [fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock) image. These images are made for executing simple programs that are not interactive.

Well, all images are not that simple. Images can encapsulate an entire Linux distribution inside them. Popular distributions such as [Ubuntu](https://ubuntu.com/), [Fedora](https://fedora.org/), [Debian](https://debian.org/) all have official Docker images available in the hub. Programming languages such as [python](https://hub.docker.com/_/python), [php](https://hub.docker.com/_/php), [go](https://hub.docker.com/_/golang) or run-times like [node](https://hub.docker.com/_/node), [deno](https://hub.docker.com/r/hayd/deno) all have their official images as well.

These images do not just run some pre-configured program. These are instead configured to run a shell by default. In case of the operating system images it can be something like `sh` or `bash` and in case of the programming languages or run-times, it is usually their default language shell.

As you may have already learned from your previous experience with computers, shells are interactive programs. Images configured to run such a program are **interactive images**. These images require a special `-it` option to be passed in the `container run` command.

As an example, if you try to run a container using the `ubuntu` image by executing `docker container run ubuntu` you'll see nothing happens. The container starts, the shell finds no input stream attached, and it exits immediately. But if you execute the same command with the `-it` option, you should land directly on bash inside the Ubuntu container:

```text
docker container run --rm -it ubuntu

# root@dbb1f56b9563:/# cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04.1 LTS (Noble Numbat)"
# ID=ubuntu
# ID_LIKE=debian
# PRETTY_NAME="Ubuntu 24.04.1 LTS"
# VERSION_ID="24.04"
# HOME_URL="https://www.ubuntu.com/"
# SUPPORT_URL="https://help.ubuntu.com/"
# BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
# PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
# VERSION_CODENAME=noble
# UBUNTU_CODENAME=noble
```

As you can see from the output of the `cat /etc/os-release` command, I am indeed interacting with the bash running inside the Ubuntu container. You can run any command you want here -- install packages with `apt`, create files, run scripts. It's a fully functional Linux environment. To exit, you can type `exit` or press `ctrl + d`.

The `-it` option sets the stage for you to interact with any interactive program inside a container. This option is actually two separate options mashed together. They are as follows:

* The `-i` or `--interactive` option connects you to the input stream of the container, so that you can send inputs to bash.
* The `-t` or `--tty` option makes sure that you get some good formatting and a native terminal-like experience by allocating a pseudo-tty.

You need to use the `-it` option whenever you want to run a container in interactive mode. Another example can be running the `node` image as follows:

```text
docker container run --rm -it node

# Welcome to Node.js v22.0.0.
# Type ".help" for more information.
# > ['farhan', 'hasin', 'chowdhury'].map(name => name.toUpperCase())
# [ 'FARHAN', 'HASIN', 'CHOWDHURY' ]
```

As you can see, any valid JavaScript code can be executed in the node shell. Instead of writing `-it` you can instead be more verbose by writing `--interactive --tty` separately.

I find interactive containers particularly useful for quick experiments. Need to test a Python snippet but don't have Python installed locally? Just run `docker container run --rm -it python` and you've a Python shell in seconds.

## Executing commands inside containers

There are two ways to execute commands inside a container. The first way is to pass the command after the image name when creating a new container. The second way is to use the `container exec` command to execute a command inside an already running container.

### Passing commands at container creation

In the previous chapter, you may have seen me executing a command inside an Alpine Linux container. It went something like as follows:

```text
docker container run --rm alpine uname -a

# Linux f08dbbe9199b 6.19.8-200.fc43.x86_64 #1 SMP PREEMPT_DYNAMIC Thu Mar 13 20:42:11 UTC 2025 x86_64 Linux
```

In this command, I've executed the `uname -a` command inside an Alpine Linux container. What happens here is that whatever you pass after the image name in a `container run` command gets passed to the default **entry-point** of the image. An entry-point is like a gateway to the image. Most of the images except the executable images use shell or `sh` as the default entry-point. So any valid shell command can be passed to them as arguments.

Assume that you want to encode a string using the `base64` program which is something available in almost any Linux or Unix based operating system but not on Windows. In this situation you can quickly spin up a container using images like [busybox](https://hub.docker.com/_/busybox) and let it do the job.

The generic syntax for passing a command to a container is as follows:

```text
docker container run <image name> <command>
```

To perform the base64 encoding using the busybox image, you can execute the following command:

```text
docker container run --rm busybox sh -c "echo -n my-secret | base64"

# bXktc2VjcmV0
```

The `sh -c` part is necessary because you're piping the output of one command into another, which requires a shell to interpret the pipe. Without it, Docker would try to pass `echo -n my-secret | base64` as separate arguments to the entry-point, which is not what you want.

### Using container exec on running containers

The approach above works great when you want to spin up a new container, run a command, and be done with it. But what about when you need to run a command inside a container that is already running?

This is where the `container exec` command comes in. The generic syntax for this command is as follows:

```text
docker container exec <container identifier> <command>
```

Let's start a container to experiment with:

```text
docker container run --rm --detach --publish 8080:80 --name hello-dock-container fhsinchy/hello-dock

# b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb
```

Now, to execute the `uname -a` command inside this running container, you can do the following:

```text
docker container exec hello-dock-container uname -a

# Linux b1db06e400c4 6.19.8-200.fc43.x86_64 #1 SMP PREEMPT_DYNAMIC Thu Mar 13 20:42:11 UTC 2025 x86_64 GNU/Linux
```

As you can see, the command ran inside the running container and printed the output to your terminal. The container itself keeps running -- `exec` doesn't disturb it.

You can also use `exec` with the `-it` option to start an interactive shell session inside a running container. This is something you'll use all the time when debugging:

```text
docker container exec -it hello-dock-container sh

# / # ls
# bin                   docker-entrypoint.d   etc                   lib                   mnt                   proc                  run                   srv                   tmp                   var
# dev                   docker-entrypoint.sh  home                  media                 opt                   root                  sbin                  sys                   usr
# / # exit
```

Now you're inside the container with a shell prompt. You can poke around, check files, inspect the running processes, and then type `exit` to come back to your host. The container keeps running as if nothing happened.

I use `docker container exec -it <name> sh` \(or `bash` if the image has it\) almost daily. It's the single most useful debugging tool in the Docker toolbox.

## Viewing container logs

When you run a container in detached mode, you don't see any output on your terminal. That's the whole point of detached mode. But what happens when something goes wrong? How do you figure out what a container has been doing?

The `container logs` command lets you see the output that a container has been producing. The generic syntax for this command is as follows:

```text
docker container logs <container identifier>
```

The `hello-dock-container` you started earlier is still running. Let's see what it's been up to:

```text
docker container logs hello-dock-container

# /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
# /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
# 10-listen-on-ipv6-by-default.sh: Getting the checksum of /etc/nginx/conf.d/default.conf
# 10-listen-on-ipv6-by-default.sh: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
# /docker-entrypoint.sh: Configuration complete; ready for start up
# 172.17.0.1 - - [20/Mar/2026:10:15:23 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
# 172.17.0.1 - - [20/Mar/2026:10:15:23 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "-" "Mozilla/5.0"
```

Evident by the output, you can see the NGINX startup messages and any HTTP requests that have been made to the container. If you visited `http://127.0.0.1:8080` in your browser earlier, those access log entries would show up here.

The `container logs` command dumps all the logs at once and exits. But sometimes you want to watch the logs as they come in, just like tailing a log file. The `--follow` or `-f` flag does exactly that:

```text
docker container logs --follow hello-dock-container

# /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
# /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
# 10-listen-on-ipv6-by-default.sh: Getting the checksum of /etc/nginx/conf.d/default.conf
# 10-listen-on-ipv6-by-default.sh: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
# /docker-entrypoint.sh: Configuration complete; ready for start up
```

Now the command will keep running and any new log entries will appear in real time. If you open your browser and visit `http://127.0.0.1:8080` while this is running, you'll see the new access log lines pop up instantly. To stop following the logs, hit `ctrl + c`. This won't stop the container -- it only stops the log streaming.

You can also use the `--tail` option to see only the last N lines. For example, to see only the last 5 lines of logs:

```text
docker container logs --tail 5 hello-dock-container

# /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
# /docker-entrypoint.sh: Configuration complete; ready for start up
# 172.17.0.1 - - [20/Mar/2026:10:15:23 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
# 172.17.0.1 - - [20/Mar/2026:10:15:23 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "-" "Mozilla/5.0"
```

I prefer combining `--follow` with `--tail` when debugging. Something like `docker container logs --follow --tail 20 <name>` gives you the last 20 lines and then streams everything new. It's usually all you need.

## Inspecting containers

Sometimes logs and exec aren't enough. You need to know how a container was configured -- what ports are mapped, what environment variables are set, what network it's on, what its IP address is, and so on. The `container inspect` command gives you all of that and more.

The generic syntax for this command is as follows:

```text
docker container inspect <container identifier>
```

Let's inspect the `hello-dock-container`:

```text
docker container inspect hello-dock-container

# [
#     {
#         "Id": "b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb",
#         "Created": "2026-03-20T10:12:34.567890123Z",
#         "Path": "/docker-entrypoint.sh",
#         "Args": [
#             "nginx",
#             "-g",
#             "daemon off;"
#         ],
#         "State": {
#             "Status": "running",
#             "Running": true,
#             "Paused": false,
#             "Restarting": false,
#             "OOMKilled": false,
#             "Dead": false,
#             "Pid": 12345,
#             "ExitCode": 0,
#             "StartedAt": "2026-03-20T10:12:35.123456789Z",
#             "FinishedAt": "0001-01-01T00:00:00Z"
#         },
#         ### LONG OUTPUT CONTINUES ###
#     }
# ]
```

The output is a massive JSON object with every detail about the container. I've truncated it here because the full output can be over 200 lines. Let me show you the parts that are most useful for debugging.

The `State` block tells you whether the container is running, paused, or dead. The `OOMKilled` field tells you if the container was killed because it ran out of memory -- this one has saved me hours of debugging on more than one occasion.

You can use the `--format` option to extract specific fields using Go template syntax. For example, to get just the container's IP address:

```text
docker container inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' hello-dock-container

# 172.17.0.2
```

Or to get the container's current state:

```text
docker container inspect --format '{{.State.Status}}' hello-dock-container

# running
```

To get the port mappings:

```text
docker container inspect --format '{{json .NetworkSettings.Ports}}' hello-dock-container

# {"80/tcp":[{"HostIp":"0.0.0.0","HostPort":"8080"}]}
```

The `--format` flag takes a bit of getting used to, but once you're comfortable with it, you'll find yourself reaching for it often. I usually keep a few common format strings in my shell history so I don't have to remember them every time.

Keep in mind that `container inspect` works on both running and stopped containers. If a container crashed and you need to figure out why, this is one of the first places to look. The `State.ExitCode` and `State.OOMKilled` fields are particularly helpful.

## Cleanup

Before you move on to the next chapter, lets stop and remove all the containers you've created throughout this chapter. First, check what's currently running:

```text
docker container ls --all

# CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                  NAMES
# b1db06e400c4   fhsinchy/hello-dock   "/docker-entrypoint.…"   25 minutes ago   Up 25 minutes   0.0.0.0:8080->80/tcp   hello-dock-container
```

If you've been following along exactly, you should only have `hello-dock-container` running. Let's stop it and then prune all stopped containers:

```text
docker container stop hello-dock-container

# hello-dock-container

docker container prune --force

# Deleted Containers:
# b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb
#
# Total reclaimed space: 0B
```

Now verify that everything is clean:

```text
docker container ls --all

# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

A clean slate. You've a solid understanding of the full container lifecycle now -- how containers are created, started, stopped, killed, restarted, and removed. You know how to name them, view their logs, execute commands inside them, and inspect their configuration for debugging. These are the everyday operations you'll be performing constantly as you work with Docker, and everything in the upcoming chapters builds on top of them.
