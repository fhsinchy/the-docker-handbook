# Introduction to Containerization and Docker

According to [IBM](https://www.ibm.com/cloud/learn/containerization#toc-what-is-co-r25Smlqq) —

> "Containerization involves encapsulating or packaging up software code and all its dependencies so that it can run uniformly and consistently on any infrastructure."

In other words, containerization lets you bundle up your software along with all its dependencies in a self-contained package so that it can be run without going through a troublesome setup process.

Let's consider a real life scenario here. Assume you have developed an awesome book management application that can store information regarding all the books you own and can also serve the purpose of a book lending system for your friends.

If you make a list of the dependencies, that list may look like as follows:

* Node.js
* Express.js
* SQLite3

Well theoretically this should be it. But practically there are some other stuff as well. Turns out [Node.js](https://nodejs.org/) uses a build tool known as `node-gyp` for building native add-ons and according to the [installation instruction](https://github.com/nodejs/node-gyp#installation) in the [official repository](https://github.com/nodejs/node-gyp), this build tool requires Python 2/3 and a proper C/C++ compiler tool-chain. Taking all these into account, the final list of dependencies is as follows:

* Node.js
* Express.js
* SQLite3
* Python 2/3
* C/C++ tool-chain

Installing Python 2/3 is pretty straight forward regardless of the platform you're on. Setting-up C/C++ tool-chain is pretty easy on Linux but on Windows and Mac, it's a painful task. On Windows, the C++ build tools package measures at gigabytes and takes quite some time to install. On a Mac, you can either install the gigantic [Xcode](https://developer.apple.com/xcode/) application or the much smaller [Command Line Tools for Xcode](https://developer.apple.com/downloads/) package. Regardless of the one you install, it still may break on OS updates. In fact, the problem is so prevalent that there are [Installation notes for macOS Catalina](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md) available on the official repository.

Let's assume that you've gone through all the hassles of setting up the dependencies and have started working on the project. Does that mean you're out of danger now? Of course not.

What if you have a teammate who uses Windows while you're using Linux. Now you have to consider the inconsistencies of how these two different operating systems handle paths. Or the fact that popular technologies like [nginx](https://nginx.org/) are not well optimized to run on Windows. Some technologies i.e. [Redis](https://redis.io/) doesn't even come pre-built for Windows.

Even if you get through the entire development phase, but the person responsible for managing the servers follows the wrong deployment procedure?

All these issues can be solved if only you could somehow:

* Develop and run the application inside an isolated environment \(known as a container\) that matches your final deployment environment.
* Put your application inside a single file \(known as an image\) along with all its dependencies and necessary deployment configurations.
* And share that image through a central server \(known as a registry\) that is accessible by anyone with proper authorization.

Your teammates, will then be able to download the image from the registry, run the application as it is within an isolated environment free from the platform specific inconsistencies or even deploy directly on a server, given the image comes with all the proper production configurations.

That is the idea behind containerization. Putting your applications inside a self-contained package making it portable and reproducible across various environments.

#### Now the question is "What role does Docker play here?"

As I've already explained, containerization is an idea that solves a myriad of problem in software development by putting things into boxes. This very idea has quite a few implementations. [Docker](https://www.docker.com/) is such an implementation. It's an open-source containerization platform that allows you to containerize your applications, share them using public or private registries and also to [orchestrate](https://docs.docker.com/get-started/orchestration/) them.

Now, Docker is not the only containerization tool on the market, it's just the most popular one. Another containerization engine that I love is called [Podman](https://podman.io/) developed by Red Hat. Other tools like [Kaniko](https://github.com/GoogleContainerTools/kaniko) by Google, [rkt](https://coreos.com/rkt/) by CoreOS while being amazing, is not ready to be a drop in replacement for Docker yet.

Also, if you want some history lessons, you may read the amazing [A Brief History of Containers: From the 1970s Till Now](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016) article which covers most of the major turning points for the technology.

# Installing Docker

Installation of Docker varies greatly depending on the operating system you’re on but it's universally simple across the board. Docker runs flawlessly on all three major platforms, i.e. Mac, Windows and Linux. Among the three, the installation process on Mac is the easiest.

## Installation on a macOS

On a mac, all you have to do is navigate to the official [download page](https://www.docker.com/products/docker-desktop) and click the _Download for Mac \(stable\)_ button. You’ll get a regular looking _Apple Disk Image_ file and inside the file, there will be the application. All you have to do is drag the file and drop it on your Applications directory.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/drag-docker-in-applications-directory.png)

You can start Docker by simply double-clicking the application icon. Once the application start, you'll see the Docker icon appear on your menu-bar.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-icon-in-menubar.png)

Now, open up the terminal and execute `docker --version` and `docker-compose --version` to ensure the success of the installation.

## Installation on Windows

On Windows, the procedure is almost the same, except there are a few extra steps that you’ll need to go through. The installation steps are as follows:

1. Navigate to [this site](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and follow the instructions for installing WSL2 on Windows 10.
2. Then navigate to the official [download page](https://www.docker.com/products/docker-desktop) and click the _Download for Windows \(stable\)_ button.
3. Double-click the downloaded installer and go through the installation with the defaults.

Once the installation is done, start _Docker Desktop_ either from the start menu or your desktop. The docker icon should show up on your taskbar.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-icon-in-taskbar.png)

Now, open up Ubuntu or whatever distribution you've installed from Microsoft Store. Execute `docker --version` and `docker-compose --version` commands to make sure that the installation was successful.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-and-compose-version-on-windows.png)

You can access Docker from your regular Command Prompt or PowerShell as well. It's just that I prefer using WSL2 over any other command line on Windows.

Installation of Docker on Linux is the most different one and depending on the distribution you’re on, it may vary even more. But to be honest, the installation is just as easy \(if not easier\) as the other two platforms.

## Installation on a Linux

The Docker Desktop package on Windows or Mac is a collection of tools like `Docker Engine`, `Docker Compose`, `Docker Dashboard`, `Kubernetes` and a few other goodies. On Linux however, you don’t get such a bundle. What you do instead is you install all the necessary tools you need manually. Installation procedures for different distributions are as follows:

* If you’re on Ubuntu, you may follow the [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) section from the official docs.
* For other distributions, _installation per distro_ guides are available on the official docs.
  * [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
  * [Install Docker Engine on Fedora](https://docs.docker.com/engine/install/fedora/)
  * [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
* If you’re on a distribution that is not listed in the docs, you may follow the [Install Docker Engine from binaries](https://docs.docker.com/engine/install/binaries/) guide instead.
* Regardless of the procedure you follow, you’ll have to go through some [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/) which are very important.
* Once you’re done with the docker installation, you’ll have to install another tool named Docker Compose. You may follow the [Install Docker Compose](https://docs.docker.com/compose/install/) guide from the official docs. 

Once the installation is done, open up the terminal and execute `docker --version` and `docker-compose --version` to ensure the success of the installation.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-and-compose-version-on-linux.png)

Although Docker performs quite well regardless of the platform you’re on, I prefer Linux over the others. Throughout the article, I’ll be switching between my [Ubuntu 20.10](https://releases.ubuntu.com/20.10/) and [Fedora 33](https://fedoramagazine.org/announcing-fedora-33/) workstations.

Another thing that I would like to clarify right from the get go, is that I won't be using any GUI tool for working with Docker throughout the entire article.

I'm aware of the nice GUI tools available for different platforms, but learning the common docker commands is one of the prime goals of this article.

# Hello World in Docker

Now that you have Docker up and running on your machine, it's time for you to run your first container. Open up the terminal and run the following command:

```text
docker run hello-world

# Unable to find image 'hello-world:latest' locally
# latest: Pulling from library/hello-world
# 0e03bdcc26d7: Pull complete 
# Digest: sha256:4cf9c47f86df71d48364001ede3a4fcd85ae80ce02ebad74156906caff5378bc
# Status: Downloaded newer image for hello-world:latest
# 
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
# 
# To generate this message, Docker took the following steps:
#  1. The Docker client contacted the Docker daemon.
#  2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
#     (amd64)
#  3. The Docker daemon created a new container from that image which runs the
#     executable that produces the output you are currently reading.
#  4. The Docker daemon streamed that output to the Docker client, which sent it
#     to your terminal.
#
# To try something more ambitious, you can run an Ubuntu container with:
#  $ docker run -it ubuntu bash
# 
# Share images, automate workflows, and more with a free Docker ID:
#  https://hub.docker.com/
#
# For more examples and ideas, visit:
#  https://docs.docker.com/get-started/
```

The [hello-world](https://hub.docker.com/_/hello-world) image is an example of minimal containerization with Docker. It has a single program compiled from a [hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c) file responsible for printing out the message you're seeing on your terminal.

Now in your terminal, you can use the `docker ps -a` command to have a look at all the containers that are currently running or have run in the past:

```text
docker ps -a

# CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
# 128ec8ceab71        hello-world         "/hello"            14 seconds ago      Exited (0) 13 seconds ago                      exciting_chebyshev
```

In the output, a container named `exciting_chebyshev` was run with the container id of `128ec8ceab71` using the `hello-world` image and has `Exited (0) 13 seconds ago` where the `(0)` exit code means no error was produced during the runtime of the container.

Now in order to understand what just happened behind the scenes, you'll have to get familiar with the Docker Architecture and three very fundamental concepts of containerization in general, which are as follows:

* [Container](hello-world-in-docker.md#container)
* [Image](hello-world-in-docker.md#image)
* [Registry](hello-world-in-docker.md#registry)

I've listed the three concepts in alphabetical order and will begin my explanations with the first one on the list.

## Container

In the world of containerization, there can not be anything more fundamental than the concept of a container.

The official Docker [resources](https://www.docker.com/resources/what-container) site says, "A container is an abstraction at the application layer that packages code and dependencies together. Instead of virtualizing the entire physical machine, containers virtualize the host operating system only."

You may consider containers as the next generation of virtual machines. Just like virtual machines, containers are completely isolated environments from the host system as well as each other. They are also a lot lighter than the traditional virtual machine hence a large number of containers can be run simultaneously without affecting the performance of the host system.

Containers and virtual machines are actually different ways of virtualizing your physical hardware. The main difference between these two is the method of virtualization.

Virtual machines are usually created and managed by a program known as a hypervisor i.e. [Oracle VM VirtualBox](https://www.virtualbox.org/), [VMware Workstation](https://www.vmware.com/), [KVM](https://www.linux-kvm.org/), [Microsoft Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/), etc. This hypervisor program usually sits between the host operating system and the virtual machines to act as a medium of communication.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/virtual-machines.svg)

Each virtual machine comes with its own guest operating system which is just as heavy as the host operating system. Applications running inside a virtual machine communicates with the guest operating system, which talks to the hypervisor, which then in turn talks to the host operating system to allocate necessary resources from the physical infrastructure to the running application.

As you can see, there is a long chain of communication between applications running inside virtual machines and the physical infrastructure. The application running inside the virtual machine may take only a small amount of resources but the guest operating system adds a noticeable overhead.

Unlike a virtual machine, a container does the job of virtualization in a smarter way. Instead of having a complete guest operating system inside a container, it just utilizes the host operating system via the container runtime while maintaining isolation just like a traditional virtual machine.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/containers.svg)

The container runtime i.e. Docker sits between the containers and the host operating system instead of a hypervisor. The containers then communicate with the container runtime which then communicates with the host operating system to get necessary resources from the physical infrastructure. As a result of eliminating the entire guest operating system layer, containers are much lighter and less resource-hogging than traditional virtual machines.

As a demonstration of the point, look at the following code block:

```text
uname -a
# Linux alpha-centauri 5.8.0-22-generic #23-Ubuntu SMP Fri Oct 9 00:34:40 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux

docker run alpine uname -a
# Linux f08dbbe9199b 5.8.0-22-generic #23-Ubuntu SMP Fri Oct 9 00:34:40 UTC 2020 x86_64 Linux
```

In the code block above, I have executed the `uname -a` command on my host operating system to print out the kernel details. Then on the next line I've executed the same command inside a container running [Alpine Linux](https://alpinelinux.org/). As can be seen in the output, the container is indeed using the kernel from my host operating system. This goes to prove the point that containers virtualize the host operating system instead of having an operating system of their own.

If you're on a Windows machine, you'll find out that all the containers uses the WSL2 kernel. It happens because WSL2 acts as the back-end for Docker on Windows. On macOS the default back-end is a VM running on [HyperKit](https://github.com/moby/hyperkit) hypervisor.

## Image

Images are multi-layered self-contained files that act as the template for creating containers. They are like a frozen, read-only copy of a container. Images can be exchanged through registries.

In the past, different container engines had different image formats but later on [Open Container Initiative \(OCI\)](https://opencontainers.org/) defined a standard specification for container images which is complied by the major containerization engines out there. This means that an image built with Docker can be used with another runtime like Podman without any additional hassle.

Containers are just images in running state. When you obtain an image from the internet and run a container using that, you essentially create another temporary writable layer on top of the previous read-only ones. This concept will become a lot more clearer in upcoming chapters but for now, just keep in mind that images are multi-layered read-only files carrying your application in a desired state inside them.

## Registry

You've already learned about two very important pieces of the puzzle, _Container_ and _Image_. The final piece is _Registry_. An image registry is a centralized place where you can upload your images and can also download images created by others. [Docker Hub](https://hub.docker.com/) is the default public registry for Docker. Another very popular image registry is [Quay](https://quay.io/) by Red Hat. Throughout this article I'll be using Docker Hub as my registry of choice.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-hub.png)

You can share any number of public images on Docker Hub for free. People around the world will be able to download them and use them freely. Images that I've uploaded are available on my profile \([fhsinchy](https://hub.docker.com/u/fhsinchy)\) page.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/my-images-on-docker-hub.png)

Apart from Docker Hub or Quay, you can also create your own image registry for hosting private images. There is also a local registry that runs within your computer that caches images pulled from remote registries.

## Docker Architecture

Now that you've become familiar with most of the fundamental concepts regarding containerization and Docker, it's time for you to understand how Docker as a software has been designed.

The engine consists of three major components:

1. **Docker Daemon:** The daemon \(`dockerd`\) is a process that keeps running in the background and waits for commands from the client. The daemon is capable of managing various Docker objects.
2. **Docker Client:** The client  \(`docker`\) is a command-line interface program mostly responsible for transporting commands issued by users.
3. **REST API:** The REST API acts as a bridge between the daemon and the client. Any command issued using the client passes through the API to finally reach the daemon.

According to the official [docs](https://docs.docker.com/get-started/overview/#docker-architecture), "Docker uses a client-server architecture. The Docker _client_ talks to the Docker _daemon_, which does the heavy lifting of building, running, and distributing your Docker containers".

You as user will usually execute commands using the client component. The client then use the REST API to reach out to the long running daemon and get your work done.

## The Full Picture

Okay, enough talking. Now it's time for you to understand how all these pieces of puzzle you just learned about works in harmony. Before I dive into the explanation of what really happened when you ran `docker run hello-world` command, let me show you a little diagram I've made:

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/docker-run-hello-world.svg)

This image is a slightly modified version of the one found in the official [docs](https://docs.docker.com/engine/images/architecture.svg). The series of events that occurred when you executed the command can be listed as follows:

1. You execute `docker run hello-world` command where `hello-world` is the name of an image.
2. Docker client reaches out to the daemon, tells it to get the `hello-world` image and run a container from that.
3. Docker daemon looks for the image within your local repository and realizes that it's not there, hence the `Unable to find image 'hello-world:latest' locally` line gets printed on your terminal.
4. The daemon then reaches out to the default public registry which is Docker Hub and pulls in the latest copy of the `hello-world` image, indicated by the `latest: Pulling from library/hello-world` line in your terminal.
5. Docker daemon then creates a new container from the freshly pulled image.
6. Finally Docker daemon runs the container created using the `hello-world` image outputting the wall of text on your terminal.

It's the default behavior of Docker daemon to look for images in the hub, that are not present locally. But once an image has been fetched, it'll stay in the local cache. So if you execute the command again, you won't see the following lines in the output:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete
Digest: sha256:d58e752213a51785838f9eed2b7a498ffa1cb3aa7f946dda11af39286c3db9a9
Status: Downloaded newer image for hello-world:latest
```

If there is a newer version of the image available on the public registry, the daemon will fetch the image again. That `:latest` is a tag. Images usually have meaningful tags to indicate versions or builds. You'll learn about this in greater detail later on.

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
docker <object-type> <command> <options>
```

In this syntax:

* `object-type` indicates the type of Docker object you'll be manipulating. This can be a `container`, `image`, `network` or `volume` object.
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

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/hello-dock.png)

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

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/hello-dock.png)

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

You can check the container list using the `container ls --all` command to make sure that the dangling containers have been removed:

```text
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   8 minutes ago       Up 3 minutes        0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago      Up 3 minutes        0.0.0.0:8080->80/tcp   hello-dock-container-2
```

If you are following the article exactly as written so far, you should only see the `hello-dock-container` and `hello-dock-container-2` in the list. I would suggest stopping and removing both containers before going to the next section.

There is also the `--rm` option for the `container run` and `container start` commands which indicates that you want the containers removed as soon as they're stopped. To start another `hello-dock` container with the `--rm` option, execute the following command:

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

As you may have already learned from your previous experiences with computers, shells are interactive programs. Images configured to run such a program are interactive images. These images require a special `-it` option to be passed in the `container run` command.

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
docker container run --rm busybox sh -c "echo -n my-secret | base64"

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

# Image Manipulation Basics

Now that you've a solid understanding of running containers using images available publicly, it's time for you to learn about creating your very own images.

In this section, you'll learn the fundamentals of creating images, running containers using them and sharing them online.

I would suggest you to install [Visual Studio Code](https://code.visualstudio.com/) with the official [Docker Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) from the marketplace. This will greatly help your development experience.

## Image Creation Basics

As I've already explained in the [Hello World in Docker](hello-world-in-docker.md#image) section, images are multi-layered self-contained files that act as the template for creating Docker containers. They are like a frozen, read-only copy of a container.

In order to create an image using one of your programs you must have a clear vision of what you want from the image. Take the official [nginx](https://hub.docker.com/_/nginx) image for example. You can start a container using this image simply by executing the following command:

```text
docker container run --rm --detach --name default-nginx --publish 8080:80 nginx

# b379ecd5b6b9ae27c144e4fa12bdc5d0635543666f75c14039eea8d5f38e3f56

docker container ls

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b379ecd5b6b9        nginx               "/docker-entrypoint.…"   8 seconds ago       Up 8 seconds        0.0.0.0:8080->80/tcp   default-nginx
```

Now, if you visit `http://127.0.0.1:8080` in the browser, you'll see a default response page.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/nginx-default.png)

That's all nice and good, but what if you want to make a custom NGINX image which functions exactly like the official one, but is built by you? That's completely valid scenario to be honest. In fact, let's do that.

In order to make a custom NGINX image, you must have a clear picture of what the final state of the image will be. In my opinion the image should be as follows:

* The image should have NGINX pre-installed which can be done using a package manager or can be built from source.
* The image should start NGINX automatically upon running.

That's simple. If you've cloned the project repository linked in this article, go inside the project root and look for a directory named `custom-nginx` in there. Now, create a new file named `Dockerfile` inside that directory. A `Dockerfile` is a collection of instructions that once processed by the daemon, results into an image. Content for the `Dockerfile` is as follows:

```text
FROM ubuntu:latest

EXPOSE 80

RUN apt-get update && \
    apt-get install nginx -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

Images are multi-layered files and in this file, each line \(known as instructions\) that you've written, creates a layer for your image.

* Every valid `Dockerfile` starts with a `FROM` instruction. This instruction sets the base image for your resultant image. By setting `ubuntu:latest` as the base image here, you get all the goodness of Ubuntu already available in your custom image hence, you can use things like the `apt-get` command for easy package installation.
* The `EXPOSE` instruction is used to indicate the port that needs to be published. Using this instruction doesn't mean that you won't need to `--publish` the port. You'll still need to use the `--publish` option explicitly. This `EXPOSE` instruction works like a documentation for someone who's trying to run a container using your image. It also has some other usages that I won't be discussing here.
* The `RUN` instruction in a `Dockerfile` executes a command inside the container shell. The `apt-get update && apt-get install nginx -y` command checks for updated package versions and installs NGINX. The `apt-get clean && rm -rf /var/lib/apt/lists/*` command is used for clearing the package cache because you don't want any unnecessary baggage in your image. These two commands are simple Ubuntu stuff, nothing fancy. The `RUN` instructions here, are written in `shell` form. These can also be written in `exec` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#run) for more information.
* Finally the `CMD` instruction sets the default command for your image. This instruction is written in `exec` form here comprising of three separate parts. Here, `nginx` refers to the NGINX executable. The `-g` and `daemon off` are options for NGINX. Running NGINX as a single process inside containers is considered a best practice hence the usage of this option. The `CMD` instruction can also be written in `shell` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#cmd) for more information.

Now that you have a valid `Dockerfile` you can build an image out of it. Just like the container related commands, the image related commands can be issued using the following syntax:

```text
docker image <command> <options>
```

To build an image using the `Dockerfile` you just wrote, open up your terminal inside the `custom-nginx` directory and execute the following command:

```text
docker image build .

# Sending build context to Docker daemon  3.584kB
# Step 1/4 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/4 : EXPOSE 80
#  ---> Running in 9eae86582ec7
# Removing intermediate container 9eae86582ec7
#  ---> 8235bd799a56
# Step 3/4 : RUN apt-get update &&     apt-get install nginx -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in a44725cbb3fa
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container a44725cbb3fa
#  ---> 3066bd20292d
# Step 4/4 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 4792e4691660
# Removing intermediate container 4792e4691660
#  ---> 3199372aa3fc
# Successfully built 3199372aa3fc
```

To perform an image build, the daemon needs two very specific information. These are the name of the `Dockerfile` and the build context. In the issued command above:

* `docker image build` is the command for building the image. The daemon finds any file named `Dockerfile` within the context.
* The `.` at the end sets the context for this build. The context means the directory accessible by the daemon during the build process.

Now to run a container using this image, you can use the `container run` command coupled with the image ID that you received as the result of the build process. In my case the id is `3199372aa3fc` evident by the `Successfully built 3199372aa3fc` line in the previous code block.

```text
docker container run --rm --detach --name custom-nginx-packaged --publish 8080:80 3199372aa3fc

# ec09d4e1f70c903c3b954c8d7958421cdd1ae3d079b57f929e44131fbf8069a0

docker container ls

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# ec09d4e1f70c        3199372aa3fc        "nginx -g 'daemon of…"   23 seconds ago      Up 22 seconds       0.0.0.0:8080->80/tcp   custom-nginx-packaged
```

To verify, visit `http://127.0.0.1:8080` and you should see the default response page.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/nginx-default.png)

## Tagging Images

Just like containers, you can assign custom identifiers to your images instead of relying on the randomly generated ID. In case of an image, it's called tagging instead of naming. The `--tag` or `-t` option is used in such cases. Generic syntax for the option is as follows:

```text
--tag <image repository>:<image tag>
```

The repository is usually known as the image name and tag indicates a certain build or version. Take the official [mysql](https://hub.docker.com/_/mysql) image for example. If you want to run a container using a specific version of MySQL i.e. 5.7, you can execute `docker container run mysql:5.7` where `mysql` is the image repository and `5.7` is the tag.

In order to tag your custom NGINX image with `custom-nginx:packaged` you can execute the following command:

```text
docker image build --tag custom-nginx:packaged .

# Sending build context to Docker daemon  1.055MB
# Step 1/4 : FROM ubuntu:latest
#  ---> f63181f19b2f
# Step 2/4 : EXPOSE 80
#  ---> Running in 53ab370b9efc
# Removing intermediate container 53ab370b9efc
#  ---> 6d6460a74447
# Step 3/4 : RUN apt-get update &&     apt-get install nginx -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in b4951b6b48bb
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container b4951b6b48bb
#  ---> fdc6cdd8925a
# Step 4/4 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 3bdbd2af4f0e
# Removing intermediate container 3bdbd2af4f0e
#  ---> f8837621b99d
# Successfully built f8837621b99d
# Successfully tagged custom-nginx:packaged
```

Nothing will change except the fact that you can now refer to your image as `custom-nginx:packaged` instead of some long random string.

In cases where you forgot to tag an image during build time, or maybe you want to change the tag, you can use the `image tag` command to do that:

```text
docker image tag <image id> <image repository>:<image tag>

## or ##

docker image tag <image repository>:<image tag> <new image repository>:<new image tag>
```

## Listing and Removing Images

Just like the `container ls` command, you can use the `image ls` command to list all the images in your local system:

```text
docker image ls

# REPOSITORY     TAG        IMAGE ID       CREATED         SIZE
# <none>         <none>     3199372aa3fc   7 seconds ago   132MB
# custom-nginx   packaged   f8837621b99d   4 minutes ago   132MB
```

Images listed here can be deleted using the `image rm` command. The generic syntax is as follows:

```text
docker image rm <image identifier>
```

The identifier can be the image ID or image repository. If you use the repository, you'll have to identify the tag as well. To delete the `custom-nginx:packaged` image, you may execute the following command:

```text
docker image rm custom-nginx:packaged

# Untagged: custom-nginx:packaged
# Deleted: sha256:f8837621b99d3388a9e78d9ce49fbb773017f770eea80470fb85e0052beae242
# Deleted: sha256:fdc6cdd8925ac25b9e0ed1c8539f96ad89ba1b21793d061e2349b62dd517dadf
# Deleted: sha256:c20e4aa46615fe512a4133089a5cd66f9b7da76366c96548790d5bf865bd49c4
# Deleted: sha256:6d6460a744475a357a2b631a4098aa1862d04510f3625feb316358536fcd8641
```

You can also use the `image prune` command to cleanup all un-tagged dangling images as follows:

```text
docker image prune --force

# Deleted Images:
# deleted: sha256:ba9558bdf2beda81b9acc652ce4931a85f0fc7f69dbc91b4efc4561ef7378aff
# deleted: sha256:ad9cc3ff27f0d192f8fa5fadebf813537e02e6ad472f6536847c4de183c02c81
# deleted: sha256:f1e9b82068d43c1bb04ff3e4f0085b9f8903a12b27196df7f1145aa9296c85e7
# deleted: sha256:ec16024aa036172544908ec4e5f842627d04ef99ee9b8d9aaa26b9c2a4b52baa

# Total reclaimed space: 59.19MB
```

The `--force` or `-f` option skips any confirmation questions. You can also use the `--all` or `-a` option to remove all cached images in your local registry.

## Understanding the Many Layers of an Image

From the very beginning of this article, I've been saying that images are multi-layered files. In this sub-section I'll demonstrate the various layers of an image and how they play an important role in the build process of an image. For this demonstration, I'll be using the `custom-nginx:packaged` image from the previous sub-section.

To visualize the many layers of an image, you can use the `image history` command. The various layers of the `custom-nginx:packaged` image can be visualized as follows:

```text
docker image history custom-nginx:packaged

# IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
# 7f16387f7307        5 minutes ago       /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B                             
# 587c805fe8df        5 minutes ago       /bin/sh -c apt-get update &&     apt-get ins…   60MB                
# 6fe4e51e35c1        6 minutes ago       /bin/sh -c #(nop)  EXPOSE 80                    0B                  
# d70eaf7277ea        17 hours ago        /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
# <missing>           17 hours ago        /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
# <missing>           17 hours ago        /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
# <missing>           17 hours ago        /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B                
# <missing>           17 hours ago        /bin/sh -c #(nop) ADD file:435d9776fdd3a1834…   72.9MB
```

There are eight layers of this image. The upper most layer is the latest one and as you go down, those are older layers. The upper most layer is the one that you usually use for running containers.

Now, let's have a closer look at the images beginning from image `d70eaf7277ea` to `7f16387f7307` image. I'll ignore the bottom four layers where the `IMAGE` is `<missing>` as they are not of our concern.

I've already mentioned in the previous sub-section that each instruction you write in the `Dockerfile` will create a layer in the image.

* `d70eaf7277ea` was created by `/bin/sh -c #(nop)  CMD ["/bin/bash"]` which indicates that the default shell inside Ubuntu has been loaded successfully.
* `6fe4e51e35c1` was created by `/bin/sh -c #(nop)  EXPOSE 80` which was the second instruction in your code.
* `587c805fe8df` was created by `/bin/sh -c apt-get update && apt-get install nginx -y && apt-get clean && rm -rf /var/lib/apt/lists/*` which was the third instruction in your code. You can also see that this image has a size of `60MB` given all necessary packages were installed during the execution of this instruction.
* Finally the upper most layer `7f16387f7307` was created by `/bin/sh -c #(nop)  CMD ["nginx", "-g", "daemon off;"]` which sets the default command for this image.

As you can see, the image comprises of many read-only layers each recording a new set of change to the state triggered by certain instructions. When you start a container using an image, a new layer is written on top of the other layers.

This layering phenomenon that happens every time you work with Docker has been made possible by an amazing technical concept called union file system. Here, union means union in set theory. According to [Wikipedia](https://en.wikipedia.org/wiki/UnionFS) - "It allows files and directories of separate file systems, known as branches, to be transparently overlaid, forming a single coherent file system. Contents of directories which have the same path within the merged branches will be seen together in a single merged directory, within the new, virtual filesystem."

By utilizing this concept, Docker can avoid data duplication, can use previously created layers as cache for later builds and result in compact, efficient images to be used everywhere.

## Building NGINX From Source

In the previous sub-section, you've learned about the `FROM`, `EXPOSE`, `RUN` and `CMD` instructions. In this sub-section you'll be learning a lot more about other instructions.

In this sub-section you'll again create a custom NGINX image but the twist is that you'll be building NGINX from source instead of installing it using some package manager such as `apt-get` in the previous example.

In order to build NGINX from source, you first need the source of NGINX. If you've cloned my projects repository you'll see a file named `nginx-1.19.2.tar.gz` inside the `custom-nginx` directory. You'll use this archive as the source for building NGINX.

Before diving into writing some code, let's plan out the process first. The image creation process this time can be done in seven steps. These are as follows:

* Get a good base image for building the application i.e. [ubuntu](https://hub.docker.com/_/ubuntu).
* Install necessary build dependencies on the base image.
* Copy `nginx-1.19.2.tar.gz` file inside the image.
* Extract the contents of the archive and get rid of it.
* Configure the build, compile and install the program using the `make` tool.
* Get rid of the extracted source code.
* Run `nginx` executable.

Now that you have a plan, let's begin by opening up old `Dockerfile` and update its contet as follows:

```text
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY nginx-1.19.2.tar.gz .

RUN tar -xvf nginx-1.19.2.tar.gz && rm nginx-1.19.2.tar.gz

RUN cd nginx-1.19.2 && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /nginx-1.19.2

CMD ["nginx", "-g", "daemon off;"]
```

As you can see, the code inside the `Dockerfile` reflects the seven steps I talked about beforehand.

* The `FROM` instruction sets Ubuntu as the base image making an ideal environment for building any application.
* The `RUN` instruction installs standard packages necessary for building NGINX from source.
* The `COPY` instruction here is something new. This instruction is responsible for copying the the `nginx-1.19.2.tar.gz` file inside the image. The generic syntax for the `COPY` instruction is `COPY <source> <destination>` where source is in your local filesystem and the destination is inside your image. The `.` as the destination means the working directory inside the image which is by default `/` unless set otherwise.
* The second `RUN` instruction here extracts the contents from the archive using `tar` and gets rid of it afterwards.
* The archive file contains a directory called `nginx-1.19.2` containing the source code. Hence on the next step, you'll have to `cd` inside that directory and perform the build process. You can read the [How to Install Software from Source Code… and Remove it Afterwards](https://itsfoss.com/install-software-from-source-code/) article at [It's Foss](https://itsfoss.com/) to learn more on the topic.
* Once the build and installation is complete, you remove the `nginx-1.19.2` directory using `rm` command.
* On the final step you start NGINX in single process mode just like you did before.

Now to build an image using this code, execute the following command:

```text
docker image build --tag custom-nginx:built .

# Step 1/7 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/7 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in 2d0aa912ea47
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 2d0aa912ea47
#  ---> cbe1ced3da11
# Step 3/7 : COPY nginx-1.19.2.tar.gz .
#  ---> 7202902edf3f
# Step 4/7 : RUN tar -xvf nginx-1.19.2.tar.gz && rm nginx-1.19.2.tar.gz
 ---> Running in 4a4a95643020
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 4a4a95643020
#  ---> f9dec072d6d6
# Step 5/7 : RUN cd nginx-1.19.2 &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in b07ba12f921e
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container b07ba12f921e
#  ---> 5a877edafd8b
# Step 6/7 : RUN rm -rf /nginx-1.19.2
#  ---> Running in 947e1d9ba828
# Removing intermediate container 947e1d9ba828
#  ---> a7702dc7abb7
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 3110c7fdbd57
# Removing intermediate container 3110c7fdbd57
#  ---> eae55f7369d3
# Successfully built eae55f7369d3
# Successfully tagged custom-nginx:built
```

This code is alright but there are some places where improvements can be made.

* Instead of hard coding the filename like `nginx-1.19.2.tar.gz`, you can create an argument using the `ARG` instruction. This way, you'll be able to change the version or filename by just changing the argument.
* Instead of downloading the archive manually, you can let the daemon download the file during the build process. There is another instruction like `COPY` called the `ADD` instruction which is capable of adding files from the internet.

Open up the `Dockerfile` file and update it's content as follows:

```text
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}

RUN cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /${FILENAME}}

CMD ["nginx", "-g", "daemon off;"]
```

The code is almost identical to the previous code block except a new instruction called `ARG` on line 13, 14 and the usage of the `ADD` instruction on line 16. Explanation for the updated code is as follows:

* The `ARG` instruction lets you declare variables like in other languages. These variables  or arguments can later be accessed using the `${argument name}` syntax. Here, I've put the filename `nginx-1.19.2` and the file extension `tar.gz` in two separate arguments. This way I can switch between newer versions of NGINX or the archive format by making a change in just one place. In the code above, I've added default values to the variables. Variable values can be passed as options of the `image build` command as well. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#arg) for more details.
* In the `ADD` instruction, I've formed the download URL dynamically using the arguments declared above. The `https://nginx.org/download/${FILENAME}.${EXTENSION}` line will result in something like `https://nginx.org/download/nginx-1.19.2.tar.gz` during the build process. You can change the file version or the extension by changing it in just one place thanks to the `ARG` instruction.
* The `ADD` instruction doesn't extract files obtained from the internet by default hence, the usage of `tar` on line 18.

Rest of the code is almost unchanged. You should be able to understand the usage of the arguments by yourself now. Finally let's try to build an image from this updated code.

```text
docker image build --tag custom-nginx:built-v2 .

# Step 1/9 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/9 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> cbe1ced3da11
### LONG INSTALLATION STUFF GOES HERE ###
# Step 3/9 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in 33b62a0e9ffb
# Removing intermediate container 33b62a0e9ffb
#  ---> fafc0aceb9c8
# Step 4/9 : ARG EXTENSION="tar.gz"
#  ---> Running in 5c32eeb1bb11
# Removing intermediate container 5c32eeb1bb11
#  ---> 36efdf6efacc
# Step 5/9 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> dba252f8d609
# Step 6/9 : RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}
#  ---> Running in 2f5b091b2125
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 2f5b091b2125
#  ---> 2c9a325d74f1
# Step 7/9 : RUN cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in 11cc82dd5186
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 11cc82dd5186
#  ---> 6c122e485ec8
# Step 8/9 : RUN rm -rf /${FILENAME}}
#  ---> Running in 04102366960b
# Removing intermediate container 04102366960b
#  ---> 6bfa35420a73
# Step 9/9 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 63ee44b571bb
# Removing intermediate container 63ee44b571bb
#  ---> 4ce79556db1b
# Successfully built 4ce79556db1b
# Successfully tagged custom-nginx:built-v2
```

Now you should be able to run a container using the `custom-nginx:built-v2` image.

```text
docker container run --rm --detach --name custom-nginx-built --publish 8080:80 custom-nginx:built-v2

# 90ccdbc0b598dddc4199451b2f30a942249d85a8ed21da3c8d14612f17eed0aa

docker container ls

# CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 90ccdbc0b598        custom-nginx:built-v2   "nginx -g 'daemon of…"   2 minutes ago       Up 2 minutes        0.0.0.0:8080->80/tcp   custom-nginx-built
```

A container using the `custom-nginx:built-v2` image has been successfully run. The container should be accessible at `http://127.0.0.1:8080` address now.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/nginx-default.png)

And here is the trusty default response page from NGINX. You can visit the [official reference](https://docs.docker.com/engine/reference/builder/) site to learn more about the available instructions.

## Optimizing Images

The image we built in the last sub-section is functional but very unoptimized. To prove my point let's have a look at the size of the image using the `image ls` command:

```text
docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
# custom-nginx       built     1f3aaf40bb54   16 minutes ago   343MB
```

For an image containing only NGINX, that's too much. If you pull the official image and check it's size you'll see how small it is:

```text
docker image pull nginx:stable

# stable: Pulling from library/nginx
# a076a628af6f: Pull complete 
# 45d7b5d3927d: Pull complete 
# 5e326fece82e: Pull complete 
# 30c386181b68: Pull complete 
# b15158e9ebbe: Pull complete 
# Digest: sha256:ebd0fd56eb30543a9195280eb81af2a9a8e6143496accd6a217c14b06acd1419
# Status: Downloaded newer image for nginx:stable
# docker.io/library/nginx:stable

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
# custom-nginx       built     1f3aaf40bb54   25 minutes ago   343MB
# nginx              stable    b9e1dc12387a   11 days ago      133MB
```

In order to find out the root cause, let's have a look at the `Dockerfile` first:

```text
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}

RUN cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /${FILENAME}}

CMD ["nginx", "-g", "daemon off;"]
```

As you can see on line 3, the `RUN` instruction installs a lot of stuff. Although these packages are necessary for building NGINX from source, they are not necessary for running it. Out of the 6 packages that we installed, only two are necessary for running NGINX. These are `libpcre3` and `zlib1g`. So a better idea can be to uninstall the other packages once the build process is done.

To do so, update your `Dockerfile` as follows:

```text
FROM ubuntu:latest

EXPOSE 80

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN apt-get update && \
    apt-get install build-essential \ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} && \
    cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install && \
    cd / && rm -rfv /${FILENAME} && \
    apt-get remove build-essential \ 
                    libpcre3-dev \
                    zlib1g-dev \
                    libssl-dev \
                    -y && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

As you can see, on line 10 a single `RUN` instruction is doing all the necessary heavy-lifting. The exact chain of events is as follows:

* From line 10 to line 17, all the necessary packages are being installed.
* On line 18, the source code is being extracted and the the downloaded archive gets removed.
* From line 19 to line 28, NGINX is configured, built and installed on the system.
* On line 29, the extracted files from the downloaded archive gets removed.
* From line 30 to line 36, all the unnecessary packages are being uninstalled and cache cleared. The `libpcre3` and `zlib1g` packages are needed for running NGINX hence they're kept.

You may ask why am I doing so much work in a single `RUN` instruction instead of nicely splitting them into multiple instructions, like we did previously. Well that's a mistake. If you install packages and then remove them in separate `RUN` instructions, they'll live in separate layers of the image. Although the final image will not have the removed packages, their size will still be added to the final image given they exist in one of the layers consisting the image. So make sure you make these kind of changes on a single layer.

Let's build an image using this `Dockerfile` and see the differences.

```text
docker image build --tag custom-nginx:built .

# Sending build context to Docker daemon  1.057MB
# Step 1/7 : FROM ubuntu:latest
#  ---> f63181f19b2f
# Step 2/7 : EXPOSE 80
#  ---> Running in 006f39b75964
# Removing intermediate container 006f39b75964
#  ---> 6943f7ef9376
# Step 3/7 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in ffaf89078594
# Removing intermediate container ffaf89078594
#  ---> 91b5cdb6dabe
# Step 4/7 : ARG EXTENSION="tar.gz"
#  ---> Running in d0f5188444b6
# Removing intermediate container d0f5188444b6
#  ---> 9626f941ccb2
# Step 5/7 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> a8e8dcca1be8
# Step 6/7 : RUN apt-get update &&     apt-get install build-essential                     libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} &&     cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install &&     cd / && rm -rfv /${FILENAME} &&     apt-get remove build-essential                     libpcre3-dev                     zlib1g-dev                     libssl-dev                     -y &&     apt-get autoremove -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in e5675cad1260
### LONG INSTALLATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container e5675cad1260
#  ---> dc7e4161f975
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in b579e4600247
# Removing intermediate container b579e4600247
#  ---> 512aa6a95a93
# Successfully built 512aa6a95a93
# Successfully tagged custom-nginx:built

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED              SIZE
# custom-nginx       built     512aa6a95a93   About a minute ago   81.6MB
# nginx              stable    b9e1dc12387a   11 days ago          133MB
```

As you can see, the image size has gone from being 343MB to 81.6MB. The official image is 133MB. This is a pretty optimized build but we can go a bit further in the next sub-section.

## Embracing Alpine Linux

If you've been fiddling around with containers for sometime now, you may have heard about something called [Alpine Linux](https://alpinelinux.org/) which is a full-featured [Linux](https://en.wikipedia.org/wiki/Linux) distribution like [Ubuntu](https://ubuntu.com/), [Debian](https://www.debian.org/) or [Fedora](https://getfedora.org/). But the good thing about Alpine is that it's built around `musl` `libc` and `busybox` and is lightweight. Where the latest [ubuntu](https://hub.docker.com/_/ubuntu) image weighs at around 28MB, [alpine](https://hub.docker.com/_/alpine) is 2.8MB. Apart from the lightweight nature, Alpine is also secure and is a much better fit for creating containers than the other distributions.

Although not as user friendly as the other commercial distributions, the transition to Alpine is still very simple. In this sub-section you'll learn about recreating the `custom-nginx` image by using the alpine image as its base.

Open up your `Dockerfile` and update its content as follows:

```text
FROM alpine:latest

EXPOSE 80

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN apk add --no-cache pcre zlib && \
    apk add --no-cache \
            --virtual .build-deps \
            build-base \ 
            pcre-dev \
            zlib-dev \
            openssl-dev && \
    tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} && \
    cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install && \
    cd / && rm -rfv /${FILENAME} && \
    apk del .build-deps

CMD ["nginx", "-g", "daemon off;"]
```

The code is almost identical except a few changes. I'll be listing the changes and will be explaining them as I go:

* Instead of using `apt-get install` for installing packages, we use `apk add` and the `--no-cache` option means that the downloaded package won't be cached. Likewise `apk del` is used instead of `apt-get remove` to uninstall packages.
* The `--virtual` option for `apk add` command is used for bundling a bunch of packages into a single virtual package for easier management. Packages that are needed only for building the program is labeled as `.build-deps` which is then removed on line 29 by executing `apk del .build-deps` command. You can learn more about [virtuals](https://docs.alpinelinux.org/user-handbook/0.1a/Working/apk.html#_virtuals) in the official docs.
* The package names are a bit different here. Usually every Linux distribution has its package repository available to everyone where you can search for packages. If you know the packages required for a certain task then you can just head over to the designated repository for a distribution and search for it. You can look up Alpine Linux packages on [https://pkgs.alpinelinux.org/packages](https://pkgs.alpinelinux.org/packages) link.

Now build a new image using this `Dockerfile` and see the difference in file size:

```text
docker image build --tag custom-nginx:built .

# Sending build context to Docker daemon  1.055MB
# Step 1/7 : FROM alpine:latest
#  ---> 7731472c3f2a
# Step 2/7 : EXPOSE 80
#  ---> Running in 8336cfaaa48d
# Removing intermediate container 8336cfaaa48d
#  ---> d448a9049d01
# Step 3/7 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in bb8b2eae9d74
# Removing intermediate container bb8b2eae9d74
#  ---> 87ca74f32fbe
# Step 4/7 : ARG EXTENSION="tar.gz"
#  ---> Running in aa09627fe48c
# Removing intermediate container aa09627fe48c
#  ---> 70cb557adb10
# Step 5/7 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> b9790ce0c4d6
# Step 6/7 : RUN apk add --no-cache pcre zlib &&     apk add --no-cache             --virtual .build-deps             build-base             pcre-dev             zlib-dev             openssl-dev &&     tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} &&     cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install &&     cd / && rm -rfv /${FILENAME} &&     apk del .build-deps
#  ---> Running in 0b301f64ffc1
### LONG INSTALLATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 0b301f64ffc1
#  ---> dc7e4161f975
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in b579e4600247
# Removing intermediate container b579e4600247
#  ---> 3e186a3c6830
# Successfully built 3e186a3c6830
# Successfully tagged custom-nginx:built

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED         SIZE
# custom-nginx       built     3e186a3c6830   8 seconds ago   12.8MB
```

Where the ubuntu version was 81.6MB, the alpine one has come down to 12.8MB which is a massive gain. Apart from the `apk` package manager, there are some other things that differ in Alpine from Ubuntu but they're not that much of big deal. You can just search the internet whenever you get stuck.

## Creating Executable Images

In the previous section you've worked with the [fhsinchy/rmbyext](https://hub.docker.com/r/fhsinchy/rmbyext) image. In this section you'll learn about making such an executable image. To begin with, open up the directory where you've cloned the repository that came with this article. Code for the `rmbyext` application resides inside the sub-directory with the same name.

Before you start working on the `Dockerfile` take a moment to plan out what the final output should be. In my opinion it should be like something as follows:

* The image should have python pre-installed.
* It should contain a copy of my `rmbyext` script.
* A working directory should be set where the script will be executed.
* The `rmbyext` script should be set as the entrypoint so the image can take extension names as arguments.

To build the above mentioned image, the following steps should be taken:

* Get a good base image for running python scripts i.e. [python](https://hub.docker.com/_/python).
* Set-up the working directory to an easily accessible directory.
* Install git so that the script can be installed from my github repository.
* Install the script using git and pip.
* Get rid of the build unnecessary packages.
* Set `rmbyext` as the entry-point for this image.

Now create a new `Dockerfile` inside the `rmbyext` directory and put following code in it:

```text
FROM python:3-alpine

WORKDIR /zone

RUN apk add --no-cache git && \
    pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext && \
    apk del git

ENTRYPOINT [ "rmbyext" ]
```

Explanation for the instructions in this file is as follows:

* The `FROM` instruction sets [python](https://hub.docker.com/_/python) as the base image making an ideal environment for running python scripts. The `3-alpine` tag indicates that you want the Alpine variant of Python 3.
* The `WORKDIR` instruction sets the default working directory to `/zone` here. The name of the working directory is completely random here. I found zone to be a fitting name, you may use anything you want.
* Given the `rmbyext` script is installed from GitHub, `git` is an install time dependency. The `RUN` instruction on line 5 installs `git` then installs the `rmbyext` script using git and pip. It also gets rid of `git` afterwards.
* Finally on line 9, the `ENTRYPOINT` instruction sets the `rmbyext` script as the entry-point for this image.

In this entire file, line 9 is the magic that turns this seemingly normal image to an executable one. Now to build the image you can execute following command:

```text
docker image build --tag rmbyext .

# Sending build context to Docker daemon  2.048kB
# Step 1/4 : FROM python:3-alpine
# 3-alpine: Pulling from library/python
# 801bfaa63ef2: Already exists 
# 8723b2b92bec: Already exists 
# 4e07029ccd64: Already exists 
# 594990504179: Already exists 
# 140d7fec7322: Already exists 
# Digest: sha256:7492c1f615e3651629bd6c61777e9660caa3819cf3561a47d1d526dfeee02cf6
# Status: Downloaded newer image for python:3-alpine
#  ---> d4d4f50f871a
# Step 2/4 : WORKDIR /zone
#  ---> Running in 454374612a91
# Removing intermediate container 454374612a91
#  ---> 7f7e49bc98d2
# Step 3/4 : RUN apk add --no-cache git &&     pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext &&     apk del git
#  ---> Running in 27e2e96dc95a
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 27e2e96dc95a
#  ---> 3c7389432e36
# Step 4/4 : ENTRYPOINT [ "rmbyext" ]
#  ---> Running in f239bbea1ca6
# Removing intermediate container f239bbea1ca6
#  ---> 1746b0cedbc7
# Successfully built 1746b0cedbc7
# Successfully tagged rmbyext:latest

docker image ls

# REPOSITORY         TAG        IMAGE ID       CREATED         SIZE
# rmbyext            latest     1746b0cedbc7   4 minutes ago   50.9MB
```

Here I haven't provided any tag after the image name so the image has been tagged as `latest` by default. You should be able to run the image as you saw in the previous section. Remember to refer to the actual image name you've set, instead of `fhsinchy/rmbyext` here.

## Sharing Your Images Online

Now that you know how to make images, it's time to share them with the world. Sharing images online is easy. All you need is an account at any of the online registries. I'll be using [Docker Hub](https://hub.docker.com/) here. Navigate to the [Sign Up](https://hub.docker.com/signup) page and create a free account. A free account allows you to host unlimited public repositories and one private repository.

Once you've created the account, you'll have to sign in to it using the docker CLI. So open up your terminal and execute following command to do so:

```text
docker login

# Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
# Username: fhsinchy
# Password: 
# WARNING! Your password will be stored unencrypted in /home/fhsinchy/.docker/config.json.
# Configure a credential helper to remove this warning. See
# https://docs.docker.com/engine/reference/commandline/login/#credentials-store
#
# Login Succeeded
```

You'll be prompted for your username and password. If you input them properly, you should be logged in to your account successfully.

In order to share an image online, the image has to be tagged. You've already learned about tagging in a previous sub-section. Just to refresh your memory, the generic syntax for the `--tag` or `-t` option is as follows:

```text
--tag <image repository>:<image tag>
```

As an example, let's share the `custom-nginx` image online. To do so, open up a new terminal window inside the `custom-nginx` project directory. To share an image online, you'll have to tag it following the `<docker hub username>/<image name>:<image tag>` syntax. My username is `fhsinchy` so the command will look like as follows:

```text
docker image build --tag fhsinchy/custom-nginx:latest --file Dockerfile.built .

# Step 1/9 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/9 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> cbe1ced3da11
### LONG INSTALLATION STUFF GOES HERE ###
# Step 3/9 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in 33b62a0e9ffb
# Removing intermediate container 33b62a0e9ffb
#  ---> fafc0aceb9c8
# Step 4/9 : ARG EXTENSION="tar.gz"
#  ---> Running in 5c32eeb1bb11
# Removing intermediate container 5c32eeb1bb11
#  ---> 36efdf6efacc
# Step 5/9 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> dba252f8d609
# Step 6/9 : RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}
#  ---> Running in 2f5b091b2125
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 2f5b091b2125
#  ---> 2c9a325d74f1
# Step 7/9 : RUN cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in 11cc82dd5186
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 11cc82dd5186
#  ---> 6c122e485ec8
# Step 8/9 : RUN rm -rf /${FILENAME}}
#  ---> Running in 04102366960b
# Removing intermediate container 04102366960b
#  ---> 6bfa35420a73
# Step 9/9 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 63ee44b571bb
# Removing intermediate container 63ee44b571bb
#  ---> 4ce79556db1b
# Successfully built 4ce79556db1b
# Successfully tagged fhsinchy/custom-nginx:latest
```

In this command the `fhsinchy/custom-nginx` is the image repository and `latest` is the tag. The image name can be anything you want and can not be changed once you've uploaded the image. The tag can be changed whenever you want and usually reflects the version of the software or different kind of builds.

Take the `node` image as an example. The `node:lts` image refers to the long term support version of Node.js whereas the `node:lts-alpine` version refers to the Node.js version built for Alpine Linux which is much smaller than the regular one.

If you do not give the image any tag, it'll be automatically tagged as `latest`. But that doesn't mean that the `latest` tag will always refer to the latest version. If for some reason you explicitly tag an older version of the image as `latest` then Docker will not make any extra effort to cross check that.

Once the image has been built, you can then upload that by executing the following command:

```text
docker image push <image repository>:<image tag>
```

So in my case the command will be as follows:

```text
docker image push fhsinchy/custom-nginx:latest

# The push refers to repository [docker.io/fhsinchy/custom-nginx]
# 4352b1b1d9f5: Pushed 
# a4518dd720bd: Pushed 
# 1d756dc4e694: Pushed 
# d7a7e2b6321a: Pushed 
# f6253634dc78: Mounted from library/ubuntu 
# 9069f84dbbe9: Mounted from library/ubuntu 
# bacd3af13903: Mounted from library/ubuntu 
# latest: digest: sha256:ffe93440256c9edb2ed67bf3bba3c204fec3a46a36ac53358899ce1a9eee497a size: 1788
```

Depending on the image size, the upload may take some time. Once it's done you should be able to find the image in your hub profile page.

# Containerizing a JavaScript Application

Now that you've got some idea of creating images, it's time to work with something a bit more relevant. In this sub-section, you'll be working with the source code of the [fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock) image that you worked with on a previous section. In the process of containerizing this very simple application, you'll be introduced to volumes and multi-staged builds, two of the most important concepts in Docker.

## Writing The Development Dockerfile

To begin with, open up the directory where you've cloned the repository that came with this article. Code for the `hello-dock` application resides inside the sub-directory with the same name.

This is a very simple JavaScript project powered by the [vitejs/vite](https://github.com/vitejs/vite) project. Don't worry though, you don't need to know JavaScript or vite in order to go through this sub-section. Having a basic understanding of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) will suffice.

Just like any other project you've done in the previous sub-section, you'll begin by making a plan of how you want this application to run. In my opinion, the plan should be as follows:

* Get a good base image for running JavaScript applications i.e. [node](https://hub.docker.com/_/node).
* Set the default working directory inside the image.
* Copy the `package.json` file into the image.
* Install necessary dependencies.
* Copy rest of the project files.
* Start the `vite` development server by executing `npm run dev` command.

This plan should always come from the developer of the application that you're containerizing. If you're the developer yourself, then you should already have a proper understanding of how this application needs to be run. Now if you put the above mentioned plan inside `Dockerfile.dev`, the file should look like as follows:

```text
FROM node:lts-alpine

EXPOSE 3000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

Explanation for this code is as follows:

* The `FROM` instruction here sets the official Node.js image as the base giving you all the goodness of Node.js necessary to run any JavaScript application. The `lts-alpine` tag indicates that you want to use the Alpine variant, long term support version of the image. Available tags and necessary documentation for the image can be found on [node](https://hub.docker.com/_/node) hub page.
* The `USER` instruction sets the default user for the image to `node`. By default Docker runs containers as the root user and according to [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md) this can pose a security threat. So a better idea is to run as a non-root user whenever possible. The node image comes with a non-root user named `node` which you can set as the default user using the `USER` instruction.
* The `RUN mkdir -p /home/node/app` instruction creates a directory called `app` inside the home directory of the `node` user. The home directory for any non-root user in Linux is usually  `/home/<user name>` by default.
* Then the `WORKDIR` instruction sets the default working directory to the newly created `/home/node/app` directory. By default the working directory of any image is the root. You don't want any unnecessary files sprayed all over your root directory, do you? Hence you change the default working directory to something more sensible like `/home/node/app` or whatever you like. This working directory will be applicable to any subsequent `COPY`, `ADD`, `RUN` and `CMD` instructions.
* The `COPY` instruction here copies the `package.json` file which contains information regarding all the necessary dependencies for this application. The `RUN` instruction executes `npm install` command which is the default command for installing dependencies using a `package.json` file in Node.js projects. The `.` at the end represents the working directory.
* The second `COPY` instruction copies rest of the content from the current directory \(`.`\) of the host filesystem to the working directory \(`.`\) inside the image.
* Finally, the `CMD` instruction here sets the default command for this image which is `npm run dev` written in `exec` form.
* The `vite` development server by default runs on port `3000` hence adding an `EXPOSE` command seemed like a good idea, so there you go.

Now, to build an image from this `Dockerfile.dev` you can execute the following command:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Step 1/7 : FROM node:lts
#  ---> b90fa0d7cbd1
# Step 2/7 : EXPOSE 3000
#  ---> Running in 722d639badc7
# Removing intermediate container 722d639badc7
#  ---> e2a8aa88790e
# Step 3/7 : WORKDIR /app
#  ---> Running in 998e254b4d22
# Removing intermediate container 998e254b4d22
#  ---> 6bd4c42892a4
# Step 4/7 : COPY ./package.json .
#  ---> 24fc5164a1dc
# Step 5/7 : RUN npm install
#  ---> Running in 23b4de3f930b
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 23b4de3f930b
#  ---> c17ecb19a210
# Step 6/7 : COPY . .
#  ---> afb6d9a1bc76
# Step 7/7 : CMD [ "npm", "run", "dev" ]
#  ---> Running in a7ff529c28fe
# Removing intermediate container a7ff529c28fe
#  ---> 1792250adb79
# Successfully built 1792250adb79
# Successfully tagged hello-dock:dev
```

Given the filename is not `Dockerfile` you have to explicitly pass the filename using the `--file` option. A container can be run using this image by executing the following command:

```text
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    hello-dock:dev

# 21b9b1499d195d85e81f0e8bce08f43a64b63d589c5f15cbbd0b9c0cb07ae268
```

Now visit `http://127.0.0.1:3000` to see the `hello-dock` application in action.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/hello-dock-dev.png)

Congratulations on running your first real-world application inside a container. The code you've just written is okay but there is one big issue with it and there are a few places where it can be improved. Let's begin with the issue first.

## Working With Bind Mounts

If you've worked with any front-end JavaScript framework before, you should know that the development servers in these frameworks usually come with a hot reload feature. That is if you make a change in your code, the server will reload automatically reflecting any changes you've made immediately.

But if you make any change in your code right now, you'll see nothing happening to your application running in the browser. The reason behind this is the fact that you're making changes in the code that you have in your local file system but the application you're seeing in the browser resides inside the container file system.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/local-vs-container-file-system.svg)

To solve this issue, you can again make use of a [bind mount](https://docs.docker.com/storage/bind-mounts/). You've already had a brief encounter of bind mounts in the [Working With Executable Images](container-manipulation-basics.md#working-with-executable-images) sub-section.

Using bind mounts, you can easily mount one of your local file system directory inside a container. Instead of making a copy of the local file system, the bind mount can reference the local file system directly from inside the container.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/bind-mounts.svg)

This way, any changes you make to your local source code will reflect immediately inside the container,  triggering the hot reload feature of `vite` development server. Changes made to the file system inside the container will reflect on your local file system as well.

You've already learned in the [Working With Executable Images](container-manipulation-basics.md#working-with-executable-images) sub-section, bind mounts can be created using the `--volume` or `-v` option for the `container run` or `container start` commands. Just to remind you, the generic syntax is as follows: 

```text
--volume <local file system directory absolute path>:<container file system directory absolute path>:<read write access>
```

Stop your previously started `hello-dock-dev` container, and start a new container by executing the following command:

```text
docker container run \
    --rm \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd):/home/node/app \
    hello-dock:dev

# sh: 1: vite: not found
# npm ERR! code ELIFECYCLE
# npm ERR! syscall spawn
# npm ERR! file sh
# npm ERR! errno ENOENT
# npm ERR! hello-dock@0.0.0 dev: `vite`
# npm ERR! spawn ENOENT
# npm ERR!
# npm ERR! Failed at the hello-dock@0.0.0 dev script.
# npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
# npm WARN Local package.json exists, but node_modules missing, did you mean to install?
```

Keep in mind, I've omitted the `--detach` option and that's to demonstrate a very important point. As you can see that the application is not running at all now.

That's because although the usage of a volume solves the issue of hot reloads, it introduces another one. If you have any previous experience with Node.js, you may know that the dependencies of a Node.js project lives inside the `node_modules` directory on the project root.

Now that you're mounting the project root on your local file system as a volume inside the container, the content inside the container gets replaced along with the `node_modules` directory containing all the dependencies.  Hence the `vite` package goes missing.

## Working With Anonymous Volumes

This problem here can be solved using an anonymous volume. An anonymous volume is identical to a bind mount except the fact that you don't need to specify the source directory here. The generic syntax for creating an anonymous volume is as follows:

```text
--volume <container file system directory absolute path>:<read write access>
```

So the final command for starting the `hello-dock` container with both volumes should be as follows:

```text
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd):/home/node/app \
    --volume /home/node/app/node_modules \
    hello-dock:dev

# 53d1cfdb3ef148eb6370e338749836160f75f076d0fbec3c2a9b059a8992de8b
```

Here, Docker will take the entire `node_modules` directory from inside the container and tuck it away in some other directory managed by the Docker daemon on your host file system and will mount that directory as `node_modules` inside the container.

## Performing Multi-Staged Builds

So far in this section, you've built an image for running a JavaScript application in development mode. Now if you want to build the image in production mode, some new challenges show up. In development mode the `npm run serve` command starts a development server that serves the application to the user. That server not only serves the files but also provides the hot reload feature.

In production mode, the `npm run build` command compiles all your JavaScript code into some static HTML, CSS and JavaScript files. To run these files you don't need node or any other runtime dependencies. All you need is a server like `nginx` for example.

So to create an image where the application runs in production mode, you can take the following steps:

* Use `node` as the base image and build the application.
* Install `nginx` inside the node image and use that to serve the static files.

This approach is a completely valid but the problem is that the `node` image is big and most of the stuff it carries is unnecessary to serve your static files. A better approach to this scenario is as follows:

* Use `node` image as the base and build the application.
* Copy the files created using the `node` image to a `nginx` image.
* Create the final image based on `nginx` and discard all `node` related stuff.

This way your image only contains the files that are needed and becomes really handy. This approach is a multi-staged build. To perform such a build, create a new `Dockerfile` inside your `hello-dock` project directory and put following content in there:

```text
FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html
```

As you can see the `Dockerfile` looks a lot like your previous ones with a few oddities. Explanation for this file is as follows:

* Line 1 starts the first stage of the build using `node:lts-alpine` as the base image. The `as builder` syntax assigns a name to this stage so that it can be referred to later on.
* From line 3 to line 9, it's standard stuff that you've seen many times before. The `RUN npm run build` command actually compiles the entire application and tucks it inside `/app/dist` directory where `/app` is the working directory and `/dist` is the default output directory for `vite` applications.
* Line 11 starts the second stage of the build using `nginx:stable-alpine` as the base image.
* The NGINX server runs on port 80 by default hence the line `EXPOSE 80` is added.
* The last line is a `COPY` instruction. The `--from=builder` part indicates that you want to copy some files from the `builder` stage. After that it's a standard copy instruction where `/app/dist` is the source and `/usr/share/nginx/html` is the destination. The destination used here is the default site path for NGINX so any static file you put inside there will be automatically served.

As you can see the resultant image is a `nginx` base image containing only the files necessary for running the application. To build this image execute following command:

```text
docker image build --tag hello-dock:prod .

# Step 1/9 : FROM node:lts-alpine as builder
#  ---> 72aaced1868f
# Step 2/9 : WORKDIR /app
#  ---> Running in e361c5c866dd
# Removing intermediate container e361c5c866dd
#  ---> 241b4b97b34c
# Step 3/9 : COPY ./package.json ./
#  ---> 6c594c5d2300
# Step 4/9 : RUN npm install
#  ---> Running in 6dfabf0ee9f8
# npm WARN deprecated fsevents@2.1.3: Please update to v 2.2.x
#
# > esbuild@0.8.29 postinstall /app/node_modules/esbuild
# > node install.js
#
# npm notice created a lockfile as package-lock.json. You should commit this file.
# npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules/chokidar/node_modules/fsevents):
# npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
# npm WARN hello-dock@0.0.0 No description
# npm WARN hello-dock@0.0.0 No repository field.
# npm WARN hello-dock@0.0.0 No license field.
#
# added 327 packages from 301 contributors and audited 329 packages in 35.971s
#
# 26 packages are looking for funding
#   run `npm fund` for details
#
# found 0 vulnerabilities
#
# Removing intermediate container 6dfabf0ee9f8
#  ---> 21fd1b065314
# Step 5/9 : COPY . .
#  ---> 43243f95bff7
# Step 6/9 : RUN npm run build
#  ---> Running in 4d918cf18584
#
# > hello-dock@0.0.0 build /app
# > vite build
#
# - Building production bundle...
#
# [write] dist/index.html 0.39kb, brotli: 0.15kb
# [write] dist/_assets/docker-handbook-github.3adb4865.webp 12.32kb
# [write] dist/_assets/index.eabcae90.js 42.56kb, brotli: 15.40kb
# [write] dist/_assets/style.0637ccc5.css 0.16kb, brotli: 0.10kb
# - Building production bundle...
#
# Build completed in 1.71s.
#
# Removing intermediate container 4d918cf18584
#  ---> 187fb3e82d0d
# Step 7/9 : EXPOSE 80
#  ---> Running in b3aab5cf5975
# Removing intermediate container b3aab5cf5975
#  ---> d6fcc058cfda
# Step 8/9 : FROM nginx:stable-alpine
# stable: Pulling from library/nginx
# 6ec7b7d162b2: Already exists 
# 43876acb2da3: Pull complete 
# 7a79edd1e27b: Pull complete 
# eea03077c87e: Pull complete 
# eba7631b45c5: Pull complete 
# Digest: sha256:2eea9f5d6fff078ad6cc6c961ab11b8314efd91fb8480b5d054c7057a619e0c3
# Status: Downloaded newer image for nginx:stable
#  ---> 05f64a802c26
# Step 9/9 : COPY --from=builder /app/dist /usr/share/nginx/html
#  ---> 8c6dfc34a10d
# Successfully built 8c6dfc34a10d
# Successfully tagged hello-dock:prod
```

Once the image has been built, you may run a new container by executing the following command:

```text
docker container run \
    --rm \
    --detach \
    --name hello-dock-prod \
    --publish 8080:80 \
    hello-dock:prod

# 224aaba432bb09aca518fdd0365875895c2f5121eb668b2e7b2d5a99c019b953
```

The running application should be available on `http://127.0.0.1:8080` address:

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/hello-dock-prod.png)

Here you can see my `hello-dock` application in all it's glory. Multi-staged builds can be very useful if you're building large applications with a lot of dependencies. If configured properly, images built in multiple stages can be very optimized and compact.

## Ignoring Unnecessary Files

If you've been working with `git` for some time now, you may know about the `.gitignore` files in projects, containing a list of files and directories to be excluded from the repository. Well Docker has a similar concept. The `.dockerignore` file contains a list of files and directories to be excluded from image builds. You can find a pre-created `.dockerignore` file in the `hello-dock` directory.

```text
.git
*Dockerfile*
*docker-compose*
node_modules
```

This `.dockerignore` file has to be in the build context. Files and directories mentioned here will be ignored by the `COPY` instruction but if you do a bind mount, the `.dockerignore` file will have no effect. I've added `.dockerignore` files where necessary in the project repository.

# Network Manipulation Basics

So far in this article, you've only worked with single container projects. But in real life, the majority of projects that you'll have to work with will have at least more than one container and to be honest, working with a bunch of containers can be a little difficult if you don't understand the nuances of container isolation. So in this section of the article you'll get familiar with basic networking with Docker and will work hands on with a small multi-container project.

Well you've already learned in the previous section that containers are isolated environments. Now consider a scenario where you have a `notes-api` application powered by [Express.js](https://expressjs.com/) and a [PostgreSQL](https://www.postgresql.org/) database server running in two separate containers.

These two containers are completely isolated from each other and oblivious about each other's existence. **So how do you connect the two? Ain't that a challenge?**

You may think of two possible solution to this problem. They are as follows:

* Accessing the database server using an exposed port.
* Accessing the database server using its IP address and default port.

The first one is exposing a port from the `postgres` container and the `notes-api` will connect through that. Assuming that the exposed port from the `postgres` container is 5432. Now if you try to connect to `127.0.0.1:5432` from inside the `notes-api` container, you'll find that the `notes-api` can't find the database server at all.

The reason is that when you're saying `127.0.0.1` inside the `notes-api` container, you're simply referring to the `localhost` of that container and that container only. The `postgres` server simply doesn't exist there. As a result the `notes-api` application failed to connect.

The second solution you may think of is finding the exact IP address of the `postgres` container using `container inspect` command and use that with the port. Assuming the name of the `postgres` container is `notes-api-db-server` you can easily get the IP address by executing the following command:

```text
docker container inspect --format='{{range .NetworkSettings.Networks}} {{.IPAddress}} {{end}}' notes-api-db-server

#  172.17.0.2
```

Now given the default port for `postgres` is `5432`, you can very easily access the database server by connecting to `172.17.0.2:5432` from the `notes-api` container.

There are problems in this approach as well. Using IP addresses to refer to a container is not recommended. Also, if the container gets destroyed and recreated, the IP address may change. Keeping track of these changing IP addresses can be pretty hectic.

Now that I've dismissed the possible wrong answers to the original question, the correct answer is, **you connect them by putting them under a user-defined bridge network.**

## **Network Basics**

Network in Docker is another logical object like container and image. Just like the other two, there is a plethora of commands under the `docker network` group for manipulating networks. To list out the networks in your system, execute the following command:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

You should see three networks in your system. Now look at the `DRIVER` column of the table here. These drivers are can be treated as the type of network. By default, Docker has five networking drivers. They are as follows:

* `bridge` - The default networking driver in Docker. This can be used when multiple containers are running in standard mode and needs to communicate with each other.
* `host` - Removes the network isolation completely. Any container running under a `host` network is basically attached to the network of the host system.
* `none` - This driver disables networking for containers altogether. I haven't' found any use-case for this yet.
* `overlay` - This is used for connecting multiple Docker daemons across computers and is out of the scope of this article.
* `macvlan` - Allows assignment of MAC addresses to containers making them function like physical devices in a network.

There are also third-party plugins that allow you to integrate Docker with specialized network stacks. Out of the five mentioned above, you'll only work with `bridge` networking driver in this article.

## Creating a User-Defined Bridge

Before you start creating your own bridge, I would like to take some time to discuss the default bridge network that comes with Docker. Let's begin by listing all the networks on your system:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

As you can see, Docker comes with a default bridge network named `bridge`. Any container you run will be automatically attached to this bridge network:

```text
docker container run --rm --detach --name hello-dock --publish 8080:80 fhsinchy/hello-dock
# a37f723dad3ae793ce40f97eb6bb236761baa92d72a2c27c24fc7fda0756657d

docker network inspect --format='{{range .Containers}}{{.Name}}{{end}}' bridge
# hello-dock
```

Containers attached to the default bridge network can communicate with each others using IP addresses which I have already discouraged on the previous sub-section.

A user-defined bridge however has some extra feature over the default one. According to the official [docs](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge) on this topic, some notable extra features are as follows:

* **User-defined bridges provide automatic DNS resolution between containers:** This means containers attached to the same network can communicate with each others using the container name. So if you have two containers named `notes-api` and `notes-db` the API container will be able to connect to the database container using the `notes-db` name.
* **User-defined bridges provide better isolation:** All containers are attached to the default bridge network by default which can cause conflicts among them. Attaching containers to a user-defined bridge can ensure better isolation.
* **Containers can be attached and detached from user-defined networks on the fly:** During a container’s lifetime, you can connect or disconnect it from user-defined networks on the fly. To remove a container from the default bridge network, you need to stop the container and recreate it with different network options.

Now that you've learned quite a lot about a user-defined network, it's time to create one for yourself. A network can be created using the `network create` command. The generic syntax for the command is as follows:

```text
docker network create <network name>
```

To create a network with the name `skynet` execute the following command:

```text
docker network create skynet

# 7bd5f351aa892ac6ec15fed8619fc3bbb95a7dcdd58980c28304627c8f7eb070

docker network ls

# NETWORK ID     NAME     DRIVER    SCOPE
# be0cab667c4b   bridge   bridge    local
# 124dccee067f   host     host      local
# 506e3822bf1f   none     null      local
# 7bd5f351aa89   skynet   bridge    local
```

As you can see a new network has been created with the given name. No container is currently attached to this network. In the next sub-section, you'll learn about attaching containers to a network.

## Attaching Containers to a Network

There are mostly two ways of attaching a container to a network. You can use the `network connect` command to attach a container to a network. The generic syntax for the command is as follows:

```text
docker network connect <network identifier> <container identifier>
```

To connect the `hello-dock` container to the `skynet` network, you can execute the following command:

```text
docker network connect skynet hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' skynet

#  hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' bridge

#  hello-dock
```

As you can see from the outputs of the two `network inspect` commands, the `hello-dock` container is now attached to both the `skynet` and the default `bridge` network.

The second way of attaching a container to a network is by using the `--network` option for `container run` or `container create` commands. The generic syntax for the option is as follows:

```text
--network <network identifier>
```

To run another `hello-dock` container to the attached to the same network, you can execute the following command:

```text
docker container run --network skynet --rm --name alpine-box -it alpine sh

# lands you into alpine linux shell

/ # ping hello-dock

# PING hello-dock (172.18.0.2): 56 data bytes
# 64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.191 ms
# 64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.103 ms
# 64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.139 ms
# 64 bytes from 172.18.0.2: seq=3 ttl=64 time=0.142 ms
# 64 bytes from 172.18.0.2: seq=4 ttl=64 time=0.146 ms
# 64 bytes from 172.18.0.2: seq=5 ttl=64 time=0.095 ms
# 64 bytes from 172.18.0.2: seq=6 ttl=64 time=0.181 ms
# 64 bytes from 172.18.0.2: seq=7 ttl=64 time=0.138 ms
# 64 bytes from 172.18.0.2: seq=8 ttl=64 time=0.158 ms
# 64 bytes from 172.18.0.2: seq=9 ttl=64 time=0.137 ms
# 64 bytes from 172.18.0.2: seq=10 ttl=64 time=0.145 ms
# 64 bytes from 172.18.0.2: seq=11 ttl=64 time=0.138 ms
# 64 bytes from 172.18.0.2: seq=12 ttl=64 time=0.085 ms

--- hello-dock ping statistics ---
13 packets transmitted, 13 packets received, 0% packet loss
round-trip min/avg/max = 0.085/0.138/0.191 ms
```

As you can see, running `ping hello-dock` from inside the `alpine-box` container works because both of the containers are under the same user-defined bridge network and automatic DNS resolution is working.

Keep in mind though, in order for the automatic DNS resolution to work you must assign custom names to the containers. Using the randomly generated name will not work.

## Detaching Containers from a Network

In the previous sub-section you've learned about attaching containers to a network. In this sub-section, you'll learn about how to detach them. The `network disconnect` command can be used for this task. The generic syntax for the command is as follows:

```text
docker network disconnect <network identifier> <container identifier>
```

To detach the `hello-dock` container from the `skynet` network, you can execute the following command:

```text
docker network disconnect skynet hello-dock
```

Just like the `network connect` command, the `network disconnect` command doesn't give any output either.

## Getting Rid of Networks

Just like the other logical objects in Docker, networks can be removed using the `network rm` command. The generic syntax for the command is as follows:

```text
docker network rm <network identifier>
```

To remove the `skynet` network from your system, you can execute the following command:

```text
docker network rm skynet
```

You can also use the `network prune` command to remove any unused networks from your system. The command also has the `-f` or `--force` and `-a` or `--all` options.

# Containerizing a Multi-Container JavaScript Application

Now that you've learned enough about networks in Docker, in this sub-section you'll learn to containerize a full-fledged multi-container project. The project you'll be working with is a simple `notes-api` powered by Express.js and PostgreSQL.

In this project there are two containers in total that you'll have to connect using a network. Apart from this, you'll also learn about concepts like environment variables and named volumes. So without further ado, lets jump right in.

## Setting Up The Custom Bridge Network

As you've learned in the previous section, the containers have to be attached to a user-defined bridge network in order to communicate with each other using container names. To do so, create a network named notes-api-network in your system:

```text
docker network create notes-api-network
```

## Running the Database Server

The database server in this project is a simple PostgreSQL server and uses the official [postgres](https://hub.docker.com/_/postgres) image. According to the official docs, in order to run a container with this image, you must provide the `POSTGRES_PASSWORD` environment variable. Apart from this one, I'll also provide a name for the default database using the `POSTGRES_DB` environment variable. PostgreSQL by default listens on `5432` port, so you need to publish that as well.

To run the database server you can execute the following command:

```text
docker container run \
    --detach \
    --name=notes-db \
    --env POSTGRES_DB=notesdb \
    --env POSTGRES_PASSWORD=secret \
    --network=notes-api-network \
    postgres:12

# a7b287d34d96c8e81a63949c57b83d7c1d71b5660c87f5172f074bd1606196dc

docker container ls

# CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS      NAMES
# a7b287d34d96   postgres:12   "docker-entrypoint.s…"   About a minute ago   Up About a minute   5432/tcp   notes-db
```

The `--env` option for the `container run` and `container create` commands can be used for providing environment variables to a container. As you can see, the database container has been created successfully and is running now.

Although the container is running, there is a small problem. Databases like PostgreSQL, MongoDB, MySQL persist their data in a directory. PostgreSQL uses the `/var/lib/postgresql/data` directory inside the container to persist data. Now what if the container gets destroyed for some reason? You'll lose all your data. To solve this problem, a named volume can be used.

## Working With Named Volumes

Previously you've worked with bind mounts and anonymous volumes. A named volume is very similar to an anonymous volume except the fact that you can refer to a named volume using its name. Volumes are also logical objects in Docker and can be manipulated using the CLI. The `volume create` command can be used for creating a named volume.

The generic syntax for the command is as follows:

```text
docker volume create <volume name>
```

To create a volume named `notes-db-data` you can execute the following command:

```text
docker volume create notes-db-data

# notes-db-data

docker volume ls

# DRIVER    VOLUME NAME
# local     notes-db-data
```

This volume can now be mounted to `/var/lib/postgresql/data` inside the `notes-db` container. To do so, stop and remove the `notes-db` container:

```text
docker container stop notes-db

# notes-db

docker container rm notes-db

# notes-db
```

Now run a new container and assign the volume using the `--volume` or `-v` option.

```text
docker container run \
    --detach \
    --volume notes-db-data:/var/lib/postgresql/data \
    --name=notes-db \
    --env POSTGRES_DB=notesdb \
    --env POSTGRES_PASSWORD=secret \
    --network=notes-api-network \
    postgres:12

# 37755e86d62794ed3e67c19d0cd1eba431e26ab56099b92a3456908c1d346791
```

Now inspect the `notes-db` container to make sure that the mounting was successful:

```text
docker container inspect --format='{{range .Mounts}} {{ .Name }} {{end}}' notes-db

#  notes-db-data
```

Now the data will be safely stored inside the `notes-db-data` volume and can be reused in the future. A bind mount can also be used instead of a named volume here, but I prefer a named volume in such scenarios.

## Accessing Logs From a Container

In order to see the logs from a container, you can use the `container logs` command. The generic syntax for the command is as follows:

```text
docker container logs <container identifier>
```

To access the logs from the `notes-db` container, you can execute the following command:

```text
docker container logs notes-db

# The files belonging to this database system will be owned by user "postgres".
# This user must also own the server process.

# The database cluster will be initialized with locale "en_US.utf8".
# The default database encoding has accordingly been set to "UTF8".
# The default text search configuration will be set to "english".
#
# Data page checksums are disabled.
#
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
#
#
# Success. You can now start the database server using:
#
#     pg_ctl -D /var/lib/postgresql/data -l logfile start
#
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
#
#
# /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
#
# 2021-01-25 13:39:22.008 UTC [47] LOG:  received fast shutdown request
# waiting for server to shut down....2021-01-25 13:39:22.015 UTC [47] LOG:  aborting any active transactions
# 2021-01-25 13:39:22.017 UTC [47] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
# 2021-01-25 13:39:22.017 UTC [49] LOG:  shutting down
# 2021-01-25 13:39:22.056 UTC [47] LOG:  database system is shut down
#  done
# server stopped
#
# PostgreSQL init process complete; ready for start up.
#
# 2021-01-25 13:39:22.135 UTC [1] LOG:  starting PostgreSQL 12.5 (Debian 12.5-1.pgdg100+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 8.3.0-6) 8.3.0, 64-bit
# 2021-01-25 13:39:22.136 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
# 2021-01-25 13:39:22.136 UTC [1] LOG:  listening on IPv6 address "::", port 5432
# 2021-01-25 13:39:22.147 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
# 2021-01-25 13:39:22.177 UTC [75] LOG:  database system was shut down at 2021-01-25 13:39:22 UTC
# 2021-01-25 13:39:22.190 UTC [1] LOG:  database system is ready to accept connections
```

Evident by the text in line 57, the database is up and ready for accepting connections from the outside. There is also the `--follow` or `-f` option for the command which lets you attach the console to the logs output and get a continuous stream of text.

## Attaching The Database Server \(in case you missed it earlier\)

Your container should be connected to the network "notes-api-network" now. Recall that you can use `docker network inspect --format='{{range .Containers}}{{.Name}}{{end}}' notes-api-network` to verify, and it should look like this:

```text
docker network inspect --format='{{range .Containers}}{{.Name}}{{end}}' notes-api-network

# notes-db
```

If that command instead returns a blank line, you can attach the `notes-db` container to this network by executing the following command:

```text
docker network connect notes-api-network notes-db
```

## Writing The Dockerfile

Go to the directory where you've cloned the project codes. Inside there, go inside the `notes-api/api` directory, and create a new `Dockerfile` in there. Put following code in the file:

```text
# stage one
FROM node:lts-alpine as builder

# install dependencies for node-gyp
RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
RUN npm install --only=prod

# stage two
FROM node:lts-alpine

EXPOSE 3000
ENV NODE_ENV=production

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=builder /app/node_modules  /home/node/app/node_modules

CMD [ "node", "bin/www" ]
```

This is a multi-staged build. The first stage is used for building and installing the dependencies using `node-gyp` and the second stage is for running the application. I'll go through the steps briefly:

* Stage 1 uses `node:lts-alpine` as its base and uses `builder` as the stage name.
* On line 5, we install `python`, `make` and `g++`. The `node-gyp` tool requires these three packages to run.
* On line 7, we set `/app` directory as the `WORKDIR` .
* On line 9 and 10, we copy the `package.json` file to the `WORKDIR` and installs all the dependencies.
* Stage 2 also uses `node-lts:alpine` as the base.
* On line 16, we set the `NODE_ENV` environment variable to `production`. This is important for the API to run properly.
* From line 18 to line 20, we set the default user to `node`, create the `/home/node/app` directory and set that as the `WORKDIR`.
* On line 22, we copy all the project files and on line 23 we copy the `node_modules` directory from the `builder` stage. This directory contains all the built dependencies necessary for running the application.
* On line 25, we set the default command.

To build an image from this `Dockerfile`, you can execute the following command:

```text
docker image build --tag notes-api .

# Sending build context to Docker daemon  37.38kB
# Step 1/14 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/14 : RUN apk add --no-cache python make g++
#  ---> Running in 5f20a0ecc04b
# fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/main/x86_64/APKINDEX.tar.gz
# fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/community/x86_64/APKINDEX.tar.gz
# (1/21) Installing binutils (2.33.1-r0)
# (2/21) Installing gmp (6.1.2-r1)
# (3/21) Installing isl (0.18-r0)
# (4/21) Installing libgomp (9.3.0-r0)
# (5/21) Installing libatomic (9.3.0-r0)
# (6/21) Installing mpfr4 (4.0.2-r1)
# (7/21) Installing mpc1 (1.1.0-r1)
# (8/21) Installing gcc (9.3.0-r0)
# (9/21) Installing musl-dev (1.1.24-r3)
# (10/21) Installing libc-dev (0.7.2-r0)
# (11/21) Installing g++ (9.3.0-r0)
# (12/21) Installing make (4.2.1-r2)
# (13/21) Installing libbz2 (1.0.8-r1)
# (14/21) Installing expat (2.2.9-r1)
# (15/21) Installing libffi (3.2.1-r6)
# (16/21) Installing gdbm (1.13-r1)
# (17/21) Installing ncurses-terminfo-base (6.1_p20200118-r4)
# (18/21) Installing ncurses-libs (6.1_p20200118-r4)
# (19/21) Installing readline (8.0.1-r0)
# (20/21) Installing sqlite-libs (3.30.1-r2)
# (21/21) Installing python2 (2.7.18-r0)
# Executing busybox-1.31.1-r9.trigger
# OK: 212 MiB in 37 packages
# Removing intermediate container 5f20a0ecc04b
#  ---> 637ca797d709
# Step 3/14 : WORKDIR /app
#  ---> Running in 846361b57599
# Removing intermediate container 846361b57599
#  ---> 3d58a482896e
# Step 4/14 : COPY ./package.json .
#  ---> 11b387794039
# Step 5/14 : RUN npm install --only=prod
#  ---> Running in 2e27e33f935d
#  added 269 packages from 220 contributors and audited 1137 packages in 140.322s
#
# 4 packages are looking for funding
#   run `npm fund` for details
#
# found 0 vulnerabilities
#
# Removing intermediate container 2e27e33f935d
#  ---> eb7cb2cb0b20
# Step 6/14 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/14 : EXPOSE 3000
#  ---> Running in 4ea24f871747
# Removing intermediate container 4ea24f871747
#  ---> 1f0206f2f050
# Step 8/14 : ENV NODE_ENV=production
#  ---> Running in 5d40d6ac3b7e
# Removing intermediate container 5d40d6ac3b7e
#  ---> 31f62da17929
# Step 9/14 : USER node
#  ---> Running in 0963e1fb19a0
# Removing intermediate container 0963e1fb19a0
#  ---> 0f4045152b1c
# Step 10/14 : RUN mkdir -p /home/node/app
#  ---> Running in 0ac591b3adbd
# Removing intermediate container 0ac591b3adbd
#  ---> 5908373dfc75
# Step 11/14 : WORKDIR /home/node/app
#  ---> Running in 55253b62ff57
# Removing intermediate container 55253b62ff57
#  ---> 2883cdb7c77a
# Step 12/14 : COPY . .
#  ---> 8e60893a7142
# Step 13/14 : COPY --from=builder /app/node_modules  /home/node/app/node_modules
#  ---> 27a85faa4342
# Step 14/14 : CMD [ "node", "bin/www" ]
#  ---> Running in 349c8ca6dd3e
# Removing intermediate container 349c8ca6dd3e
#  ---> 9ea100571585
# Successfully built 9ea100571585
# Successfully tagged notes-api:latest
```

Before you run a container using this image, make sure the database container is running, and is attached to the `notes-api-network`.

```text
docker container inspect notes-db

# [
#     {
#         ...
#         "State": {
#             "Status": "running",
#             "Running": true,
#             "Paused": false,
#             "Restarting": false,
#             "OOMKilled": false,
#             "Dead": false,
#             "Pid": 11521,
#             "ExitCode": 0,
#             "Error": "",
#             "StartedAt": "2021-01-26T06:55:44.928510218Z",
#             "FinishedAt": "2021-01-25T14:19:31.316854657Z"
#         },
#         ...
#         "Mounts": [
#             {
#                 "Type": "volume",
#                 "Name": "notes-db-data",
#                 "Source": "/var/lib/docker/volumes/notes-db-data/_data",
#                 "Destination": "/var/lib/postgresql/data",
#                 "Driver": "local",
#                 "Mode": "z",
#                 "RW": true,
#                 "Propagation": ""
#             }
#         ],
#         ...
#         "NetworkSettings": {
#             ...
#             "Networks": {
#                 "bridge": {
#                     "IPAMConfig": null,
#                     "Links": null,
#                     "Aliases": null,
#                     "NetworkID": "e4c7ce50a5a2a49672155ff498597db336ecc2e3bbb6ee8baeebcf9fcfa0e1ab",
#                     "EndpointID": "2a2587f8285fa020878dd38bdc630cdfca0d769f76fc143d1b554237ce907371",
#                     "Gateway": "172.17.0.1",
#                     "IPAddress": "172.17.0.2",
#                     "IPPrefixLen": 16,
#                     "IPv6Gateway": "",
#                     "GlobalIPv6Address": "",
#                     "GlobalIPv6PrefixLen": 0,
#                     "MacAddress": "02:42:ac:11:00:02",
#                     "DriverOpts": null
#                 },
#                 "notes-api-network": {
#                     "IPAMConfig": {},
#                     "Links": null,
#                     "Aliases": [
#                         "37755e86d627"
#                     ],
#                     "NetworkID": "06579ad9f93d59fc3866ac628ed258dfac2ed7bc1a9cd6fe6e67220b15d203ea",
#                     "EndpointID": "5b8f8718ec9a5ec53e7a13cce3cb540fdf3556fb34242362a8da4cc08d37223c",
#                     "Gateway": "172.18.0.1",
#                     "IPAddress": "172.18.0.2",
#                     "IPPrefixLen": 16,
#                     "IPv6Gateway": "",
#                     "GlobalIPv6Address": "",
#                     "GlobalIPv6PrefixLen": 0,
#                     "MacAddress": "02:42:ac:12:00:02",
#                     "DriverOpts": {}
#                 }
#             }
#         }
#     }
# ]
```

I've shortened the output for easy viewing here. On my system, the `notes-db` container is running, uses the `notes-db-data` volume and is attached to the `notes-api-network` bridge.

Once you're assured that everything is in place, you can run a new container by executing the following command:

```text
docker container run \
    --detach \
    --name=notes-api \
    --env DB_HOST=notes-db \
    --env DB_DATABASE=notesdb \
    --env DB_PASSWORD=secret \
    --publish=3000:3000 \
    --network=notes-api-network \
    notes-api

# f9ece420872de99a060b954e3c236cbb1e23d468feffa7fed1e06985d99fb919
```

You should be able to understand this long command by yourself, I'll go through the environment variables briefly. The `notes-api` application requires three environment variables to be set. They are as follows:

* `DB_HOST` - This is the host of the database server. Given both the database server and the API is attached to the same user-defined bridge network, the database server can be refereed to using its container name which is `notes-db` in this case.
* `DB_DATABASE` - The database that this API will use. On [Running the Database Server](containerizing-a-multi-container-javascript-application.md#running-the-database-server) we set the default database name to `notesdb` using the `POSTGRES_DB` environment variable. We'll use that here.
* `DB_PASSWORD` - Password for connecting to the database. This was also set on [Running the Database Server](containerizing-a-multi-container-javascript-application.md#running-the-database-server) sub-section using the `POSTGRES_PASSWORD` environment variable.

To check if the container is running properly or not, you can use the `container ls` command:

```text
docker container ls

# CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
# f9ece420872d   notes-api     "docker-entrypoint.s…"   12 minutes ago   Up 12 minutes   0.0.0.0:3000->3000/tcp   notes-api
# 37755e86d627   postgres:12   "docker-entrypoint.s…"   17 hours ago     Up 14 minutes   5432/tcp                 notes-db
```

The container is running now. You can visit `http://127.0.0.1:3000/` to see the API in action.

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/bonjour-mon-ami.png)

The API has five routes in total that you can see inside the `/notes-api/api/api/routes/notes.js` file. It was bootstrapped with one of my open-source projects:

{% embed url="https://github.com/fhsinchy/create-node-rocket-api" caption="spare a ⭐ to keep me motivated" %}

Although the container is running, there is one last thing that you'll have to do before you can start using it. You'll have to run the database migration necessary for setting up the database tables, and you can do that by executing `npm run db:migrate` command inside the container.

## Executing Commands in a Running Container

You've already learned about executing commands in a stopped container. Another scenario is executing a command inside a running container. For this, you'll have to use the `exec` command to execute a custom command inside a running container.

The generic syntax for the `exec` command is as follows:

```text
docker container exec <container identifier> <command>
```

To execute `npm run db:migrate` inside the `notes-api` container, you can execute the following command:

```text
docker container exec notes-api npm run db:migrate

# > notes-api@ db:migrate /home/node/app
# > knex migrate:latest
#
# Using environment: production
# Batch 1 run: 1 migrations
```

In cases where you want to run an interactive command inside a running container, you'll have to use the `-it` flag. As an example, if you want to access the shell running inside the `notes-api` container, you can execute the following command:

```text
docker container exec -it notes-api sh

# / # uname -a
# Linux b5b1367d6b31 5.10.9-201.fc33.x86_64 #1 SMP Wed Jan 20 16:56:23 UTC 2021 x86_64 Linux
```

## Writing Management Scripts

Managing a multi-container project along with the network and volumes and stuff means writing a lot of commands. To simplify the process, I usually take help of simple [shell scripts](https://opensource.com/article/17/1/getting-started-shell-scripting) and a [Makefile](https://opensource.com/article/18/8/what-how-makefile). You'll find four shell scripts in the `notes-api` directory. They are as follows:

* `boot.sh` - Used for starting the containers if they already exist.
* `build.sh` - Creates and runs the containers. It also creates the images, volumes and networks if necessary.
* `destroy.sh` - Removes all containers, volumes and networks associated with this project.
* `stop.sh` - Stops all running containers.

There is also a `Makefile` that contains four targets named `start`, `stop`, `build` and `destroy` each invoking the previously mentioned shell scripts.

If the container is in running state in your system, executing `make stop` should stop all the containers. executing `make destroy` should stop the containers and remove everything. Make sure you're running the scripts inside the `notes-api` directory \(if you're still in `notes-api\api`, you can use the command `cd ..` to back up one level to the correct directory before running the following\):

```text
make destroy

# ./shutdown.sh
# stopping api container --->
# notes-api
# api container stopped --->

# stopping db container --->
# notes-db
# db container stopped --->

# shutdown script finished

# ./destroy.sh
# removing api container --->
# notes-api
# api container removed --->

# removing db container --->
# notes-db
# db container removed --->

# removing db data volume --->
# notes-db-data
# db data volume removed --->

# removing network --->
# notes-api-network
# network removed --->

# destroy script finished
```

If you're getting permission denied error than execute `chmod +x` on the scripts:

```text
chmod +x boot.sh build.sh destroy.sh shutdown.sh
```

I'm not going to explain these scripts because they're simple `if-else` statement along with some Docker commands that you've already seen many times. If you have some understanding of the Linux shell, you should be able to understand the scripts as well.

# Composing Projects Using Docker-Compose

In the previous section, you've learned about managing a multi-container project and the difficulties of it. Instead of writing so many commands, there is an easier way to manage multi-container projects, a tool called [Docker Compose](https://docs.docker.com/compose/).

According to the Docker [documentation](https://docs.docker.com/compose/) - "Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration."

Although Compose works in all environments, it's more focused on development and testing. Using Compose on a production environment is not recommended at all.

## Compose Basics

Go the directory where you've cloned the repository that came with this article. Go inside the `notes-api/api` directory and create a `Dockerfile.dev` file. Put the following code in it:

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

Head to the `notes-api` directory and create a new `docker-compose.yaml` file. Put following code into the newly created file:

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
    db-data:
        name: notes-db-dev-data
```

Every valid `docker-compose.yaml` file starts by defining the file version. At the time of writing, `3.8` is the latest version. You can look up the latest version [here](https://docs.docker.com/compose/compose-file/).

Blocks in an YAML file are defined by indentation. I will go through each of the blocks and will explain what they do.

* The `services` block holds the definitions for each of the services or containers in the application. `db` and `api` are the two services that comprise this project.
* The `db` block defines a new service in the application and holds necessary information to start the container. Every service requires either a pre-built image or a `Dockerfile` to run a container. For the `db` service we're using the official PostgreSQL image.
* Unlike the `db` service, a pre-built image for the `api` service doesn't exist. Hence, we use the `Dockerfile.dev` file.
* The `volumes` block defines any name volume needed by any of the services. At the time it only enlists `db-data` volume used by the `db` service.

Now that we have a high level overview of the `docker-compose.yaml` file, lets have a closer look at the individual services.

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

* The `api` service doesn't come with a pre-built image instead what it has is a build configuration. Under the `build` block we define the context and the name of the Dockerfile for building an image. You should have an understanding of context and Dockerfile by now so I won't spend time explaining those.
* The `image` key holds the name of the image to be built. If not assigned the image will be named following the `<project directory name>_<service name>` syntax.
* Inside the `environment` map, the `DB_HOST` variable demonstrates a feature of Compose. That is, you can refer to another service in the same application by using its name. So the `db` here, will be replaced by the IP address of the `api` service container. The `DB_DATABASE` and `DB_PASSWORD` variables have to match up with `POSTGRES_DB` and `POSTGRES_PASSWORD` respectively from the `db` service definition.
* In the `volumes` map, you can see an anonymous volume and a bind mount described. The syntax is identical to what you've seen in previous sections.
* The `ports` map defines any port mapping. The syntax, `<host port>:<container port>` is identical to the `--publish` option you used before.

Finally, code for the `volumes` is as follows:

```text
volumes:
    db-data:
        name: notes-db-dev-data
```

Any named volume used in any of the services has to be defined here. If you don't define a name, the volume will be named following the `<project directory name>_<volume key>` syntax and the key here is `db-data`. You can learn about the different options for volume configuration in the official [docs](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes).

## What About the Network Bridge?

You may have noticed that there is no network bridge creation section in this YAML file. While the docker-compose specification supports adding network configuration to the file, docker-compose has [a helpful feature](https://docs.docker.com/compose/networking/#) that automatically creates a bridge network for the composed project, and assigns a name based on the directory name (or project-name, if defined with the `--project-name` switch or the `COMPOSE_PROJECT_NAME` environment variable).  So, since this file doesn't include that information, you can look for a "notes-api_default" network after bringing up the composed project below.

## Starting Services

There are a few ways of starting services defined in a YAML file. The first command that you'll learn about is the `up` command. The `up` command builds any missing images, creates containers and starts them in one go.

Before you execute the command though, make sure you've opened your terminal in the same directory where the `docker-compose.yaml` file is. This is very important for every `docker-compose` command you execute.

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
# Removing intermediate container 197056ec1964
#  ---> 6609935fe50b
# Step 3/13 : WORKDIR /app
#  ---> Running in 17010f65c5e7
# Removing intermediate container 17010f65c5e7
#  ---> b10d12e676ad
# Step 4/13 : COPY ./package.json .
#  ---> 600d31d9362e
# Step 5/13 : RUN npm install
#  ---> Running in a14afc8c0743
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

The `--detach` or `-d` option here functions same as the one you've seen before. The `--file` or `-f` option is only needed if the YAML file is not named `docker-compose.yaml` but I've used here for demonstration purpose.

Apart from the the `up` command there is the `start` command. The main difference between these two is the `start` command doesn't create missing containers, only starts existing containers. It's basically same as the `container start` command.

The `--build` option for the `up` command forces a rebuild of the images. There are some other options for the `up` command that you can see on official [docs](https://docs.docker.com/compose/reference/up/).

## Listing Services

Although service containers started by Compose can be listed using the `container ls` command, there is the `ps` command for listing containers defined in the YAML only. 

```text
docker-compose ps

#     Name                   Command               State           Ports         
# -------------------------------------------------------------------------------
# notes-api-dev   docker-entrypoint.sh ./nod ...   Up      0.0.0.0:3000->3000/tcp
# notes-db-dev    docker-entrypoint.sh postgres    Up      5432/tcp
```

It's not as informative as the `container ls` output, but useful when you have tons of containers running simultaneously.

## Executing Commands Inside a Running Service

I hope you remember from the previous section that you have to run some migration scripts to create the database tables for this API. Just like the `container exec` command, there is an `exec` command for `docker-compose`. Generic syntax for the command is as follows:

```text
docker-compose exec <service name> <command>
```

To execute the `npm run db:migrate` command inside the `api` service, you can execute the following command:

```text
docker-compose exec api npm run db:migrate

# > notes-api@ db:migrate /home/node/app
# > knex migrate:latest
# 
# Using environment: development
# Batch 1 run: 1 migrations
```

Unlike the `container exec` command, you don't need to pass the `-it` flag for interactive sessions. `docker-compose` does that automatically.

## Accessing Logs From a Running Service

You can also use the `logs` command to retrieve logs from a running service. The generic syntax for the command is as follows:

```text
docker-compose logs <service name>
```

To access the logs from the `api` service execute the following command:

```text
docker-compose logs api

# Attaching to notes-api-dev
# notes-api-dev | [nodemon] 2.0.7
# notes-api-dev | [nodemon] reading config ./nodemon.json
# notes-api-dev | [nodemon] to restart at any time, enter `rs`
# notes-api-dev | [nodemon] or send SIGHUP to 1 to restart
# notes-api-dev | [nodemon] ignoring: *.test.js
# notes-api-dev | [nodemon] watching path(s): *.*
# notes-api-dev | [nodemon] watching extensions: js,mjs,json
# notes-api-dev | [nodemon] starting `node bin/www`
# notes-api-dev | [nodemon] forking
# notes-api-dev | [nodemon] child pid: 19
# notes-api-dev | [nodemon] watching 18 files
# notes-api-dev | app running -> http://127.0.0.1:3000
```

This is just a portion from the log output. You can kind of hook into the output stream of the service and get the logs in real-time by using the `-f` or `--follow` option. Any later log will show up instantly in the terminal as long as you don't exit by pressing `ctrl + c` key combination or closing the window. The container will keep running even if you exit out of the log window.

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

The `--volumes` option indicates that you want to remove any named volume defined in the `volumes` block. You can learn about the additional options for the `down` command in the official [docs](https://docs.docker.com/compose/reference/down/).

Another command for stopping services is the `stop` command which functions identically to the `container stop` command. It stops all the containers for the application and keeps the contianers. These containers can later be started with the `start` or `up` command.

## Composing a Full-stack Application

In this sub-section, we'll be adding a front-end to our notes API and turn it into a complete fullstack application. I won't be explaining any of the `Dockerfile.dev` files in this sub-section \(except the one for the `nginx` service\) as they are identical to some of the others you've already seen in previous sub-sections.

If you've cloned the project code repository, then go inside the `fullstack-notes-application` directory. Each directory inside the project root contains the code for each services and the corresponding `Dockerfile`.

Before we start with the `docker-compose.yaml` file let's look at a diagram of how the application is going to work:

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/fullstack-application-design.svg)

Instead of accepting requests directly like we previously did, in this application, all the requests will be first received by a NGINX \(lets call it router\) service. The router will then see if the requested end-point has `/api` in it. If yes, the router will route the request to the back-end or if not, the router will route the request to the front-end.

The reason behind doing this is that when you run a front-end application it doesn't run inside a container. It runs on the browser, served from a container. As a result, Compose networking doesn't work as expected and the front-end application fails to find the `api` service.

NGINX on the other hand runs inside a container and can communicate with the different services across the entire application.

I will not get into the configuration of NGINX here. That topic is kinda out of scope of this article. But if you want to have a look at it, go ahead and checkout the `/notes-api/nginx/development.conf` and `/notes-api/nginx/production.conf` files. Code for the `/notes-api/nginx/Dockerfile.dev` is as follows:

```text
FROM nginx:stable-alpine

COPY ./development.conf /etc/nginx/conf.d/default.conf
```

All it does is copy the configuration file to `/etc/nginx/conf.d/default.conf` inside the container.

Let's start writing the `docker-compose.yaml` file. Apart from the `api` and `db` services there will be the `client` and `nginx` services. There will also be some network definitions that I'll get into shortly.

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

The file is almost identical to the previous one you worked with. Only thing that needs some explanation is the network configuration. Code for the `networks` block is as follows:

```text
networks: 
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

I've defined two bridge networks. By default Compose creates a bridge network and attaches all containers to that. In this project however, I wanted proper network isolation. So I defined two networks, one for the front-end services and one for the back-end  services.

I've also added `networks` block in each of the service definitions. This way the the `api` and `db` service will be attached to one network and the `client` service will be attached to a separate network. The `nginx` service however will be attached to both the networks so that it can perform as router between the front-end and back-end services.

Start all the services by executing following command:

```text
docker-compose --file docker-compose.yaml up --detach

# Creating network "fullstack-notes-application-network-backend" with driver "bridge"
# Creating network "fullstack-notes-application-network-frontend" with driver "bridge"
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
# 
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 8a4485388fd3
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 8a4485388fd3
#  ---> 47fb1ab07cc0
# Step 3/13 : WORKDIR /app
#  ---> Running in bc76cc41f1da
# Removing intermediate container bc76cc41f1da
#  ---> 8c03fdb920f9
# Step 4/13 : COPY ./package.json .
#  ---> a1d5715db999
# Step 5/13 : RUN npm install
#  ---> Running in fabd33cc0986
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container fabd33cc0986
#  ---> e09913debbd1
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Using cache
#  ---> b7c12361b3e5
# Step 8/13 : USER node
#  ---> Using cache
#  ---> f5ac66ca07a4
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 60094b9a6183
# Step 10/13 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 316a252e6e3e
# Step 11/13 : COPY . .
#  ---> Using cache
#  ---> 3a083622b753
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> Using cache
#  ---> 707979b3371c
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Using cache
#  ---> f2da08a5f59b
# Successfully built f2da08a5f59b
# Successfully tagged notes-api:dev
# Building client
# Sending build context to Docker daemon  43.01kB
# 
# Step 1/7 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 2/7 : USER node
#  ---> Using cache
#  ---> 4be5fb31f862
# Step 3/7 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 1fefc7412723
# Step 4/7 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> d1470d878aa7
# Step 5/7 : COPY ./package.json .
#  ---> Using cache
#  ---> bbcc49475077
# Step 6/7 : RUN npm install
#  ---> Using cache
#  ---> 860a4a2af447
# Step 7/7 : CMD [ "npm", "run", "serve" ]
#  ---> Using cache
#  ---> 11db51d5bee7
# Successfully built 11db51d5bee7
# Successfully tagged notes-client:dev
# Building nginx
# Sending build context to Docker daemon   5.12kB
# 
# Step 1/2 : FROM nginx:stable-alpine
#  ---> f2343e2e2507
# Step 2/2 : COPY ./development.conf /etc/nginx/conf.d/default.conf
#  ---> Using cache
#  ---> 02a55d005a98
# Successfully built 02a55d005a98
# Successfully tagged notes-router:dev
# Creating notes-client-dev ... done
# Creating notes-api-dev    ... done
# Creating notes-router-dev ... done
# Creating notes-db-dev     ... done
```

Now visit `http://localhost:8080` and voilà!

![](https://gitee.com/fengmengzhao/the-docker-handbook/raw/feature/add-Chinese-Edition-for-docker-handbook2021/.gitbook/assets/notes-application.png)

Try adding and deleting notes to see if the application works properly or not. The project also comes with shell scripts and a `Makefile`. Explore them to see how you can run this project without the help of `docker-compose` like you did in the previous section.

# Conclusion

I would like to thank you from the bottom of my heart for the time you've spent reading this book. I hope you've enjoyed it and have learned all the essentials of Docker.

Apart from this one, I've written full-length handbooks on other complicated topics available for free on [freeCodeCamp](https://www.freecodecamp.org/news/the-docker-handbook/freecodecamp.org/news/author/farhanhasin/).

These handbooks are part of my mission to simplify hard to understand technologies for everyone. Each of these handbooks takes a lot of time and effort to write.

If you've enjoyed my writing and want to keep me motivated, consider leaving starts on [GitHub](https://github.com/fhsinchy/) and endorse me for relevant skills on [LinkedIn](https://www.linkedin.com/in/farhanhasin/). I also accept sponsorship so you may consider [buying me a coffee](https://www.buymeacoffee.com/farhanhasin) if you want to.

I'm always open to suggestions and discussions on a [number of platforms](https://linktr.ee/farhanhasin). Follow me on [Twitter](https://twitter.com/frhnhsin) or [LinkedIn](https://www.linkedin.com/in/farhanhasin/) and hit me with direct messages.

In the end, consider sharing the resources with others, because

> Sharing knowledge is the most fundamental act of friendship. Because it is a way you can give something without loosing something. — Richard Stallman

Till the next one, stay safe and keep learning.