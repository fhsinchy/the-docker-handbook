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
* The `RUN` instruction in a `Dockerfile` executes a command inside the container shell. The `apt-get update && apt-get install nginx -y` command checks for updated package version and installs nginx. The `apt-get clean && rm -rf /var/lib/apt/lists/*` command is used for clearing the package cache because you don't want any unnecessary baggage in your image. These two commands are simple Ubuntu stuff, nothing fancy. The `RUN` instructions here are written in `shell` form. These can also be written in `exec` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#run) for more information.
* Finally the `CMD` instruction sets the default command for your image. This instruction is written in `exec` form here comprising of three separate parts. Here, `nginx` refers to the nginx executable. The `-g` and `daemon off` are options for nginx. Running nginx as a single process inside containers is considered a best practice hence the usage of this option. The `CMD` instruction can also be written in `shell` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#cmd) for more information.

Now that you have a valid `Dockerfile` you can build an image out of it. To do so, open up your terminal inside the `custom-nginx` directory and execute following command:

```text
docker image build --file Dockerfile .

# Sending build context to Docker daemon  3.584kB
# Step 1/5 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/5 : EXPOSE 80
#  ---> Running in 9eae86582ec7
# Removing intermediate container 9eae86582ec7
#  ---> 8235bd799a56
# Step 3/5 : RUN apt-get update &&     apt-get install nginx -y
#  ---> Running in a44725cbb3fa
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container a44725cbb3fa
#  ---> 3066bd20292d
# Step 4/5 : RUN apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in 8ed118ac21ac
# Removing intermediate container 8ed118ac21ac
#  ---> 417529cf7338
# Step 5/5 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 4792e4691660
# Removing intermediate container 4792e4691660
#  ---> 3199372aa3fc
# Successfully built 3199372aa3fc
```

Just like the container related commands, the image related commands can be issued using `docker image <command> <options>` format. 

In order to perform an image build, the daemon needs two very specific information. These are name of the `Dockerfile` and the build context. In the issued command above:

* `docker image build` is the actual command for building the image. The daemon finds any file named `Dockerfile` by default so the usage of the `--file` option is redundant here. In case of a differently named file i.e. `Dockerfile.dev`, you must specify the filename.
* The `.` at the end sets the context for this build. The context means the directory accessible by the daemon during the build process. The concept of a build context will become much clearer in later sub-sections.

Now to run a container using this image, you can use the container run command coupled with the image id that you received as the result of the build process. In my case the id is `3199372aa3fc` evident by the `Successfully built 3199372aa3fc` line in the previous code block.

```text
docker container run --detach --name custom-nginx-packaged --publish 8080:80 3199372aa3fc

# ec09d4e1f70c903c3b954c8d7958421cdd1ae3d079b57f929e44131fbf8069a0

docker container ls

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# ec09d4e1f70c        3199372aa3fc        "nginx -g 'daemon of…"   23 seconds ago      Up 22 seconds       0.0.0.0:8080->80/tcp   custom-nginx-packaged
```

This container should behave just like the official one. To verify, visit `http://127.0.0.1:8080` and you should see the default response page.

![](.gitbook/assets/nginx-default.png)

Just like containers, you can assign custom identifier to your images instead of relying on the randomly generated id. In case of an image, it's called tagging instead of naming. The `--tag` option is used in such cases. In order to tag your custom nginx image with `custom-nginx:packaged` you can execute the following command:



```text
docker image build --file Dockerfile --tag custom-nginx:packaged .
```

Nothing will change except the fact that you can now refer to your image as `custom-nginx:packaged` instead of some long random string. The concept of tagging an image will be discussed even more in later sub-sections.

## Understanding the Many Layers of an Image

From the very beginning of this article, I've been saying that images are multi-layered files. In this sub-section I'll demonstrate the various layers of a file and how they play an important role in the build process of an image. For this demonstration, I'll be using the `custom-nginx:packaged` image from the previous sub-section.

To visualize the many layers of an image, you can use the `image history` command. The various layers of the `custom-nginx:packaged` image can be visualized as follows:

```text
docker image history custom-nginx:packaged

# IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
# 7f16387f7307        5 minutes ago       /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B                  
# 0a444339d689        5 minutes ago       /bin/sh -c apt-get clean && rm -rf /var/lib/…   0B                  
# 587c805fe8df        5 minutes ago       /bin/sh -c apt-get update &&     apt-get ins…   85MB                
# 6fe4e51e35c1        6 minutes ago       /bin/sh -c #(nop)  EXPOSE 80                    0B                  
# d70eaf7277ea        17 hours ago        /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
# <missing>           17 hours ago        /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
# <missing>           17 hours ago        /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
# <missing>           17 hours ago        /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B                
# <missing>           17 hours ago        /bin/sh -c #(nop) ADD file:435d9776fdd3a1834…   72.9MB
```

As you can see in the output, there are ten layers of this image. The upper most layer is the latest one and as you go down, those are older layers. The upper most layer is the one that you usually use for running containers.

Now, let's have a closer look at the images beginning from image `d70eaf7277ea` to `7f16387f7307` image. I'll ignore the bottom four layers where the `IMAGE` is `<missing>` as they are not of our concern.

I've already mentioned in the previous sub-section that each instruction you write in the `Dockerfile` will create a layer in the image.

*  `d70eaf7277ea` was created by `/bin/sh -c #(nop)  CMD ["/bin/bash"]` which indicates that the default shell inside Ubuntu has been loaded successfully.
* `6fe4e51e35c1` was created by `/bin/sh -c #(nop)  EXPOSE 80` which was the second instruction in your code.
* `587c805fe8df` was created by `/bin/sh -c apt-get update && apt-get install nginx -y` which was the third instruction in your code. You can also see that this image has a size of `85MB` given all necessary packages were installed during the execution of this instruction.
* `0a444339d689` was created by `/bin/sh -c apt-get clean && rm -rf /var/lib/apt/lists/*` which was the fourth instruction in your file.
* Finally the upper most layer `7f16387f7307` was created by `/bin/sh -c #(nop)  CMD ["nginx", "-g", "daemon off;"]` which sets the default command for this image.

As you can see, the image comprises of many read-only layers each recording a new set of change to the state triggered by certain instructions. When you start a container using an image, a new writable layer on top of the other layers.

This layering phenomenon that happens every time you work with Docker has been made possible by an amazing technical concept called union file system. Here, union means union in set theory. According to [Wikipedia](https://en.wikipedia.org/wiki/UnionFS) "It allows files and directories of separate file systems, known as branches, to be transparently overlaid, forming a single coherent file system. Contents of directories which have the same path within the merged branches will be seen together in a single merged directory, within the new, virtual filesystem."

By utilizing this concept, Docker can avoid data duplication, can use previously created layers as chache for later builds and result in compact, efficient images to be used everywhere.





