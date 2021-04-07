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

![](.gitbook/assets/nginx-default.png)

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

![](.gitbook/assets/nginx-default.png)

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

![](.gitbook/assets/nginx-default.png)

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

