# Building your first Docker image

Now that you've worked with utility containers and seen how pre-built images can be used to accomplish various tasks, it's time for you to learn how to create your very own custom images. This is where Docker really starts to shine. Instead of relying on images made by others, you'll be crafting images tailored to your own applications.

As you've already learned in a previous chapter, images are multi-layered read-only files that act as templates for creating containers. They are like a frozen, read-only copy of a container. Up until this point, you've been pulling images from Docker Hub and running containers from them. In this chapter, you'll learn how to build images from scratch using a project called `hello-dock`.

The `hello-dock` project is a simple React application bootstrapped with Vite and TypeScript. Don't worry though, you don't need to know React, Vite, or TypeScript in order to go through this chapter. The source code lives inside the `docker-handbook-projects/hello-dock/` directory within the companion projects repository.

## Image creation basics

To create a Docker image, you need two things: a **Dockerfile** and a **build context**.

A **Dockerfile** is a plain text file that contains a set of instructions for building an image. Each instruction in a Dockerfile creates a new layer in the resulting image. You write the instructions, Docker reads them top to bottom, and produces an image at the end.

The **build context** is the directory that Docker sends to the daemon during the build process. When you execute the build command, everything inside the context directory \(unless excluded\) gets sent over. This is important because the `COPY` and `ADD` instructions in a Dockerfile can only access files from within this build context.

Keep in mind that the build context and the location of the Dockerfile don't have to be the same. You can have a Dockerfile sitting somewhere entirely different from your project files. In practice, though, I usually keep the Dockerfile right inside the project root.

## Planning the Dockerfile

Before writing any Dockerfile, I would suggest you take a moment to think about what the image needs to do. Think of it as a checklist. For the `hello-dock` project running in development mode, the plan is as follows:

1. Get a good base image that has Node.js pre-installed.
2. Set a working directory inside the image.
3. Copy the `package.json` and `package-lock.json` files into the image.
4. Install the project dependencies.
5. Copy the rest of the project files.
6. Start the Vite development server.

Once you've a plan like this, translating it into Dockerfile instructions becomes straightforward. Each step maps to one or more instructions. Lets go through the process of writing the Dockerfile now.

## Writing a development Dockerfile

Inside the `hello-dock` project directory, create a new file called `Dockerfile.dev`. The reason I'm using the `.dev` suffix is to make it clear that this Dockerfile is meant for development purposes. You'll write a separate production Dockerfile later in the book.

The content of the `Dockerfile.dev` file is as follows:

```text
FROM node:22-alpine

EXPOSE 5173

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
```

Explanation for this code is as follows:

- `FROM node:22-alpine` — every Dockerfile must start with a `FROM` instruction. This sets the **base image** for the build. Here, you're using the official Node.js image version 22 based on Alpine Linux. Alpine is a minimal Linux distribution that keeps images small. I prefer Alpine-based images whenever possible.
- `EXPOSE 5173` — this instruction indicates that the container will listen on port `5173` at runtime. Vite's development server runs on this port by default. Keep in mind that `EXPOSE` doesn't actually publish the port. It functions as documentation between the person who builds the image and the person who runs the container.
- `WORKDIR /app` — this sets the **working directory** inside the image to `/app`. Any subsequent `COPY`, `RUN`, or `CMD` instructions will execute relative to this directory. If the directory doesn't exist, Docker will create it.
- `COPY package*.json ./` — this copies both `package.json` and `package-lock.json` \(thanks to the wildcard\) from your build context into the working directory inside the image. The reason you copy these files separately before the rest of the code is something you'll understand better in the next chapter when I discuss layer caching.
- `RUN npm ci` — this executes `npm ci` during the build process to install project dependencies. The `npm ci` command performs a clean install based on the `package-lock.json` file, which is more reliable than `npm install` for reproducible builds.
- `COPY . .` — this copies everything else from the build context into the working directory. At this point, your entire project is inside the image.
- `CMD ["npm", "run", "dev", "--", "--host"]` — this sets the default command that runs when a container starts from this image. The `--host` flag tells Vite to listen on all network interfaces \(`0.0.0.0`\) instead of just `localhost`, which is necessary for the server to be accessible from outside the container.

The `CMD` instruction uses the **exec form** \(JSON array\) rather than the shell form. I prefer the exec form because it runs the process directly without wrapping it in a shell, which results in better signal handling. You'll learn more about the difference between `CMD` and `ENTRYPOINT` later in this chapter.

## Building the image

Now that the Dockerfile is ready, you can build an image from it. Open up your terminal, navigate to the `hello-dock` project directory, and execute the following command:

```text
docker image build \
    --file Dockerfile.dev \
    --tag hello-dock:dev \
    .

# [+] Building 28.6s (10/10) FINISHED                           docker:default
#  => [internal] load build definition from Dockerfile.dev               0.0s
#  => => transferring dockerfile: relative                                0.0s
#  => [internal] load metadata for docker.io/library/node:22-alpine      1.2s
#  => [internal] load .dockerignore                                      0.0s
#  => [1/5] FROM docker.io/library/node:22-alpine@sha256:abc123...       4.5s
#  => [internal] load build context                                      0.1s
#  => => transferring context: 2.31kB                                    0.0s
#  => [2/5] WORKDIR /app                                                 0.1s
#  => [3/5] COPY package*.json ./                                        0.0s
#  => [4/5] RUN npm ci                                                  21.3s
#  => [5/5] COPY . .                                                     0.1s
#  => exporting to image                                                 1.2s
#  => => naming to docker.io/library/hello-dock:dev                      0.0s
```

The generic syntax for the `docker image build` command is as follows:

```text
docker image build --file <dockerfile> --tag <repository:tag> <context>
```

In the command you just executed:

- `--file Dockerfile.dev` tells Docker which Dockerfile to use. If your Dockerfile is named simply `Dockerfile` \(no suffix\), you can skip this option entirely because Docker looks for a file named `Dockerfile` by default.
- `--tag hello-dock:dev` assigns a name and tag to the resulting image. The `hello-dock` part is the **repository name** and `dev` is the **tag**. You'll learn more about tagging conventions later in this chapter.
- `.` at the end is the build context. The dot means the current directory. Docker will send the contents of this directory to the daemon for the build.

As you can see in the output, Docker executed each instruction as a numbered step. The `[4/5] RUN npm ci` step took the longest because it had to download and install all the npm packages. Subsequent builds will be faster thanks to layer caching, which is a topic for the next chapter.

## Running a container from the image

Now that you've built the image, lets run a container from it. Execute the following command:

```text
docker container run \
    --rm \
    --detach \
    --publish 5173:5173 \
    --name hello-dock-dev \
    hello-dock:dev

# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

The options used here should be familiar to you from earlier chapters:

- `--rm` automatically removes the container when it stops.
- `--detach` runs the container in the background.
- `--publish 5173:5173` maps port `5173` on your host to port `5173` inside the container.
- `--name hello-dock-dev` gives the container a meaningful name instead of a randomly generated one.

Now visit `http://127.0.0.1:5173` in your browser and you should see the hello-dock application running. To verify the container is running, you can execute:

```text
docker container ls

# CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                    NAMES
# a1b2c3d4e5f6   hello-dock:dev   "docker-entrypoint.s…"   12 seconds ago   Up 11 seconds   0.0.0.0:5173->5173/tcp   hello-dock-dev
```

As you can see, the container named `hello-dock-dev` is up and running with port `5173` properly mapped.

Go ahead and stop the container before moving on:

```text
docker container stop hello-dock-dev

# hello-dock-dev
```

Since you used the `--rm` option, the container will be removed automatically once stopped.

## Dockerfile instructions reference

You've already seen several Dockerfile instructions in action. This sub-section is a brief reference for the most commonly used ones. I'll go through each of them with a short explanation.

### FROM

Sets the base image for the build. Every Dockerfile must begin with a `FROM` instruction \(except for `ARG`, which can come before it in rare cases\). You can use any image from a registry as a base.

```text
FROM node:22-alpine
```

### EXPOSE

Documents which port the container listens on at runtime. It does not actually publish the port. You still need `--publish` when running the container.

```text
EXPOSE 5173
```

### WORKDIR

Sets the working directory for subsequent instructions like `RUN`, `CMD`, `COPY`, and `ADD`. If the directory doesn't exist, it gets created.

```text
WORKDIR /app
```

### COPY

Copies files and directories from the build context into the image. The first argument is the source \(relative to the build context\) and the second is the destination \(inside the image\).

```text
COPY package*.json ./
COPY . .
```

### ADD

Similar to `COPY` but with two additional features: it can extract compressed archives automatically and it can fetch files from remote URLs. In my opinion, you should prefer `COPY` in most cases because it's more transparent. Use `ADD` only when you specifically need the archive extraction.

```text
ADD archive.tar.gz /app/
```

### RUN

Executes a command during the build process and commits the result as a new layer. This is where you install dependencies, compile code, or perform any setup step.

```text
RUN npm ci
```

### CMD

Sets the default command that runs when a container starts. It can be overridden by passing a command at the end of `docker container run`. There can be only one `CMD` instruction per Dockerfile. If you specify multiple, only the last one takes effect.

```text
CMD ["npm", "run", "dev", "--", "--host"]
```

### ENTRYPOINT

Similar to `CMD` but harder to override. The `ENTRYPOINT` instruction is designed for containers that should always run a specific executable. Arguments passed to `docker container run` get appended to the entrypoint instead of replacing it. When used together with `CMD`, the `CMD` values act as default arguments to the entrypoint.

```text
ENTRYPOINT ["node"]
CMD ["app.js"]
```

In this example, running the container without arguments would execute `node app.js`. Running it with `server.js` would execute `node server.js`.

### ENV

Sets environment variables inside the image. These persist both during build time and at runtime in containers created from the image.

```text
ENV NODE_ENV=production
```

### ARG

Defines build-time variables that can be passed using `--build-arg` during the build. Unlike `ENV`, these do not persist in the final image at runtime.

```text
ARG APP_VERSION=1.0.0
```

To pass a value during build:

```text
docker image build --build-arg APP_VERSION=2.0.0 .
```

### USER

Sets the user \(and optionally the group\) for subsequent `RUN`, `CMD`, and `ENTRYPOINT` instructions. This is important for security because by default everything runs as `root` inside a container.

```text
USER node
```

You'll learn more about running containers as non-root users in a later chapter.

## Tagging images

You've already tagged an image during the build process using the `--tag` option. But you can also tag images after they've been built. The generic syntax for the `docker image tag` command is as follows:

```text
docker image tag <source image> <new tag>
```

The full name of a Docker image follows this pattern:

```text
<registry>/<repository>:<tag>
```

When you omit the registry, Docker assumes `docker.io/library/` for official images or `docker.io/` for user images. When you omit the tag, Docker assumes `latest`.

Hence, `hello-dock:dev` is really `docker.io/library/hello-dock:dev` in its expanded form. To add another tag to the image you just built, you can execute:

```text
docker image tag hello-dock:dev hello-dock:dev-latest

# (no output)
```

This doesn't create a new image. It simply creates another reference pointing to the same image. You can verify this by listing images and noticing they share the same image ID.

A common convention is to use tags that reflect versions or environments. For example:

- `hello-dock:dev` for development
- `hello-dock:prod` for production
- `hello-dock:1.0.0` for versioned releases
- `hello-dock:latest` for the most recent build

I would suggest you always use explicit tags rather than relying on `latest`. The `latest` tag doesn't actually mean the most recent version of an image. It's just the default tag that gets applied when you don't specify one, which can be misleading.

## Listing and removing images

To list all images stored on your local system, execute the following command:

```text
docker image ls

# REPOSITORY    TAG          IMAGE ID       CREATED          SIZE
# hello-dock    dev          a1b2c3d4e5f6   10 minutes ago   254MB
# hello-dock    dev-latest   a1b2c3d4e5f6   10 minutes ago   254MB
# node          22-alpine    b2c3d4e5f6g7   2 weeks ago      186MB
```

As you can see, the `hello-dock:dev` and `hello-dock:dev-latest` images share the same `IMAGE ID` which confirms they are the same image with two different tags.

You can also use the `--filter` option to narrow down the list. For example, to see only dangling images \(layers that are no longer referenced by any tagged image\):

```text
docker image ls --filter dangling=true
```

To remove an image, you can use the `docker image rm` command. The generic syntax is as follows:

```text
docker image rm <image identifier>
```

The identifier can be the image ID or the repository:tag name. To remove the `hello-dock:dev-latest` tag you created earlier:

```text
docker image rm hello-dock:dev-latest

# Untagged: hello-dock:dev-latest
```

Since both tags pointed to the same image, removing one tag doesn't delete the actual image layers. The image is only deleted when all tags referencing it are removed and no containers \(running or stopped\) are using it.

If you want to clean up unused images in bulk, the `docker image prune` command is your friend. The generic syntax is as follows:

```text
docker image prune
```

This removes all dangling images. If you want to remove all images that are not being used by any container, add the `--all` option:

```text
docker image prune --all
```

Keep in mind that `--all` will remove every unused image, not just dangling ones. Use it with care if you have images you might want to keep around.

---

You now know how to write a Dockerfile, build an image from it, run containers from that image, tag images, and clean up after yourself. In the next chapter, you'll learn how to write better Dockerfiles by taking advantage of layer caching, using `.dockerignore` files, and structuring your instructions to produce faster, more efficient builds.
