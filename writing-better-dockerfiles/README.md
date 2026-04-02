# Writing better Dockerfiles with caching and .dockerignore

Now that you've built your first Docker image and have a working Dockerfile, it's time to think about making it better. The Dockerfile you wrote in the previous chapter works just fine, but as your projects grow, you'll start noticing that builds take longer than they should. Most of that wasted time comes down to how Docker handles **image layers** and **caching**. In this chapter, I'll walk you through the mechanics of layer caching, show you why a naive Dockerfile can be painfully slow, and then fix it step by step.

## Understanding image layers

Every instruction in your Dockerfile creates a new **layer** in the resulting image. Think of layers as stacked snapshots of the filesystem. When Docker executes a `FROM`, `RUN`, `COPY`, or `ADD` instruction, it takes whatever changes that instruction made and saves them as a distinct layer. The final image is just all these layers stacked on top of each other.

You can actually see these layers yourself. If you've still got the `hello-dock:dev` image from the previous chapter, run the following command:

```text
docker image history hello-dock:dev

# IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
# 1792250adb79   10 minutes ago   CMD ["npm" "run" "dev"]                         0B
# afb6d9a1bc76   10 minutes ago   COPY dir:... in .                               actual source files
# c17ecb19a210   10 minutes ago   RUN /bin/sh -c npm install                      node_modules
# 24fc5164a1dc   10 minutes ago   COPY file:...package.json in .                  package.json
# 6bd4c42892a4   10 minutes ago   WORKDIR /home/node/app                          0B
# e2a8aa88790e   10 minutes ago   EXPOSE map[3000/tcp:{}]                         0B
# b90fa0d7cbd1   2 weeks ago      /bin/sh -c #(nop) CMD ["node"]                  0B
```

As you can see, each instruction from your Dockerfile shows up as its own layer. The `SIZE` column tells you how much disk space each layer adds. The `RUN npm install` layer is usually the heaviest because it pulls down all your dependencies.

Here's the important part: Docker **caches** each of these layers. When you rebuild an image, Docker checks each instruction from top to bottom. If the instruction and its inputs haven't changed since the last build, Docker reuses the cached layer instead of executing it again. This is what makes rebuilds fast — or at least, it's what _should_ make them fast. The catch is that the moment Docker finds one layer that has changed, it **invalidates the cache for every layer that comes after it**. This is where most people run into trouble.

## The layer caching problem

Let me show you what I mean. Say you have a Dockerfile for the `hello-dock` project that looks like this:

```text
FROM node:lts-alpine

EXPOSE 3000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]
```

Notice that this Dockerfile copies the entire project directory first with `COPY . .` and then runs `npm install`. Let's build it and see what happens:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  4.608MB
# Step 1/8 : FROM node:lts-alpine
#  ---> b90fa0d7cbd1
# Step 2/8 : EXPOSE 3000
#  ---> Using cache
#  ---> e2a8aa88790e
# Step 3/8 : USER node
#  ---> Using cache
#  ---> 7a4f0e1c923d
# Step 4/8 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 8b2e1f3c5d7a
# Step 5/8 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 6bd4c42892a4
# Step 6/8 : COPY . .
#  ---> 3f7a2b9c1d5e
# Step 7/8 : RUN npm install
#  ---> Running in 9c4e2d8f1a3b
### LONG INSTALLATION STUFF GOES HERE ###
#  ---> a1b2c3d4e5f6
# Step 8/8 : CMD [ "npm", "run", "dev" ]
#  ---> Running in 4d3c2b1a0f9e
#  ---> f6e5d4c3b2a1
# Successfully built f6e5d4c3b2a1
```

That first build takes a while because `npm install` has to download and install all the dependencies from scratch. Now go ahead and make a tiny change to one of your source files — maybe edit a single line in `src/App.jsx` — and rebuild:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  4.608MB
# Step 1/8 : FROM node:lts-alpine
#  ---> b90fa0d7cbd1
# Step 2/8 : EXPOSE 3000
#  ---> Using cache
#  ---> e2a8aa88790e
# Step 3/8 : USER node
#  ---> Using cache
#  ---> 7a4f0e1c923d
# Step 4/8 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 8b2e1f3c5d7a
# Step 5/8 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 6bd4c42892a4
# Step 6/8 : COPY . .
#  ---> 9e8d7c6b5a4f
# Step 7/8 : RUN npm install
#  ---> Running in 2a3b4c5d6e7f
### LONG INSTALLATION STUFF GOES HERE AGAIN ###
#  ---> 0f1e2d3c4b5a
# Step 8/8 : CMD [ "npm", "run", "dev" ]
#  ---> Running in 8f7e6d5c4b3a
#  ---> 5a4b3c2d1e0f
# Successfully built 5a4b3c2d1e0f
```

Notice anything? There is no `Using cache` on Step 6 or Step 7. Because you changed a source file, the `COPY . .` layer is invalidated. And since `RUN npm install` comes _after_ the COPY, its cache is invalidated too. Docker runs the entire `npm install` from scratch even though your dependencies haven't changed at all. You just edited one line of application code.

On a project with a handful of dependencies this might cost you 10-15 seconds. On a real production project with hundreds of packages, you could easily be waiting minutes every single time you change a source file. That's a lot of wasted time.

## Optimizing COPY order

The fix is surprisingly simple: copy your `package.json` \(and `package-lock.json` if you have one\) first, install dependencies, and _then_ copy the rest of your source code. Here's the optimized Dockerfile:

```text
FROM node:lts-alpine

EXPOSE 3000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

The important difference is that `COPY ./package.json .` and `RUN npm install` now come before the `COPY . .` that brings in the rest of the source code. Let's build this for the first time:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  4.608MB
# Step 1/8 : FROM node:lts-alpine
#  ---> b90fa0d7cbd1
# Step 2/8 : EXPOSE 3000
#  ---> Using cache
#  ---> e2a8aa88790e
# Step 3/8 : USER node
#  ---> Using cache
#  ---> 7a4f0e1c923d
# Step 4/8 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 8b2e1f3c5d7a
# Step 5/8 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 6bd4c42892a4
# Step 6/8 : COPY ./package.json .
#  ---> 24fc5164a1dc
# Step 7/8 : RUN npm install
#  ---> Running in 23b4de3f930b
### LONG INSTALLATION STUFF GOES HERE ###
#  ---> c17ecb19a210
# Step 8/8 : COPY . .
#  ---> afb6d9a1bc76
# Step 9/9 : CMD [ "npm", "run", "dev" ]
#  ---> 1792250adb79
# Successfully built 1792250adb79
```

Now make that same tiny change to `src/App.jsx` and rebuild:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  4.608MB
# Step 1/8 : FROM node:lts-alpine
#  ---> b90fa0d7cbd1
# Step 2/8 : EXPOSE 3000
#  ---> Using cache
#  ---> e2a8aa88790e
# Step 3/8 : USER node
#  ---> Using cache
#  ---> 7a4f0e1c923d
# Step 4/8 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 8b2e1f3c5d7a
# Step 5/8 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 6bd4c42892a4
# Step 6/8 : COPY ./package.json .
#  ---> Using cache
#  ---> 24fc5164a1dc
# Step 7/8 : RUN npm install
#  ---> Using cache
#  ---> c17ecb19a210
# Step 8/8 : COPY . .
#  ---> 7d8c9b0a1e2f
# Step 9/9 : CMD [ "npm", "run", "dev" ]
#  ---> Running in 3e4f5a6b7c8d
#  ---> 2f1e0d9c8b7a
# Successfully built 2f1e0d9c8b7a
```

As you can see, Step 6 and Step 7 both say `Using cache` this time. Docker detected that `package.json` hasn't changed, so it skipped the entire `npm install` step. The only layer that gets rebuilt is the `COPY . .` which picks up your changed source file, and the `CMD` layer after it. The build completes in a fraction of the time.

This works because Docker's cache invalidation flows top to bottom. Since `package.json` didn't change, the `COPY ./package.json .` layer is still valid, which means the `RUN npm install` layer after it is also still valid. The `COPY . .` layer is invalidated because a source file changed, but by that point the expensive dependency installation is already safely cached above it.

## The .dockerignore file

You might have noticed the line `Sending build context to Docker daemon 4.608MB` at the top of every build output. Before Docker can build your image, it packages up everything in the current directory \(the **build context**\) and sends it to the Docker daemon. Everything means _everything_ — your source code, your `.git` directory, any local `node_modules` folder, build artifacts, temporary files, all of it.

The **.dockerignore** file works a lot like `.gitignore` but for Docker builds. It tells Docker which files and directories to exclude from the build context. Create a file called `.dockerignore` in the root of your `hello-dock` project with the following content:

```text
.git
*Dockerfile*
*docker-compose*
node_modules
dist
```

Let me explain each entry:

- `.git` — your Git history can be huge and you never need it inside a container. There's no reason to send it to the daemon.
- `*Dockerfile*` — the Dockerfile itself and any variants \(like `Dockerfile.dev`, `Dockerfile.prod`\) don't need to be inside the image. They're instructions _for_ the build, not part of the application.
- `*docker-compose*` — same logic. Your compose files are for orchestration, not for running inside the container.
- `node_modules` — this is a big one. If you have a local `node_modules` directory from running `npm install` on your host machine, you definitely don't want it copied into the image. The image runs its own `npm install` to get the correct dependencies for its own environment \(which might be a different OS or architecture\). Sending a 200MB `node_modules` folder to the daemon just to ignore it during the build is a waste of time and bandwidth.
- `dist` — build output from previous local builds. Like `node_modules`, this should be generated fresh inside the container if needed.

## Build context size

To see the effect of `.dockerignore` in practice, pay attention to that `Sending build context` line. Without a `.dockerignore`, you might see something like this:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  205.3MB
```

That 205MB is mostly `node_modules` being sent to the daemon for no reason. After adding the `.dockerignore` file above, the same build command shows:

```text
docker image build --file Dockerfile.dev --tag hello-dock:dev .

# Sending build context to Docker daemon  4.608MB
```

Hence the build context dropped from over 200MB down to about 4.6MB. The build starts faster, uses less memory, and you avoid accidentally copying things like local `node_modules` into the image where they could interfere with the fresh `npm install` that runs during the build.

Keep in mind that a large build context doesn't just slow down the initial transfer. If any of those extra files end up inside a `COPY . .` instruction, they inflate the size of your image layers and make cache invalidation more likely. A `.dockerignore` file is not optional — treat it as a required companion to every Dockerfile you write.

## The --no-cache flag

Sometimes you actually want Docker to throw away all cached layers and build everything from scratch. Maybe you suspect a cached layer is stale, or you want to make sure a `RUN apt-get update` actually hits the network instead of reusing a weeks-old cache. The generic syntax for forcing a fresh build is as follows:

```text
docker image build --no-cache --file Dockerfile.dev --tag hello-dock:dev .
```

With the `--no-cache` flag, Docker executes every single instruction in the Dockerfile regardless of whether the cache is valid. You'll see that no steps show `Using cache` in the output.

I wouldn't recommend using `--no-cache` for everyday development. The whole point of layer caching is to speed up your workflow, and bypassing it defeats the purpose. But it's a useful escape hatch when something seems off and you want to rule out caching as the culprit.

## Practical tips

Now that you understand how layer caching works and how `.dockerignore` keeps your build context clean, here are a few general guidelines I follow when writing Dockerfiles:

**Order instructions from least-changed to most-changed.** Your `FROM`, `EXPOSE`, `USER`, and `WORKDIR` instructions almost never change between builds. Dependency installation \(`RUN npm install`, `RUN pip install`, etc.\) changes only when you add or remove a package. Your application source code changes constantly. Arrange your Dockerfile to reflect this — stable instructions at the top, frequently-changing instructions at the bottom. This maximizes the number of layers Docker can pull from cache.

**Group related operations in a single RUN instruction.** If you need to update your package manager and install something, do it in one `RUN` instead of two:

```text
RUN apk update && apk add --no-cache curl
```

If you split this into two separate `RUN` instructions, the `apk update` layer gets cached independently. Weeks later when you rebuild, Docker might reuse the stale `apk update` cache and then fail on `apk add` because the package index is outdated.

**Use specific base image tags instead of `:latest`.** During development, using `node:lts-alpine` is fine. But for production images, pin to a specific version like `node:20.11.0-alpine`. The `:latest` tag \(or `:lts`\) is a moving target — what it points to today might be different next month. Pinning versions means your builds are reproducible and you won't be surprised by breaking changes in a base image update.

**Always have a `.dockerignore` file.** I've already covered this, but it bears repeating. Every project with a Dockerfile should have a `.dockerignore` right next to it. At minimum, exclude `.git`, `node_modules` \(or your language's equivalent\), and any build artifacts.

**Copy dependency manifests before source code.** This is the single most impactful optimization you can make. Whether it's `package.json` for Node.js, `requirements.txt` for Python, `go.mod` for Go, or `Gemfile` for Ruby — always copy the dependency file first, install dependencies, then copy everything else. The pattern is the same regardless of language.

These aren't rules you need to memorize and apply mechanically. Once you internalize how layer caching works — top to bottom, first change invalidates everything below it — the right Dockerfile structure follows naturally.
