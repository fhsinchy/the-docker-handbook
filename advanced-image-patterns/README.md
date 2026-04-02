# Multi-stage builds, non-root users, and smaller images

Now that you've learned how caching works and how `.dockerignore` keeps unwanted files out of your build context, it's time to tackle the final piece of the image-building puzzle. In this chapter, you'll learn how to produce images that are small, secure, and ready for production.

Throughout chapters 7 and 8, you've been building development images. They work great on your machine, but shipping them to production as-is would be like delivering the entire workshop along with the finished product.

## The problem with large images

Let's take a step back and think about what's actually inside the `hello-dock:dev` image you built earlier. It contains the full Node.js runtime, all the development dependencies from `node_modules`, the source code, the vite development server, and everything else that comes with the `node` base image. That's a lot of stuff.

To see just how much, you can check the image size by running the following command:

```text
docker image ls hello-dock:dev

# REPOSITORY    TAG    IMAGE ID       CREATED        SIZE
# hello-dock    dev    1792250adb79   2 hours ago    438MB
```

438 megabytes for a simple frontend application. Keep in mind that in production, you don't actually need Node.js or any of the development dependencies. A frontend application built with vite produces a handful of static HTML, CSS, and JavaScript files. All you need to serve those files is a lightweight web server like NGINX.

So the question becomes: how do you use Node.js to build the project, but then only ship the built files with NGINX? Well, you could build the project on your local machine first and then copy the output into an NGINX image. That's completely valid, but it means your build process depends on whatever Node.js version happens to be installed on the host machine. It also means anyone who wants to build the image needs Node.js installed locally.

A much better approach is to let Docker handle the entire build process inside a single Dockerfile. This is exactly what **multi-stage builds** are for.

## Multi-stage builds

A multi-stage build lets you use multiple `FROM` instructions in a single Dockerfile. Each `FROM` instruction starts a new **stage**, and you can selectively copy files from one stage into another. The important thing to understand is that only the final stage ends up in the finished image. Everything from the earlier stages gets discarded.

Let's write a production Dockerfile for the `hello-dock` application. Create a new file called `Dockerfile` \(not `Dockerfile.dev`\) inside the `hello-dock` project directory with the following content:

```text
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

Explanation for this code is as follows:

- The first `FROM node:22-alpine AS build` instruction starts a stage and names it `build`. The `AS` keyword is what gives the stage its name. You can pick any name you like, but something descriptive like `build` makes your intent clear.
- Inside the `build` stage, you set up the working directory, copy the `package.json` and `package-lock.json` files, install dependencies using `npm ci` \(which is faster and more reliable than `npm install` for clean installs\), copy the rest of the source code, and run `npm run build`. This produces the static files inside the `/app/dist` directory.
- The second `FROM nginx:1.27-alpine` instruction starts a brand new stage. This is the stage that will become the final image. Notice that it uses NGINX as the base instead of Node.js.
- The `COPY --from=build /app/dist /usr/share/nginx/html` instruction is where the magic happens. The `--from=build` flag tells Docker to copy files not from the build context on your host machine, but from the `build` stage you defined earlier. It takes the static files from `/app/dist` and places them into `/usr/share/nginx/html`, which is the default directory that NGINX serves files from.

The result is an image that contains only NGINX and your built static files. Node.js, `node_modules`, your source code, and everything else from the build stage are gone. They were only needed temporarily.

Now build the image by executing the following command:

```text
docker image build --tag hello-dock:prod .

# [+] Building 18.3s (13/13) FINISHED
#  => [build 1/6] FROM node:22-alpine
#  => [build 2/6] WORKDIR /app
#  => [build 3/6] COPY package*.json ./
#  => [build 4/6] RUN npm ci
#  => [build 5/6] COPY . .
#  => [build 6/6] RUN npm run build
#  => [stage-1 1/2] FROM nginx:1.27-alpine
#  => [stage-1 2/2] COPY --from=build /app/dist /usr/share/nginx/html
#  => exporting to image
#  => => naming to docker.io/library/hello-dock:prod
```

As you can see in the output, Docker processes both stages in order. The `build` stage runs all six steps, and then the final stage copies the result.

You can run a container from this image to verify everything works:

```text
docker container run \
    --rm \
    --detach \
    --publish 8080:80 \
    --name hello-dock-prod \
    hello-dock:prod

# a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4
```

Now visit `http://127.0.0.1:8080` in your browser and you should see the hello-dock application running, this time served by NGINX instead of the vite development server.

## Comparing image sizes

Let's see how the production image compares to the development one. Execute the following command to list both images:

```text
docker image ls hello-dock

# REPOSITORY    TAG    IMAGE ID       CREATED          SIZE
# hello-dock    prod   a1b2c3d4e5f6   30 seconds ago   43.2MB
# hello-dock    dev    1792250adb79   2 hours ago      438MB
```

The production image is around 43 megabytes compared to 438 megabytes for the development image. That's roughly a 10x reduction in size. The difference comes from the fact that the production image doesn't carry Node.js, `node_modules`, or any of the source code. It has only NGINX and the compiled static files.

Smaller images mean faster pulls, faster deploys, and a smaller attack surface. Hence, multi-stage builds are one of the most impactful optimizations you can make.

## Running as a non-root user

By default, Docker runs processes inside a container as the **root** user. You can verify this by running a quick command:

```text
docker container run --rm nginx:1.27-alpine whoami

# root
```

This is a security concern. If an attacker finds a way to escape the container, they'd land on the host as root. Even inside the container, running as root means a compromised process has unrestricted access to everything in the filesystem.

The fix is straightforward. You use the `USER` instruction in your Dockerfile to switch to a non-root user. Many official images already ship with a non-root user built in. The `node` image, for example, includes a user called `node`. The `nginx` image includes a user called `nginx`.

Let's update the production Dockerfile to run NGINX as a non-root user. The `nginx` official image actually supports this out of the box starting from recent versions, but it requires a small adjustment. Update the Dockerfile as follows:

```text
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

USER nginx
```

The `USER nginx` instruction at the end tells Docker that when a container starts from this image, the process should run as the `nginx` user instead of `root`. Keep in mind that the `USER` instruction affects all subsequent `RUN`, `CMD`, and `ENTRYPOINT` instructions in the Dockerfile, so you generally want to place it towards the end after any instructions that need root privileges \(like installing packages or copying files into system directories\).

You can verify that the container is no longer running as root:

```text
docker image build --tag hello-dock:prod .

docker container run --rm hello-dock:prod whoami

# nginx
```

For the `node` image, you would use `USER node` instead. The principle is the same: always run your production containers as a non-root user unless you have a very specific reason not to.

## Why Alpine Linux

You might have noticed that both base images in the Dockerfile use the `-alpine` suffix: `node:22-alpine` and `nginx:1.27-alpine`. This is not a coincidence.

**Alpine Linux** is a minimal Linux distribution that weighs in at around 5 megabytes. Compare that to a standard Debian-based image which can easily be 100 megabytes or more just for the base layer. Most official images on Docker Hub offer Alpine variants, and for production images, I would suggest you to use them whenever possible.

To see the difference, you can compare the sizes of the regular and Alpine variants:

```text
docker image pull node:22
docker image pull node:22-alpine

docker image ls node

# REPOSITORY   TAG         IMAGE ID       CREATED       SIZE
# node         22          e4c5f2a3b7d9   2 days ago    1.09GB
# node         22-alpine   b3a1d2c4e5f6   2 days ago    136MB
```

The regular `node:22` image is over a gigabyte. The Alpine variant is 136 megabytes. That's a massive difference, and it comes entirely from the choice of base Linux distribution.

The trade-off is that Alpine uses **musl libc** instead of the standard **glibc** that most Linux distributions use. In practice, this rarely causes issues for Node.js or NGINX workloads. But if you're running applications that depend on native C libraries compiled against glibc, you might hit compatibility problems. In those cases, you can fall back to the Debian slim variants \(like `node:22-slim`\) which are smaller than the full images but still use glibc.

For the vast majority of production workloads, Alpine is the right choice. I prefer Alpine for anything that doesn't have a specific glibc dependency.

## Picking specific tags

One more thing that's easy to overlook but really matters in production: never use the `:latest` tag. When you write `FROM node` or `FROM nginx` without specifying a tag, Docker defaults to `:latest`. This means your image could be built on Node.js 22 today and Node.js 23 tomorrow, depending on when the upstream image gets updated. That's a recipe for unexpected breakages.

Instead, always pin to a specific version. The generic syntax for a pinned base image is as follows:

```text
FROM <image>:<version>-<variant>
```

For example:

- `node:22-alpine` gives you Node.js 22 on Alpine Linux.
- `nginx:1.27-alpine` gives you NGINX 1.27 on Alpine Linux.
- `python:3.12-slim` gives you Python 3.12 on Debian slim.

If you want even more control, you can pin to a specific patch version like `node:22.12.0-alpine`. How specific you need to be depends on your tolerance for upstream changes. At minimum, pin the major version. For critical production systems, pinning the full version string is safer.

The whole point is that your builds should be **reproducible**. The same Dockerfile should produce the same image regardless of when or where you build it. Pinning tags is a big part of making that happen.

## Combining everything

Let's bring together everything you've learned across chapters 7, 8, and 9 into a single production-ready Dockerfile. This Dockerfile uses multi-stage builds, runs as a non-root user, uses Alpine base images, and pins specific version tags:

```text
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Explanation for this code is as follows:

- `FROM node:22-alpine AS build` starts the build stage with a pinned, Alpine-based Node.js image.
- The build stage installs dependencies and compiles the application. Once the stage is done, none of this makes it into the final image.
- `FROM nginx:1.27-alpine` starts the production stage with a pinned, Alpine-based NGINX image.
- `COPY --from=build /app/dist /usr/share/nginx/html` pulls only the compiled static files from the build stage.
- `USER nginx` ensures the container runs as the non-root `nginx` user.
- `EXPOSE 80` documents that the container listens on port 80.
- `CMD ["nginx", "-g", "daemon off;"]` starts NGINX in the foreground, which is the correct way to run it inside a container.

Build and run this final image:

```text
docker image build --tag hello-dock:prod .

docker container run \
    --rm \
    --detach \
    --publish 8080:80 \
    --name hello-dock-prod \
    hello-dock:prod

# 7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
```

Visit `http://127.0.0.1:8080` and you should see the application running just like before, except now it's running in an image that is small, secure, and reproducible.

Let's do a final size comparison to appreciate how far you've come:

```text
docker image ls hello-dock

# REPOSITORY    TAG    IMAGE ID       CREATED          SIZE
# hello-dock    prod   d4e5f6a7b8c9   15 seconds ago   43.2MB
# hello-dock    dev    1792250adb79   2 hours ago      438MB
```

From 438 megabytes down to around 43. The production image doesn't carry Node.js, doesn't have `node_modules`, doesn't run as root, and is based on a specific, pinned version of NGINX on Alpine Linux. That's what a production-ready image looks like.

Before moving on, clean up the running container:

```text
docker container stop hello-dock-prod
```

With this chapter, you've completed the image-building trilogy. You now know how to write Dockerfiles, optimize them with layer caching and `.dockerignore`, and produce lean, secure production images using multi-stage builds. In the chapters ahead, you'll put these skills to work as you containerize real-world, multi-service applications.
