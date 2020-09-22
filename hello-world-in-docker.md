# Hello World in Docker

Now that we have Docker ready to go on our machines, it's time for us to run our first container. Open up terminal \(command prompt in windows\) and run the following command:

```text
docker run hello-world
```

If everything goes fine you should see some output like the following:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-10.12.27-PM.png)

The [hello-world](https://hub.docker.com/_/hello-world) image is an example of minimal containerization with Docker. It has a single [hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c) file responsible for printing out the message you're seeing on your terminal.

Almost every image contains a default command. In case of the hello-world image, the default command is to execute the _hello_ binary compiled from the previously mentioned C code.

If you open up the dashboard again, you should find the hello-world container there:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-1.35.49-AM.png)

The status is `EXITED(0)` which indicates that the container has run and exited successfully. You can view the _Logs_, _Stats \(CPU/memory/disk/network usage\)_ or _Inspect \(environment/port mappings\)_.

## Docker Architecture

To understand what just happened, you need to get familiar with the Docker Architecture, Images and Containers, and Registries.

![https://docs.docker.com/get-started/overview/\#docker-architecture](https://www.freecodecamp.org/news/content/images/2020/07/architecture-1.svg)

Don't worry if it looks confusing at the moment. Everything will become much clearer in the upcoming sub-sections.

## Images and Containers

Images are multi-layered self-contained files that act as the template for creating Docker containers. Images can be exchanged through registries. We can use any image built by others or can also modify them by adding new instructions.

Images can be created from [scratch](https://hub.docker.com/_/scratch) as well. The base layer of an image is read-only. When we edit a Dockerfile and rebuild it, only the modified part is rebuilt in the top layer.

Containers are images in running state. When we pull an image like hello-world and run them, they create an isolated environment suitable for running the program included in the image. This isolated environment is a container.

## Registries

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

