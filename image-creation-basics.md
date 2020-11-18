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

Just like containers, you can assign custom identifier to your images instead of relying on the randomly generated id. In case of an image, it's called tagging instead of naming. The `--tag` option is used in such cases. In order to tag your custom NGINX image with `custom-nginx:packaged` you can execute the following command:



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

As you can see, the code inside the `Dockerfile.built.v1` reflects the seven steps I talked about beforehand.

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

## Containerizing a JavaScript Application

Now that you've got some idea of creating images, it's time to work with something a bit more relevant. In this sub-section, you'll be working with the source code of the [fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock) image that you worked with on a previous section. In the process of containerizing this very simple application, you'll be introduced to volumes and multi-staged builds, two of the most important concepts in Docker.

To begin with, open up the directory where you've cloned the repository that came with this article. Code for the `hello-dock` application resides inside the sub-directory with the same name.

```text
.
├── index.html
├── package.json
├── public
│   └── favicon.ico
└── src
    ├── App.vue
    ├── assets
    │   └── docker-handbook-github.webp
    ├── components
    │   └── HelloDock.vue
    ├── index.css
    └── main.js
```

This is a very simple JavaScript project powered by the [vitejs/vite](https://github.com/vitejs/vite) project. Don't worry though, you don't need to know JavaScript or vite in order to go through this sub-section. Having a basic understanding of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) will suffice.

Just like any other project you've done in the previous sub-section, you'll begin by making a plan of how you want this application to run. In my opinion, the plan should be as follows:

* Get a good base image for running JavaScript applications i.e. [node](https://hub.docker.com/_/node).
* Set the default working directory inside the image.
* Copy the `package.json` file into the image.
* Install necessary dependencies.
* Copy rest of the project files.
* Start the vite development server by executing `npm run dev` command.

This plan should always come from the developer of the application that you're containerizing. If you're the developer yourself, then you should already have a proper understanding of how this application needs to be run. Now if you put the above mentioned plan inside `Dockerfile.dev`, the file should look like as follows:

```text
FROM node:lts

EXPOSE 3000

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

Explanation for this code is as follows:

* The `FROM` instruction here sets the official Node.js image as the base giving you all the goodness of Node.js necessary to run any JavaScript application. The `lts` tag indicates that you want to use the long term support version of the image. Available tags and necessary documentation for an image is usually found on [node](https://hub.docker.com/_/node) hub page.
* Then the `WORKDIR` instruction sets the default working directory to `/app` directory. By default the working directory of any image is the root. You don't want any unnecessary files sprayed all over your root directory, do you? Hence you change the default working directory to something more sensible like `/app` or whatever you like. This working directory will be application to any consecutive `COPY`, `ADD`, `RUN` and `CMD` instructions.
* The `COPY` instruction here copies the `package.json` file which contains information regarding all the necessary dependencies for this application. The `RUN` instruction executes `npm install` command which is the default command for installing dependencies using a `package.json` file in Node.js projects. The `.` at the end represents the working directory.
* The second `COPY` instruction copies rest of the content from the current directory \(`.`\) of the host filesystem to the working directory \(`.`\) inside the image.
* Finally, the `CMD` instruction here sets the default command for this image which is `npm run dev` written in `exec` form.
* The vite development server by default runs on port `3000` hence adding an `EXPOSE` command seemed like a good idea, so there you go.

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

A container can be run using this image by executing the following command:

```text
docker container run --detach --publish 3000:3000 --name hello-dock-dev hello-dock:dev

# 21b9b1499d195d85e81f0e8bce08f43a64b63d589c5f15cbbd0b9c0cb07ae268
```

Now visit `http://127.0.0.1:3000` do see the `hello-dock` application in action.

![](.gitbook/assets/hello-dock-dev.png)

Congratulations on running your first real-world application inside a container. The code you've just written is okay but there is one big issue with it and a few places where it can be improved. Let's begin with the issue first.

If you've worked with any front-end JavaScript framework before, you should know that the development servers in these frameworks usually come with a hot reload feature. That is if you make a change in your code, the server will reload automatically reflecting any changes you've made immediately.

But if you make any change in your code right now, you'll see nothing happening to your application running in the browser. The reason behind this is the fact that you're making changes in the code that you have in your local file system but the application you're seeing in the browser resides inside the container file system.

![](.gitbook/assets/local-vs-container-file-system.svg)

To solve this issue, Docker has something called a [bind mount](https://docs.docker.com/storage/bind-mounts/). Using bind mount, you can easily mount one of your local file system directory inside a container. Instead of making a copy of the local file system inside the container, the bind mount can reference the local file system inside the container.

![](.gitbook/assets/bind-mounts.svg)

This way, any changes you make to your local source code will reflect immediately inside the container triggering the hot reload feature of vite development server.

A bind mount can be created by using the `--volume` option for the `container run` or `container start` commands. Kill and remove your previously started `hello-dock-dev` container, open up a terminal window inside the `hello-dock` project directory and start a new container by executing the following command:

```text
docker container run --detach --publish 3000:3000 --name hello-dock-dev --volume $(pwd):/app hello-dock:dev
```

The `--volume` option can take three fields separated by colons \(`:`\). The generic syntax for the option is as follows:

```text
--volume <local file system directory absolute path>:<container file system directory absolute path>:<read write access>
```

The third field is optional but you must pass the absolute path of your local directory and the absolute path of the directory inside the container that will reference the local directory. In the command above `$(pwd)` will be replaced the the absolute path of your local directory which if you're following the article properly, should be your `hello-dock` project directory.

Although the usage of a volume solves the issue of hot reloads, it introduces another one. If you have any previous experience with Node.js, you may know that the dependencies of a Node.js project lives inside the `node_modules` directory on the project root.

Now that you're mounting the project root on your local file system as a volume inside the container, the content inside the container gets replaced along with the `node_modules` directory that contains all the dependencies.

This problem here can be solved using an anonymous volume. An anonymous volume is identical to a bind mount except the fact that you don't need to specify the source of the volume here. The generic syntax for creating an anonymous volume is as follows:

```text
--volume <container file system directory absolute path>:<read write access>
```

Here, Docker will take the entire `node_modules` directory from inside the container and tuck it away in some other directory managed by the Docker daemon on your host file system and will mount that directory as `node_modules` inside the container.

Now, the `hello-dock` container can be started with both volumes by executing the following command:

```text
docker container run --detach --publish 3000:3000 --name hello-dock-dev --volume $(pwd):/app --volume /app/node_modules hello-dock:dev
```

