# Container Manipulation Basics

In the previous sections, you've learned about the building blocks of Docker and have also run a container using the `docker run` command. In this section, you'll be learning about container manipulation in a lot more detail. Container manipulation is one of the most common task you'll be performing every single day so having a proper understanding of the various commands is crucial.

Keep in mind though, this is not an exhaustive list of all the commands you can execute on Docker. I'll be talking only about the most common ones. Anytime you want to learn more about the available commands, just visit the official [reference](https://docs.docker.com/engine/reference/commandline/container/) for the Docker command-line.

## Running Containers

Previously you've used `docker run` to create and start a container using the `hello-world` image. The generic syntax for this command is as follows:

```text
docker run <image name>
```

Although this is a perfectly valid command, there is a better way of dispatching commands to the `docker` daemon. Prior to version `1.13`, Docker had only the previously mentioned command syntax. Later on, the command-line was [restructured](https://www.docker.com/blog/whats-new-in-docker-1-13/) to have the following syntax:

```text
docker <object> <command> <options>
```

In this syntax:

* `object` indicates the type of Docker object you'll be manipulating. This can be a `container`, `image`, `network` or `volume` object.
* `command` indicates the task to be carried out by the daemon i.e. `run` command.
* `options` can be any valid parameter that can override the default behavior of the command i.e. the `--publish` option for port mapping.

Now, following this syntax, the `run` command can be written as follows:

```text
docker container run <image name>
```

The `image name` can be of any image from an online registry or your local system. As an example, you can try to run a container using the [fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock) image. This image contains a simple [Vue.js](https://vuejs.org/) application that runs on port 80 inside the container. To run a container using this image, execute following command on your terminal:

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

The command is pretty self-explanatory. The only portion that may require some explanation is the `--publish 8080:80` portion which will be explained in the next sub-section.

## Publishing Ports

Containers are isolated environments. Your host system doesn't know anything about what's going on inside a container. Hence, applications running inside a container remains inaccessible from the outside.

To allow access from outside of a container, you must publish the appropriate port inside the container to a port on your local network. The common syntax for the `--publish` or `-p` option is as follows:

```text
--publish <host port>:<container port>
```

When you wrote `--publish 8080:80` in the previous sub-section, it meant any request sent to port 8080 of your host system will be forwarded to port 80 inside the container.

Now to access the application on your browser, visit `http://127.0.0.1:8080` address.

![](.gitbook/assets/hello-dock.png)

The container can be stopped by simply hitting `ctrl + c` key combination while the terminal window is in focus or closing off the terminal window completely.

## Detached Mode

Another very popular option of the `run` command is the `--detach` or `-d` option. In the example above, in order for the container to keep running, you had to keep the terminal window open. Closing the terminal window also stopped the running container.

This is because by default containers run in the foreground and attach themselves to the terminal like any other normal program invoked from the terminal. In order to override this behavior and keep a container running in background, you can include the `--detach` option to the `run` command as follows:

```text
docker container run --detach --publish 8080:80 fhsinchy/hello-dock

# 9f21cb77705810797c4b847dbd330d9c732ffddba14fb435470567a7a3f46cdc
```

Unlike the previous example, you won't get a wall of text thrown at you this time. Instead what you'll get is the ID of the newly created container.

The order of the options you provide doesn't really matter. If you put the `--publish` option before the `--detach` option, it'll work just the same. One thing that you have to keep in mind in case of the `run` command is that the image name must come last. If you put anything after the image name then that'll be passed as an argument to the container entry-point \(explained in the [Executing Commands Inside a Container](container-manipulation-basics.md#executing-commands-inside-a-container) sub-section\) and may result in unexpected situations.

## Listing Containers

The `container ls` command can be used to list out containers that are currently running. To do so execute following command:

```text
docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   5 seconds ago       Up 5 seconds        0.0.0.0:8080->80/tcp   gifted_sammet
```

As you can see in the output, a container named `gifted_sammet` is running. It was created `5 seconds ago` and the status is the status is `Up 5 seconds,` which indicates that the container is running fine since it's creation.

The `CONTAINER ID` is `9f21cb777058` which is the first 12 characters of the full container ID. The full container ID is `9f21cb77705810797c4b847dbd330d9c732ffddba14fb435470567a7a3f46cdc` which is 64 characters long. This full container ID was printed as the output of the `docker container run` command in the previous section.

Listed under the `PORTS` column, port 8080 from your local network is pointing towards port 80 inside the container. The name `gifted_sammet` is generated by Docker and can be something completely different in your computer.

The `container ls` command only lists the containers that are currently running on your system. In order to list out the containers that has run in the past you can use the `--all` or `-a` option.

```text
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                     PORTS                  NAMES
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   2 minutes ago       Up 2 minutes               0.0.0.0:8080->80/tcp   gifted_sammet
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   3 minutes ago       Exited (0) 3 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 4 minutes ago       Exited (0) 4 minutes ago                          exciting_chebyshev
```

As you can see the second container in the list `reverent_torvalds` was created earlier and has exited with the status code 0, which indicates that no error was produced during the runtime of the container.

## Naming or Renaming Containers

By default, every container has two identifiers. They are as follows:

* `CONTAINER ID` - a random 64 characters long string.
* `NAME` - combination of two random words, joined with an underscore.

Referring to a container based on these two random identifier is kind of inconvenient. It would be great if the containers could be referred to using a name defined by you.

Naming a container can be achieved using the `--name` option. To run another container using the `fhsinchy/hello-dock` image with the name `hello-dock-container` you can execute the following command:

```text
docker container run --detach --publish 8888:80 --name hello-dock-container fhsinchy/hello-dock

# b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb
```

The 8080 port on local network is occupied by the `gifted_sammet` container \(the container created in the previous sub-section\), that's why you'll have to use a different port number i.e. 8888. Now to verify, run the `container ls` command:

```text
docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   28 seconds ago      Up 26 seconds       0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   4 minutes ago       Up 4 minutes        0.0.0.0:8080->80/tcp   gifted_sammet
```

As you can see, a new container with the name of `hello-dock-container` has been started.

You can even rename old containers using the `container rename` command. Syntax for the command is as follows:

```text
docker container rename <container identifier> <new name>
```

To rename the `gifted_sammet` container to `hello-dock-container-2` execute following command:

```text
docker container rename gifted_sammet hello-dock-container-2
```

The command doesn't yield any output but you can verify that the changes have taken place using the `container ls` command. The `rename` command works for containers both in running state and stopped state.

## Stopping or Killing a Running Container

Containers running in the foreground can be stopped by simply closing the terminal window or hitting `ctrl + c` key combination. Containers running in the background, however, can not be stopped in the same way.

There are two commands that deal with this task. The first one is the `container stop` command. Generic syntax for the command is as follows:

```text
docker container stop <container identifier>
```

Where `container identifier` can either be the id or the name of the container. I hope that you remember the container you started in the previous section. It's still running in the background. Get the identifier for that container using `docker container ls` , I'll be using `hello-dock-container` container for this demo. Now execute following command to stop the container:

```text
docker container stop hello-dock-container

# hello-dock-container
```

If you use the name as identifier, you'll get the name thrown back to you as output. The `stop` command shuts down a container gracefully by sending a `SIGTERM` signal. If the container doesn't stop within a certain period, a `SIGKILL` signal is sent which shuts down the container immediately.

In cases where you want to send a `SIGKILL` signal instead of a `SIGTERM` signal, you may use the `container kill` command instead. The `container kill` command follows the same syntax as the `stop` command.

```text
docker container kill hello-dock-container-2

# hello-dock-container-2
```

## Restarting Containers

When I say restart I mean two scenarios specifically. They are as follows:

* Restarting a container that has been previously stopped or killed.
* Rebooting a running container.

As you've already learned from a previous sub-section, stopped containers remain in your system. If you want you can restart them. The `container start` command can be used to start any stopped or killed container. The syntax of the command is as follows:

```text
docker container start <container identifier>
```

You can get the list of all containers by executing the `container ls --all` command. Then look for the containers with `Exited` status.

```text
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                        PORTS               NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   3 minutes ago       Exited (0) 47 seconds ago                         hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   7 minutes ago       Exited (137) 17 seconds ago                       hello-dock-container-2
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   7 minutes ago       Exited (0) 7 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 9 minutes ago       Exited (0) 9 minutes ago                          exciting_chebyshev
```

Now to restart the `hello-dock-container` container, you may execute the following command:

```text
docker container start hello-dock-container

# hello-dock-container
```

Now you can ensure that the container is running by looking at the list of running containers using the `container ls` command. The `container start` command starts any container in detached mode by default and retains any port configurations made previously. So if you visit `http://127.0.0.1:8080` now, you should be able to access the `hello-dock` application just like before.

![](.gitbook/assets/hello-dock.png)

Now, in scenarios where you would like to reboot a running container you may use the `container restart` command. The `container restart` command follows the exact syntax as the `container start` command.

```text
docker container restart hello-dock-container-2

# hello-dock-container-2
```

Main difference between the two commands is that the `container restart` command attempts to stop the target container and then starts it back whereas the start command just starts a already stopped container.

In case of a stopped container, both commands are exactly same but in case of a running container, you must use the `container restart` command.

## Creating Containers Without Running

So far in this section, you've started containers using the `container run` command which is in reality a combination of two separate commands. These commands are as follows:

* `container create` command creates a container from a given image.
* `container start` command starts a container that has been already created.

Now, to perform the demonstration shown in the [Running Containers](container-manipulation-basics.md#running-containers) section using these two commands, you can do something like the following:

```text
docker container create --publish 8080:80 fhsinchy/hello-dock

# 2e7ef5098bab92f4536eb9a372d9b99ed852a9a816c341127399f51a6d053856

docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS               NAMES
# 2e7ef5098bab        fhsinchy/hello-dock   "/docker-entrypoint.…"   30 seconds ago      Created                                 hello-dock
```

Evident by the output of `container ls --all` command, a container with the name of `hello-dock` has been created using the `fhsinchy/hello-dock` image. The `STATUS` of the container is `Created` at the moment and given it's not running, it won't be listed without the use of the `--all` option. Once the container has been created, it can be started using the `container start` command.

```text
docker container start hello-dock

# hello-dock

docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 2e7ef5098bab        fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up 29 seconds       0.0.0.0:8080->80/tcp   hello-dock
```

The container `STATUS` has changed from `Created` to `Up 29 seconds` which indicates that the container is now in running state. The port configuration has also showed up in the `PORTS` column which was previously empty.

Although you can get away with the `container run` command for majority of the scenarios, there will be some situations later on in the article that requires the usage of this `container create` command.

## Removing Dangling Containers

As you've already seen, containers that have been stopped or killed remain in the system. These dangling containers can take up space or can conflict with newer containers.

In order to remove a stopped container you can use the `container rm` command. The generic syntax is as follows:

```text
docker container rm <container identifier>
```

To find out which containers are not running, use the `container ls --all` command and look for containers with `Exited` status.

```text
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                      PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   6 minutes ago       Up About a minute           0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   10 minutes ago      Up About a minute           0.0.0.0:8080->80/tcp   hello-dock-container-2
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   10 minutes ago      Exited (0) 10 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 12 minutes ago      Exited (0) 12 minutes ago                          exciting_chebyshev
```

As can be seen in the output, container with ID `6cf52771dde1` and `128ec8ceab71` is not running. To remove the `6cf52771dde1` you can execute the following command:

```text
docker container rm 6cf52771dde1

# 6cf52771dde1
```

You can check if the container was deleted or not by using the `container ls` command. You can also remove multiple containers at once by passing their identifiers one after another separated by spaces.

Or, instead of removing individual containers, if you want to remove all dangling containers at one go, you can use the `container prune` command.

```text
docker container prune
```

Docker will ask for confirmation. You can use the `--force` or `-f` option to skip this confirmation step. Once done, the `container prune` command will show the amount of reclaimed space.

You can check the the container list using the `container ls --all` command to make sure that the dangling containers have been removed:

```text
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   8 minutes ago       Up 3 minutes        0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago      Up 3 minutes        0.0.0.0:8080->80/tcp   hello-dock-container-2
```

If you are following the article exactly as written so far, you should only see the `hello-dock-container` and `hello-dock-container-2` in the list. I would suggest stopping and removing both containers before going to the next section.

There is also the `--rm` option for the `container run`  and `container start` commands which indicates that you want the containers removed as soon as they're stopped. To start another `hello-dock` container with the `--rm` option, execute the following command:

```text
docker container run --rm --detach --publish 8888:80 --name hello-dock-volatile fhsinchy/hello-dock

# 0d74e14091dc6262732bee226d95702c21894678efb4043663f7911c53fb79f3
```

You can use the `container ls` command to verify that the container is running:

```text
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 0d74e14091dc   fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8888->80/tcp   hello-dock-volatile
```

Now if stop the container and then check again with the `container ls --all` command:

```text
docker container stop hello-dock-volatile

# hello-dock-volatile

docker container ls --all

# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

The container has been removed automatically. From now on I'll use the `--rm` option for most of the containers. I'll explicitly mention where it's not needed.

## Running Containers in Interactive Mode

So far you've only run containers created from either the [hello-world](https://hub.docker.com/_/hello-world) image or the [fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock) image. These images are made for executing simple programs that are not interactive.

Well, all images are not that simple. Images can encapsulate an entire Linux distribution inside them. Popular distributions such as [Ubuntu](https://ubuntu.com/), [Fedora](https://fedora.org/), [Debian](https://debian.org/) all have official Docker images available in the hub. Programming languages such as [python](https://hub.docker.com/_/python), [php](https://hub.docker.com/_/php), [go](https://hub.docker.com/_/golang) or run-times like [node](https://hub.docker.com/_/node), [deno](https://hub.docker.com/r/hayd/deno) all have their official images.

These images do not just run some pre-configured program. These are instead configured to run a shell by default. In case of the operating system images it can be something like `sh` or `bash` and in case of the programming languages or run-times, it is usually their default language shell.

As you may have already learned from your previous experiences with computers, shells are interactive programs. Images configured to run such a program is an interactive image. These images require a special `-it` option to be passed in the `container run` command.

As an example, if you run a container using the `ubuntu` image by executing `docker container run ubuntu` you'll see nothing happens. But if you execute the same command with `-it` option, you should land directly on bash inside the Ubuntu container. 

```text
docker container run --rm -it ubuntu

# root@dbb1f56b9563:/# cat /etc/os-release
# NAME="Ubuntu"
# VERSION="20.04.1 LTS (Focal Fossa)"
# ID=ubuntu
# ID_LIKE=debian
# PRETTY_NAME="Ubuntu 20.04.1 LTS"
# VERSION_ID="20.04"
# HOME_URL="https://www.ubuntu.com/"
# SUPPORT_URL="https://help.ubuntu.com/"
# BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
# PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
# VERSION_CODENAME=focal
# UBUNTU_CODENAME=focal
```

As you can see from the output of the `cat /etc/os-release` command, I am indeed interacting with the bash running inside the Ubuntu container.

The `-it` option sets the stage for you to interact with any interactive program inside a container. This option is actually two separate options mashed together.

* The `-i` or `--interactive` option connects you to the input stream of the container, so that you can send inputs to bash.
* The `-t` or `--tty` option makes sure that you get some good formatting and a native terminal like experience by allocating a pseudo-tty.

You need to use the `-it` option whenever you want to run a container in interactive mode. Another example can be running the `node` image as follows:

```text
docker container run -it node

# Welcome to Node.js v15.0.0.
# Type ".help" for more information.
# > ['farhan', 'hasin', 'chowdhury'].map(name => name.toUpperCase())
# [ 'FARHAN', 'HASIN', 'CHOWDHURY' ]
```

As you can see, any valid JavaScript code can be executed in the node shell. Instead of writing `-it` you can instead be more verbose by writing `--interactive --tty` separately.

## Executing Commands Inside a Container

In the [Hello World in Docker](hello-world-in-docker.md) section of this article, you've seen me executing a command inside an Alpine Linux container. It went something like as follows:

```text
docker run alpine uname -a
# Linux f08dbbe9199b 5.8.0-22-generic #23-Ubuntu SMP Fri Oct 9 00:34:40 UTC 2020 x86_64 Linux
```

In this command, I've executed the `uname -a` command inside an Alpine Linux container. Scenarios like this where all you want is to execute a certain command inside a certain container is pretty common.

Assume that you want encode a string using the `base64` program which is something available in almost any Linux or Unix based operating system but not on Windows. In this situation you can quickly spin up a container using images like [busybox](https://hub.docker.com/_/busybox) and let it do the job.

The generic syntax for encoding a string using `base64` is as follows:

```text
echo -n my-secret | base64

# bXktc2VjcmV0
```

And the generic syntax for passing a command to a container that is not running is as follows:

```text
docker container run <image name> <command>
```

To perform the base64 encoding using the busybox image, you can execute following command:

```text
docker container run --rm busybox echo -n my-secret | base64

# bXktc2VjcmV0
```

What happens here is, in a `container run` command, whatever you pass after the image name gets passed to the default entry-point of the image. An entrypoint is like a gateway to the image. Most of the images except the executable images \(explained in the [Working With Executable Images](container-manipulation-basics.md#working-with-executable-images) sub-section\), uses shell or `sh` as the default entry-point. So any valid shell command can be passed to them as arguments.

## Working With Executable Images

In the previous section, I briefly mentioned executable images. These images are designed in a way to behave like executable programs.

Take for example my [rmbyext](https://github.com/fhsinchy/rmbyext) project. This is a simple python script capable of recursively deleting files of given extensions. To learn more about the project, you can checkout the repository:

{% embed url="https://github.com/fhsinchy/rmbyext" caption="spare a ⭐ to keep me motivated" %}

If you have both git and python installed, you can install this script by executing the following command:

```text
pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext
```

Assuming python has been set-up properly on your system, the script should be available anywhere through the terminal. The generic syntax for using this script is as follows:

```text
rmbyext <file extension>
```

To test it out, open up your terminal inside an empty directory and create some files in it with different extensions. You can use the `touch` command to do so. Now, I have a directory on my computer with following files:

```text
touch a.pdf b.pdf c.txt d.pdf e.txt

ls

# a.pdf  b.pdf  c.txt  d.pdf  e.txt
```

To delete all the `pdf` files from this directory, you can execute the following command:

```text
rmbyext pdf

# Removing: PDF
# b.pdf
# a.pdf
# d.pdf
```

An executable image for this program should be able to take extensions of files as arguments and delete them just like the `rmbyext` program did.

The [fhsinchy/rmbyext](https://hub.docker.com/r/fhsinchy/rmbyext) image behaves in a similar manner. This image contains a copy of the `rmbyext` script and is configured to run the script on a directory `/zone` inside the container.

Now the problem is that containers are isolated from your local system, hence the `rmbyext` program running inside the container doesn't have any access to your local file system. So, if somehow you can map the local directory containing the `pdf` files to the `/zone` directory inside the container, the files should be accessible to the container.

One way to grant a container direct access to your local file system is by using [bind mounts](https://docs.docker.com/storage/bind-mounts/). A bind mount lets you form a two way data binding between the content of a local file system directory \(source\) and another directory inside a container \(destination\). This way any changes made in the destination directory will take effect on the source directory and vise versa.

Let's see a bind mount in action. To delete files using this image instead of the program itself, you can execute the following command:

```text
docker container run --rm -v $(pwd):/zone fhsinchy/rmbyext pdf

# Removing: PDF
# b.pdf
# a.pdf
# d.pdf
```

As you may have already guessed by seeing the `-v $(pwd):/zone` part in the command, `-v` or `--volume` option is used for creating a bind mount for a container. This option can take three fields separated by colons \(`:`\). The generic syntax for the option is as follows:

```text
--volume <local file system directory absolute path>:<container file system directory absolute path>:<read write access>
```

The third field is optional but you must pass the absolute path of your local directory and the absolute path of the directory inside the container. The source directory in my case is `/home/fhsinchy/the-zone` and given my terminal is opened inside the directory, `$(pwd)` will be replaced with `/home/fhsinchy/the-zone` which contains the previously mentioned `.pdf` and `.txt` files. You can learn more about [command substitution](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html) if you want to.

The `--volume` or `-v` option is valid for the `container run` as well as the `container create` commands. Volumes will be explored in greater detail in the upcoming sections so don't worry if you didn't understand it very well here.

The difference between a regular image and an executable one is that the entry-point for an executable image is set to a custom program instead of `sh`, in this case the `rmbyext` program and as you've learned in the previous sub-section, anything you write after the image name in a `container run` command gets passed to the entry-point of the image.

So in the end the `docker container run --rm -v $(pwd):/zone fhsinchy/rmbyext pdf` command translates to `rmbyext pdf` inside the container. Executable images are not that common in the wild but can be very useful in certain cases, hence learning about them is important.



