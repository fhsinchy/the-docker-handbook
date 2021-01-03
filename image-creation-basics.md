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

Now, if you visit `http://127.0.0.1:8080` in the browser, you'll see a default response page.

![](.gitbook/assets/nginx-default.png)

That's all nice and good, but what if you want to make a custom NGINX which functions exactly like the official one, but is built by you? That's completely valid scenario to be honest. In fact, let's do that.

In order to make a custom NGINX image, you must have a clear picture of what the final state of the image will be. In my opinion the image should as follows:

* The image should have NGINX pre-installed which can be done using a package manager or can be built from source.
* The image should start NGINX automatically upon running.

That's simple. I hope that you've already cloned the project repository linked in this article. Go inside the repository and look for a directory named `custom-nginx` in there. Now, create a new file named `Dockerfile` inside that directory. A `Dockerfile` is a collection of instructions that once processed by the daemon, results into an image. Content for the `Dockerfile` is as follows:

```text
FROM ubuntu:latest

EXPOSE 80

RUN apt-get update && \
    apt-get install nginx -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

I hope that you remember that images are multi-layered files. In this file, each line \(known as instructions\) that you've written here, creates a layer for your custom image.

* Every valid `Dockerfile` starts with a `FROM` instruction. This instruction sets the base image for your resultant image. By setting `ubuntu:latest` as the base image here, you get all the goodness of Ubuntu already available in your custom image hence, you can use things like the `apt-get` command for easy package installation.
* The `EXPOSE` instruction is used to indicate the port that needs to be published. Using this instruction doesn't mean that you won't need to `--publish` the port. You'll still need to use the `--publish` command explicitly. This `EXPOSE` instruction works like a documentation for someone who's trying to run a container using your image. It also has some other usages that you'll learn about in later sub-sections.
* The `RUN` instruction in a `Dockerfile` executes a command inside the container shell. The `apt-get update && apt-get install nginx -y` command checks for updated package version and installs NGINX. The `apt-get clean && rm -rf /var/lib/apt/lists/*` command is used for clearing the package cache because you don't want any unnecessary baggage in your image. These two commands are simple Ubuntu stuff, nothing fancy. The `RUN` instructions here are written in `shell` form. These can also be written in `exec` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#run) for more information.
* Finally the `CMD` instruction sets the default command for your image. This instruction is written in `exec` form here comprising of three separate parts. Here, `nginx` refers to the NGINX executable. The `-g` and `daemon off` are options for NGINX. Running NGINX as a single process inside containers is considered a best practice hence the usage of this option. The `CMD` instruction can also be written in `shell` form. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#cmd) for more information.

Now that you have a valid `Dockerfile` you can build an image out of it. Just like the container related commands, the image related commands can be issued using the following syntax:

```text
docker image <command> <options>
```

To build an image using the `Dockerfile` you just wrote, open up your terminal inside the `custom-nginx` directory and execute following command:

```text
docker image build --file Dockerfile .

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

In order to perform an image build, the daemon needs two very specific information. These are the name of the `Dockerfile` and the build context. In the issued command above:

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

Just like containers, you can assign custom identifier to your images instead of relying on the randomly generated id.

### Tagging Images

In case of an image, it's called tagging instead of naming. The `--tag` or `-t` option is used in such cases. In order to tag your custom NGINX image with `custom-nginx:packaged` you can execute the following command:

```text
docker image build --file Dockerfile --tag custom-nginx:packaged .
```

Nothing will change except the fact that you can now refer to your image as `custom-nginx:packaged` instead of some long random string. Here the part before the colon is the image name and the part after the colon is the tag.

Take the official [mysql](https://hub.docker.com/_/mysql) image for example. If you run a container using the this image the default tag will be `latest` indicating whatever is the latest version of MySQL at the moment. Now if you want another version, you can define that like `docker container run mysql:5.7` indicating you want 5.7 version of MySQL.

## Understanding the Many Layers of an Image

From the very beginning of this article, I've been saying that images are multi-layered files. In this sub-section I'll demonstrate the various layers of a file and how they play an important role in the build process of an image. For this demonstration, I'll be using the `custom-nginx:packaged` image from the previous sub-section.

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

As you can see in the output, there are eight layers of this image. The upper most layer is the latest one and as you go down, those are older layers. The upper most layer is the one that you usually use for running containers.

Now, let's have a closer look at the images beginning from image `d70eaf7277ea` to `7f16387f7307` image. I'll ignore the bottom four layers where the `IMAGE` is `<missing>` as they are not of our concern.

I've already mentioned in the previous sub-section that each instruction you write in the `Dockerfile` will create a layer in the image.

*  `d70eaf7277ea` was created by `/bin/sh -c #(nop)  CMD ["/bin/bash"]` which indicates that the default shell inside Ubuntu has been loaded successfully.
* `6fe4e51e35c1` was created by `/bin/sh -c #(nop)  EXPOSE 80` which was the second instruction in your code.
* `587c805fe8df` was created by `/bin/sh -c apt-get update && apt-get install nginx -y && apt-get clean && rm -rf /var/lib/apt/lists/*` which was the third instruction in your code. You can also see that this image has a size of `60MB` given all necessary packages were installed during the execution of this instruction.
* Finally the upper most layer `7f16387f7307` was created by `/bin/sh -c #(nop)  CMD ["nginx", "-g", "daemon off;"]` which sets the default command for this image.

As you can see, the image comprises of many read-only layers each recording a new set of change to the state triggered by certain instructions. When you start a container using an image, a new writable layer on top of the other layers.

This layering phenomenon that happens every time you work with Docker has been made possible by an amazing technical concept called union file system. Here, union means union in set theory. According to [Wikipedia](https://en.wikipedia.org/wiki/UnionFS) - "It allows files and directories of separate file systems, known as branches, to be transparently overlaid, forming a single coherent file system. Contents of directories which have the same path within the merged branches will be seen together in a single merged directory, within the new, virtual filesystem."

By utilizing this concept, Docker can avoid data duplication, can use previously created layers as cache for later builds and result in compact, efficient images to be used everywhere.

## Deeper Into the Image Building Business

In the previous sub-section, you've learned about the `FROM`, `EXPOSE`, `RUN` and `CMD` instructions. In this sub-section you'll be learning a lot more about other instructions.

In this sub-section you'll be again create a custom NGINX image but the twist is that you'll be building NGINX from source instead of installing it using some package manager such as `apt-get` in the previous example.

In order to build NGINX from source, you first need the source of NGINX. If you've cloned my projects repository you'll see a file named `nginx-1.19.2.tar.gz` inside the `custom-nginx` directory. You'll use this archive as the source for building NGINX.

Before diving into writing some code, let's plan out the process first. The image process creation process this time can be done in seven steps. These are as follows:

* Get a good base image for building the application i.e. [ubuntu](https://hub.docker.com/_/ubuntu).
* Install necessary build dependencies on the base image.
* Copy `nginx-1.19.2.tar.gz` file inside the image.
* Extract the contents of the archive and get rid of it.
* Configure the build, compile and install the program using the `make` tool.
* Get rid of the extracted source code.
* Run `nginx` executable.

Now that you have a plan, let's begin by renaming your old `Dockerfile` to something like `Dockerfile.packaged` indicating that this one installs NGINX using a package manager. Create a new file named `Dockerfile.built` which indicates that in this one, you've built NGINX from source. Open up the newly created file and put following content in it:

```text
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
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

As you can see, the code inside the `Dockerfile.built` reflects the seven steps I talked about beforehand.

* The `FROM` instruction sets Ubuntu as the base image making an ideal environment for building any application.
* The `RUN` instruction here installs standard packages necessary for building NGINX from source.
* The `COPY` instruction here is something new. This instruction is responsible for copying the the `nginx-1.19.2.tar.gz` file inside the image. The generic syntax for the `COPY` instruction is `COPY <source> <destination>` where source is in your local filesystem and the destination is inside your image. The `.` as the destination means the working directory inside the image which is by default `/` unless set otherwise.
* The second `RUN` instruction here extracts the contents from the archive using `tar` and gets rid of it afterwards.
* The archive file contains a directory called `nginx-1.19.2` containing the source code. Hence on the next step, you'll need to `cd` inside that directory and perform the build process. You can read the [How to Install Software from Source Code… and Remove it Afterwards](https://itsfoss.com/install-software-from-source-code/) article at [It's Foss](https://itsfoss.com/) to learn more on the topic.
* Once the build and installation is complete, you remove the `nginx-1.19.2` directory using `rm` command.
* On the final step you start NGINX in single process mode just like you did before.

Now to build an image using this code, execute the following command:

```text
docker image build --file Dockerfile.built --tag custom-nginx:built-v1 .

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
# Successfully tagged custom-nginx:built-v1
```

Now you should be able to run a container using the `custom-nginx:built-v1` image. This code is alright but there are some places where improvements can be made. 

* Instead of hard coding the filename like `nginx-1.19.2.tar.gz`, you can create an argument using the `ARG` instruction. This way, you'll be able to change the version or filename by just changing the argument.
* Instead of downloading the archive manually, you can let the daemon download the file during the build process. There is another instruction like `COPY` called the `ADD` instruction which is capable of adding files from the internet.

Open up the `Dockerfile.built` file and update it's content as follows:

```text
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
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

* The `ARG` instruction lets you declare variables like in other languages. These variables  or arguments can later be accessed using the `${argument name}` syntax. Here, I've put the filename `nginx-1.19.2` and the file extension `tar.gz` in two separate arguments. This way I can switch between newer versions of NGINX or the archive format by making a change in just one place. In the code above, I've added default values to the variables. Variable values can be passed as option of the `image build` command as well. You can consult the [official reference](https://docs.docker.com/engine/reference/builder/#arg) for more details.
* In the `ADD` instruction, I've formed the download URL dynamically using the arguments declared above. The `https://nginx.org/download/${FILENAME}.${EXTENSION}` line will result in something like `https://nginx.org/download/nginx-1.19.2.tar.gz` during the build process. You can change the file version or the extension by changing it in just one place thanks to the `ARG` instruction.
* The `ADD` instruction doesn't extract files obtained from the internet by default hence, the usage of `tar` on line 18 here.

Rest of the code is almost unchanged. You should be able to infer the usage of the arguments by yourself now. Finally let's try to build an image from this updated code.

```text
docker image build --file Dockerfile.built --tag custom-nginx:built-v2 .

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
docker container run --detach --name custom-nginx-built --publish 8080:80 custom-nginx:built-v2

# 90ccdbc0b598dddc4199451b2f30a942249d85a8ed21da3c8d14612f17eed0aa

docker container ls

# CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 90ccdbc0b598        custom-nginx:built-v2   "nginx -g 'daemon of…"   2 minutes ago       Up 2 minutes        0.0.0.0:8080->80/tcp   custom-nginx-built
```

As you can see, a container using the `custom-nginx:built-v2` image has been successfully run. The container should be accessible at `http://127.0.0.1:8080` address now.

![](.gitbook/assets/nginx-default.png)

And here is the trusty default response page from NGINX. You can visit the [official reference](https://docs.docker.com/engine/reference/builder/) site to learn more about the available instructions.

## Creating Executable Images

In the previous section you've worked with the [fhsinchy/rmbyext](https://hub.docker.com/r/fhsinchy/rmbyext) image. In this section you'll learn about making such an executable image. Open up the `rmbyext` directory inside the code repository for this article.

Before you start working on the `Dockerfile` take a moment to plan out what the final output should be. In my opinion it should be something like as follows:

* The image should have python pre-installed.
* It should contain a copy of my `rmbyext` script.
* A working directory should be set where the script will be executed.
* The `rmbyext` script should be set as the entrypoint so the image can take extension names as arguments.

To build the above mentioned image, the following steps should be taken:

* Get a good base image for running python scripts i.e. [python](https://hub.docker.com/_/python).
* Set-up the working directory to an easily accessible directory.
* Install git so that the script can be installed from my github repository.
* Install the script using git and pip.
* Create and switch to a non-root user.
* Set `rmbyext` as the entrypoint for this image.

Now create a new `Dockerfile` inside the `rmbyext` directory and put following code in it:

```text
FROM python:3-buster

WORKDIR /zone

RUN apt-get update && \
    apt-get install git -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext

RUN useradd human && \
    chown -R human /zone

USER human

ENTRYPOINT [ "rmbyext" ]
```

Explanation for the instructions in this file is as follows:

* The `FROM` instruction sets [python](https://hub.docker.com/_/python) as the base image making an ideal environment for running python scripts. The `3-buster` tags indicates that you want Python 3 installed within a [Debian Buster](https://www.debian.org/releases/buster/) image.
* The `WORKDIR` instruction sets the default working directory to `/zone` here. The name of the working directory is completely random here. I found zone to be fitting name, you may use anything you want.
* The `RUN` instruction on line 5 checks for necessary updates, installs git and cleans unnecessary cached data using regular `apt-get` commands. Given this is a Debian image, `apt-get` is available right from the get go.
* The `RUN` instruction on line 9 installs the `rmbyext` script using git and pip.
* The third `RUN` instruction on line 11 creates a new user named `human` and sets it as the owner of the `/zone` directory. Here, `human` is a non-root user and given the `/zone` directory is in the root, it doesn't have write access to that directory. Hence the necessity of the `chown` command. You could just create the directory in `/home/human/zone` instead of `/zone` but writing `$(pwd):/zone` seems much easier than writing `$(pwd):/home/human/zone` to me.
* The `USER` instruction sets `human` as the default user for the image. I've set the user just before setting the entrypoint because if I had set it earlier for say before all the `RUN` instructions, then the installation of the git package and the rmbyext script would have failed for the lack of root permission.
* Finally on line 16, the `ENTRYPOINT` instruction sets the `rmbyext` script as the entrypoint for this image.

In this entire file, line 16 is the magic that turns this seemingly normal image to an executable one. Now to build the image you can execute following command:

```text
docker image build --tag rmbyext .
```

Here I'm not providing any tag after the image name so the image will be tagged as `latest` by default. You should be able to run the image as you saw in the previous section. Just remember to refer to the actual image name you've set instead of `fhsinchy/rmbyext` here.

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

As seen in the output above, you'll be prompted for your username and password. If you input them properly, you should be logged in to your account successfully.

