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

# To try something more ambitious, you can run an Ubuntu container with:
#  $ docker run -it ubuntu bash
# 
# Share images, automate workflows, and more with a free Docker ID:
#  https://hub.docker.com/

# For more examples and ideas, visit:
#  https://docs.docker.com/get-started/

```

The [hello-world](https://hub.docker.com/_/hello-world) image is an example of minimal containerization with Docker. It has a single [hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c) file responsible for printing out the message you're seeing on your terminal.

Now in your terminal, you can use the `docker ps -a` command to have a look at all the containers that are currently running or have run in the past:

```text
docker ps -a

# CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
# 631c9481eabd        hello-world         "/hello"            8 seconds ago       Exited (0) 7 seconds ago                       reverent_rhodes
```

As you can see in the output, a container named `reverent_rhodes` was run with the container id of `631c9481eabd` using the `hello-world` image and has `Exited (0) 7 seconds ago` where the `(0)` exit code means no error was produced during the runtime of the container.

Now in order to understand how the entire thing happened behind the scenes, you'll have to get familiar with the Docker Architecture and three very fundamental concepts which are as follows:

* [Container](hello-world-in-docker.md#container)
* [Image](hello-world-in-docker.md#image)
* [Registry](hello-world-in-docker.md#registry)

I've listed the three concepts in alphabetical order and will begin my explanations with the first on on the list.

## Container

In the world of containerization, there can not be anything more fundamental than the concept of a container. 

The official Docker [resources](https://www.docker.com/resources/what-container) site says, "A container is an abstraction at the application layer that packages code and dependencies together. Instead of virtualizing the entire physical machine, containers virtualize the host operating system only."

You may consider containers as the next generation of virtual machines. Just like virtual machines, containers are completely isolated from each other hence the chances of unwanted conflict between parts of an application, goes right out of the window. They are even a lot lighter than the traditional virtual machine hence a huge number of containers can be run simultaneously without affecting the performance of the host system.

As you may have already understood, containers are virtual machines are actually different ways of virtualizing your physical hardware. The main difference between these two approaches is the method of virtualization.

Virtual machines are usually created and managed by a program known as a hypervisor i.e. Oracle VM VirtualBox, VMware Workstation, KVM, Microsoft Hyper-V etc. This hypervisor program usually sits between the host operating system and the virtual machines to act as a medium of communication.

![](.gitbook/assets/virtual-machines.svg)

Each virtual machine comes with it's own guest operating system which is just as heavy as the host operating system. Application running inside a virtual machine communicates with the guest operating system running inside that virtual machine, which talks to the hypervisor, which then in turn talks to the host operating system to allocate necessary resources from the physical infrastructure to the virtual machines. 

As you can see there is a long chain of communication between applications running inside the virtual machines and the physical infrastructure, hence applications running inside virtual machines are slow and resource hogging.

Unlike a virtual machine, a container does the job of virtualization in an intelligent way. Instead of having a complete guest operating system inside the containers, they just utilize the host operating system directly while maintaining isolation just like a traditional virtual machine.

![](.gitbook/assets/containers.svg)

Instead of a hypervisor, a container runtime i.e. Docker or rkt sits between the containers and the host operating system kernel. The containers then communicate with the container runtime which then communicates with host operating system to get necessary resources from the physical infrastructure.

As you can see, containers eliminate the entire guest operating system layer making the containers a lot lighter and less resource hogging.

As an demonstration of the point, look at the following code block:

```text
uname -a
# Linux alpha-centauri 5.4.0-48-generic #52-Ubuntu SMP Thu Sep 10 10:58:49 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux

docker run alpine uname -a
# Linux 3ceffa5c9fe3 5.4.0-48-generic #52-Ubuntu SMP Thu Sep 10 10:58:49 UTC 2020 x86_64 Linux
```

In the code block above, I have executed the `uname -a` command on my host operating system to print out the kernel details. Then on the next line I've executed the same command inside a container running [Alpine Linux](https://alpinelinux.org/) inside it. As you can see from the outputs, the container is indeed using the kernel from my host operating system. This goes to prove the point that containers virtualize the host operating system instead of having an operating system of their own.

## Image

Images are multi-layered self-contained files that act as the template for creating Docker containers. Images can be exchanged through registries. We can use any image built by others or can also modify them by adding new instructions.

Images can be created from [scratch](https://hub.docker.com/_/scratch) as well. The base layer of an image is read-only. When we edit a Dockerfile and rebuild it, only the modified part is rebuilt in the top layer.

Containers are images in running state. When we pull an image like hello-world and run them, they create an isolated environment suitable for running the program included in the image. This isolated environment is a container.

## Registry

Registries are storage for Docker images. [Docker Hub](https://hub.docker.com/) is the default public registry for storing images.

Whenever we execute commands like `docker run` or `docker pull` the daemon usually fetches images from the hub. Anyone can upload images to the hub using `docker push` command. You can go to the hub and search for images like any other website.

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-04-at-6.55.54-PM.png)

If you create an account, you'll be able to upload custom images as well. Images that I've uploaded are available for everyone at [https://hub.docker.com/u/fhsinchy](https://hub.docker.com/u/fhsinchy) page.

## The Full Picture

Now that you're familiar with the architecture, images, containers, and registries, you're ready to understand what happened when we executed the `docker run hello-world` command. A graphical representation of the process is as follows:

![](https://www.freecodecamp.org/news/content/images/2020/07/docker-run-hello-world.svg)

The entire process happens in five steps:

1. We execute the `docker run hello-world` command.
2. Docker client tells the daemon that we want to run a container using the hello-world image.
3. Docker daemon pulls the latest version of the image from the registry.
4. Creates a container from the image.
5. Runs the newly created container.

It's the default behavior of Docker daemon to look for images in the hub, that are not present locally. But once an image has been fetched, it'll stay in the local cache. So if you execute the command again, you won't see the following lines in the output:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete
Digest: sha256:d58e752213a51785838f9eed2b7a498ffa1cb3aa7f946dda11af39286c3db9a9
Status: Downloaded newer image for hello-world:latest
```

If there is a newer version of the image available, the daemon will fetch the image again. That `:latest` is a tag. Images usually have meaningful tags to indicate versions or builds. You'll learn about this in more detail in a later section.

