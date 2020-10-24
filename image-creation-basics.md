# Image Creation Basics

Now that you've a solid understanding of running containers using images available publicly, it's time for you to learn about creating your very own images.

In this section, you'll learn the fundamentals of creating images, running containers using them and sharing them online.

I would suggest you install [Visual Studio Code](https://code.visualstudio.com/) with the official [Docker Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) from the marketplace. This will greatly help your development experience.

## The Essentials

As I've already explained in the [Hello World in Docker](hello-world-in-docker.md#image) section, images are multi-layered self-contained files that act as the template for creating Docker containers. They are like a frozen, read-only copy of a container.

In order to create an image using one of your application you must have a clear vision of what you want from the image. Take the official [nginx](https://hub.docker.com/_/nginx) image for example. You can start a container using this image simply by executing the following command:

```text
docker container run --detach --name default-nginx --publish 8080:80 nginx

# b379ecd5b6b9ae27c144e4fa12bdc5d0635543666f75c14039eea8d5f38e3f56

docker container ls

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b379ecd5b6b9        nginx               "/docker-entrypoint.…"   8 seconds ago       Up 8 seconds        0.0.0.0:8080->80/tcp   default-nginx
```

Now, if you visit `http://127.0.0.1:8080` in the browser, you'll see a default reponse page.

![](.gitbook/assets/nginx-default.png)

That's all nice and good, but what if you want to make a custom nginx which functions exactly like the official one, but is built by you? That's completely valid scenario to be honest. In fact, let's do that.

In order to make a custom NGINX image, you must have a clear picture of what the final state of the image will be. In my opinion the image should as follows:

* The image should have NGINX pre-installed which can be done using a package manager or can be built from source.
* The image should start NGINX automatically upon running.

That's simple. I hope that you've already cloned the project repository linked in this article. Go inside the repository and look for a directory named `custom-nginx` in there. Now, create a new file named `Dockerfile` inside that directory. A `Dockerfile` is a collection of instructions that once processed by the daemon, results into an image. Content for the `Dockerfile` is as follows:

```text
FROM ubuntu:latest

EXPOSE 80

RUN apt-get update && \
    apt-get install nginx -y

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

I hope that you remember that images are multi-layered files. In this file, each line \(known as instructions\) that you've written here, creates a layer for your custom image.

* Every valid `Dockerfile` starts with a `FROM` instruction. This instruction sets the base image for your resultant image. By setting `ubuntu:latest` as the base image here, you get all the goodness of Ubuntu already available in your custom image hence, you can use things like the `apt-get` command for easy package installation.
* The `EXPOSE` instruction is used to indicate the port that needs to be published. Using this instruction doesn't mean that you won't need to `--publish` the port. You'll still need to use the `--publish` command explicitly. This `EXPOSE` instruction works like a documentation for someone who's trying to run a container using your image. It also has some other usages that you'll learn about in later sub-sections.
* The `RUN` instruction in a `Dockerfile` executes a command inside the container shell.



