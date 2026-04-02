# Containerizing a Modern Frontend Application

Now that you've learned how to compose multi-container projects using Docker Compose, it's time to take a step back and focus on something more focused -- containerizing a single modern frontend application for both development and production. In the process, you'll learn about **multi-stage builds**, one of the most powerful techniques for creating lean production images.

The project you'll be working with is the `hello-dock` application from the `docker-handbook-projects/hello-dock/` directory. This is a simple single-page application built with React, Vite, and TypeScript. Don't worry though, you don't need to know React or TypeScript in order to go through this chapter. A basic understanding of how frontend projects work will suffice.

## Planning the Containerization

Before you write a single line in a Dockerfile, it's worth thinking about what you actually need. A frontend application like `hello-dock` has two very different modes of operation:

- **Development** -- you want hot reload so that every time you save a file, the browser updates automatically. You're actively editing source code, so the container needs access to your latest changes in real time. Speed of feedback matters more than image size.
- **Production** -- you don't need Node.js at runtime at all. A frontend app gets compiled down to static HTML, CSS, and JavaScript files. All you need is a lightweight web server like Nginx to serve those files. Image size and security matter here.

These two scenarios call for two very different Dockerfiles. I prefer to keep them separate and name them `Dockerfile.dev` for development and simply `Dockerfile` for production. Let's start with the development setup.

## Writing the Development Dockerfile

Head to the `hello-dock` project directory inside the repository that came with this book. Create a new file called `Dockerfile.dev` and put the following code in it:

```text
FROM node:22-alpine

EXPOSE 5173

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

Explanation for this code is as follows:

- The `FROM` instruction sets the official `node:22-alpine` image as the base. Alpine keeps things small while still giving you everything Node.js needs to run. Version 22 is the current LTS release.
- The `EXPOSE` instruction documents that Vite's development server runs on port `5173` by default.
- The `WORKDIR` instruction sets `/app` as the default working directory inside the container. All subsequent instructions will execute relative to this directory.
- The `COPY` instruction copies only the `package.json` file first. This is intentional -- by copying the dependency manifest before the rest of the source code, Docker can cache the `npm install` step. As long as your dependencies don't change, rebuilds will be fast.
- The `RUN` instruction executes `npm install` to install all the dependencies listed in `package.json`.
- The second `COPY` instruction copies the rest of the project files into the working directory.
- The `CMD` instruction sets `npm run dev` as the default command, which starts the Vite development server.

Now build the image by executing the following command from the `hello-dock` directory:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# [+] Building 24.5s (10/10) FINISHED
#  => [internal] load build definition from Dockerfile.dev            0.0s
#  => [internal] load .dockerignore                                   0.0s
#  => [internal] load metadata for docker.io/library/node:22-alpine   1.2s
#  => [1/5] FROM docker.io/library/node:22-alpine@sha256:...         3.1s
#  => [2/5] WORKDIR /app                                              0.1s
#  => [3/5] COPY package.json .                                       0.0s
#  => [4/5] RUN npm install                                          18.3s
#  => [5/5] COPY . .                                                  0.1s
#  => exporting to image                                              1.5s
#  => => naming to docker.io/library/hello-dock:dev                   0.0s
```

Given the `Dockerfile.dev` isn't the default Dockerfile name, you have to use the `--file` option to point Docker to the right file. The `--tag` option names the image `hello-dock:dev` so you can easily tell it apart from the production image later.

## Running in Development Mode

Now try running a container from this image:

```text
docker container run \
    --rm \
    --publish 5173:5173 \
    hello-dock:dev
```

If you visit `http://127.0.0.1:5173` in your browser, you should see the application running. That's a good start. But there's a problem -- try editing one of the source files on your host machine. Nothing happens in the browser. The container is running with a copy of your source code baked into the image at build time. It has no idea about the changes you're making on the host.

This is where bind mounts come in. As you've already learned in a previous chapter, a bind mount lets you map a directory on your host to a directory inside the container. Let's try it:

```text
docker container run \
    --rm \
    --publish 5173:5173 \
    --volume $(pwd):/app \
    hello-dock:dev
```

If you run this, the container will likely crash or throw errors about missing modules. The problem is subtle but important. When you mount your current directory \(`$(pwd)`\) to `/app` inside the container, you're replacing everything that was in `/app` -- including the `node_modules` directory that was created during the `npm install` step in the image build. Your host machine probably doesn't have a `node_modules` folder \(or if it does, it might have been built for a different platform\), so the container suddenly can't find its dependencies.

This is a classic gotcha. The fix is to use an **anonymous volume** to protect the `node_modules` directory inside the container:

```text
docker container run \
    --rm \
    --publish 5173:5173 \
    --volume $(pwd):/app \
    --volume /app/node_modules \
    hello-dock:dev
```

The second `--volume /app/node_modules` \(with no colon, no host path\) creates an anonymous volume that effectively tells Docker "preserve whatever is already in `/app/node_modules` inside the container and don't let the bind mount overwrite it." The bind mount maps the whole `/app` directory, but the anonymous volume takes priority for the `node_modules` sub-directory.

Now visit `http://127.0.0.1:5173` again. The application should be running. Try editing one of the source files on your host -- say, change some text in `src/App.tsx`. Save the file, and watch the browser update automatically. That's Vite's hot module replacement working through the bind mount.

Keep in mind that the anonymous volume trick is useful whenever you need to protect a specific directory inside the container from being overwritten by a bind mount. It comes up often enough that it's worth remembering.

## The Production Dockerfile

For production, the requirements are completely different. You don't need Node.js, npm, your source code, or any of the development dependencies. All you need are the compiled static files served by a fast web server.

This is where **multi-stage builds** shine. A multi-stage build lets you use multiple `FROM` instructions in a single Dockerfile. Each `FROM` starts a new stage, and you can copy files from one stage to another. The final image only contains what's in the last stage -- everything else gets thrown away.

Create a file called `Dockerfile` \(no extension this time, since it's the default\) in the `hello-dock` directory and put the following code in it:

```text
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
```

This Dockerfile has two stages. Explanation for the first stage is as follows:

- The `FROM node:22-alpine AS build` instruction starts the first stage and gives it the name `build`. This name is important -- you'll reference it later.
- The `WORKDIR`, `COPY`, and dependency installation steps are similar to the development Dockerfile. The one difference is `npm ci` instead of `npm install`. The `npm ci` command is designed for automated environments -- it installs dependencies strictly based on `package-lock.json` and is faster and more reliable than `npm install` for production builds.
- The `COPY . .` instruction copies all source files, and `RUN npm run build` compiles the application into static files. Vite outputs these to the `dist` directory by default.

The second stage is where the magic happens:

- The `FROM nginx:stable-alpine` instruction starts a brand new stage based on the official Nginx Alpine image. This stage knows nothing about Node.js, npm, or your source code.
- The `COPY --from=build /app/dist /usr/share/nginx/html` instruction reaches back into the `build` stage and copies only the compiled static files into Nginx's default serving directory.

That's it. The final image contains nothing but Nginx and your compiled frontend. No Node.js runtime, no `node_modules`, no source code. Just the files that the browser actually needs.

## Building and Running the Production Image

Build the production image by executing the following command:

```text
docker image build --tag hello-dock:prod .

# [+] Building 32.1s (13/13) FINISHED
#  => [internal] load build definition from Dockerfile                0.0s
#  => [internal] load .dockerignore                                   0.0s
#  => [internal] load metadata for docker.io/library/nginx:stable-alpine  0.8s
#  => [internal] load metadata for docker.io/library/node:22-alpine       0.9s
#  => [build 1/5] FROM docker.io/library/node:22-alpine@sha256:...   0.0s
#  => [build 2/5] WORKDIR /app                                        0.0s
#  => [build 3/5] COPY package*.json ./                                0.0s
#  => [build 4/5] RUN npm ci                                         16.2s
#  => [build 5/5] COPY . .                                            0.1s
#  => [build 6/5] RUN npm run build                                   4.8s
#  => [stage-1 1/1] COPY --from=build /app/dist /usr/share/nginx/html 0.1s
#  => exporting to image                                              0.1s
#  => => naming to docker.io/library/hello-dock:prod                  0.0s
```

As you can see, both stages execute during the build, but the final image is based on the Nginx stage. Now run it:

```text
docker container run \
    --rm \
    --detach \
    --publish 8080:80 \
    --name hello-dock-prod \
    hello-dock:prod

# a7f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

Nginx inside the container listens on port `80` by default, and you're mapping it to port `8080` on your host. Visit `http://127.0.0.1:8080` in your browser and you should see the application running.

To verify it's working, you can check the container logs:

```text
docker container logs hello-dock-prod

# /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
# /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
# 10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
# /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
# /docker-entrypoint.sh: Configuration complete; ready for start up
```

Nginx is running and ready to serve your application. Stop the container when you're done:

```text
docker container stop hello-dock-prod
```

## The .dockerignore File

Before you move on, there's one more thing worth setting up. If you noticed, the `COPY . .` instruction in both Dockerfiles copies everything from your project directory into the image. That includes things you definitely don't want in there -- the `node_modules` directory, `.git` history, editor configuration files, and so on.

A `.dockerignore` file works exactly like a `.gitignore` file, but for Docker builds. Create a `.dockerignore` file in the `hello-dock` directory with the following content:

```text
node_modules
.git
.gitignore
Dockerfile
Dockerfile.dev
.dockerignore
dist
.env
.env.*
*.md
```

Explanation for these entries is as follows:

- `node_modules` -- this is the big one. You never want to copy the host's `node_modules` into the image. Dependencies should always be installed fresh inside the container to ensure they're built for the right platform. This also dramatically speeds up the `COPY . .` step.
- `.git` -- your Git history can be large and serves no purpose inside the container.
- `Dockerfile` and `Dockerfile.dev` -- the Dockerfiles themselves don't need to be inside the image.
- `.dockerignore` -- same logic as above.
- `dist` -- if a previous build left compiled files on the host, you don't want them sneaking into the image. The build should happen cleanly inside the container.
- `.env` and `.env.*` -- environment files often contain secrets. They should never be baked into an image.
- `*.md` -- documentation files like `README.md` don't need to be in the image.

With this file in place, Docker will skip these paths during any `COPY` or `ADD` instruction. I would suggest you to always create a `.dockerignore` file as one of the first things you do when containerizing a project.

## Image Size Comparison

One of the biggest reasons to use multi-stage builds is the difference in image size. Let's see how the development and production images compare:

```text
docker image ls --filter "reference=hello-dock"

# REPOSITORY   TAG    IMAGE ID       CREATED          SIZE
# hello-dock   prod   a1b2c3d4e5f6   5 minutes ago    43.8MB
# hello-dock   dev    f6e5d4c3b2a1   12 minutes ago   394MB
```

As you can see, the production image is roughly one-tenth the size of the development image. The development image carries the entire Node.js runtime, all of `node_modules` \(including dev dependencies\), and all of your source code. The production image contains only Nginx and a handful of static files.

This matters for several reasons:

- Smaller images are **faster to push and pull** from registries, which means faster deployments.
- Smaller images have a **smaller attack surface** -- fewer packages means fewer potential vulnerabilities.
- Smaller images use **less disk space** on your servers, which adds up when you're running many containers.

Hence, multi-stage builds are not just a nice-to-have. For any frontend application heading to production, they should be your default approach.

## Wrapping Up

In this chapter, you've containerized a modern frontend application for both development and production. You've written a development Dockerfile with bind mount support for hot reload, dealt with the anonymous volume trick for protecting `node_modules`, and built a lean production image using a multi-stage build with Nginx.

In the next chapter, you'll take things further by containerizing a backend service and connecting it to other services -- putting together everything you've learned so far.
