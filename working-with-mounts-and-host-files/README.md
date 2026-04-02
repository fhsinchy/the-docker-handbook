# Working with bind mounts, volumes, and host files

Now that you've a solid understanding of the container lifecycle and know how to inspect logs, execute commands inside running containers, and clean up after yourself, it's time to deal with one of the most fundamental challenges in the container world, data persistence.

So far, every container you've worked with has been disposable. You run it, it does its thing, you stop it, and everything inside it disappears. That's fine for stateless applications, but what happens when your application needs to remember things? What about your database? What about the files your users upload? What about the source code you're actively editing during development?

Let's find out by running into the problem head first.

## The ephemeral nature of containers

To understand why data persistence matters, you need to see the problem with your own eyes. Start by running an Alpine Linux container in interactive mode and creating a file inside it:

```text
docker container run --interactive --tty --name ephemeral-box alpine sh

# / #
```

You're now inside the container's shell. Create a simple text file:

```text
echo "very important data" > /tmp/important.txt

cat /tmp/important.txt

# very important data
```

The file exists. Now exit out of the container by typing `exit` or hitting `ctrl + d`. The container will stop. Let's verify:

```text
docker container ls --all

# CONTAINER ID   IMAGE    COMMAND   CREATED          STATUS                     PORTS   NAMES
# a1b2c3d4e5f6   alpine   "sh"      30 seconds ago   Exited (0) 5 seconds ago           ephemeral-box
```

Now remove this container and start a brand new one from the same image:

```text
docker container rm ephemeral-box

docker container run --interactive --tty --name ephemeral-box alpine sh

# / #
```

Try to read that file you created earlier:

```text
cat /tmp/important.txt

# cat: can't open '/tmp/important.txt': No such file or directory
```

The file is gone. This is because every time you create a new container, you're starting from a clean slate based on the image. The writable layer from the previous container was destroyed when you removed it. This is what people mean when they say containers are **ephemeral** — they're designed to be temporary.

Now imagine this happening to your Postgres database, or to files your application has been processing for hours. That would be a disaster.

Exit out of this container and remove it:

```text
exit

docker container rm ephemeral-box
```

Docker provides two primary mechanisms to deal with this problem: **bind mounts** and **volumes**. Both allow data to live outside the container's writable layer, so it survives container restarts and removals. Let's start with bind mounts.

## Bind mounts

A **bind mount** lets you take a directory \(or file\) on your host system and make it available inside a container. Whatever changes you make from the host side show up inside the container, and whatever changes the container makes show up on the host. It's a two-way sync.

This is really useful during development. Instead of rebuilding your image every time you change a line of code, you can mount your source code directory into the container and see changes reflected immediately.

The generic syntax for using a bind mount with the `--volume` or `-v` option is as follows:

```text
--volume <host directory absolute path>:<container directory path>
```

Keep in mind that the host path must be an absolute path. Relative paths won't work with the `-v` option.

Let's try this out. If you've been following along with the companion repository, you should have the `hello-dock` project inside the `docker-handbook-projects/hello-dock/starter/` directory. This is a simple React application powered by Vite. Don't worry though, you don't need to know React or Vite in order to follow along with this sub-section.

First, navigate to the project directory and take a look at what's there:

```text
ls -la docker-handbook-projects/hello-dock/starter/

# total 252
# drwxr-xr-x  4 user user   4096 ... .
# drwxr-xr-x  3 user user   4096 ... ..
# -rw-r--r--  1 user user    327 ... Dockerfile
# -rw-r--r--  1 user user    227 ... index.html
# -rw-r--r--  1 user user    282 ... package.json
# drwxr-xr-x  2 user user   4096 ... public
# drwxr-xr-x  2 user user   4096 ... src
# -rw-r--r--  1 user user    157 ... vite.config.js
```

Now run a container from the `node:lts` image, mounting this project directory into the container, and install the dependencies followed by starting the development server:

```text
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd)/docker-handbook-projects/hello-dock/starter:/home/node/app \
    --workdir /home/node/app \
    node:lts \
    sh -c "npm install && npm run dev"
```

Let me walk through the options:

* `--rm` removes the container automatically when it stops.
* `--detach` runs the container in the background.
* `--publish 3000:3000` maps port 3000 on your host to port 3000 in the container.
* `--name hello-dock-dev` gives the container a recognizable name.
* `--volume $(pwd)/docker-handbook-projects/hello-dock/starter:/home/node/app` mounts the project directory from your host into `/home/node/app` inside the container. The `$(pwd)` expands to your current working directory, giving us the absolute path.
* `--workdir /home/node/app` sets the working directory inside the container.
* `node:lts` is the image to use.
* `sh -c "npm install && npm run dev"` installs the dependencies and starts the Vite dev server.

Give it a few seconds to install dependencies and start up. You can check the logs to see the progress:

```text
docker container logs hello-dock-dev

# npm install output...
#
#   VITE v5.x.x  ready in xxx ms
#
#   ➜  Local:   http://localhost:3000/
```

Now visit `http://127.0.0.1:3000` in your browser and you should see the application running. The real magic is that if you open `docker-handbook-projects/hello-dock/starter/src/App.jsx` on your host machine and make a change — say, update the heading text — Vite's hot module replacement will pick up the change and the browser will update automatically. You didn't have to rebuild anything. That's the power of bind mounts during development.

Stop the container when you're done:

```text
docker container stop hello-dock-dev
```

## The bind mount gotcha with node_modules

Bind mounts seem perfect so far, but there is a subtle trap waiting for you, especially if you're working with Node.js projects. Let me show you.

Consider a scenario where your project has a `Dockerfile` that runs `npm install` during the build process. This means the image already has a `node_modules` directory baked in at the correct path. Now you run a container from that image and bind mount your project directory on top of it.

The problem? Your host machine's project directory probably doesn't have a `node_modules` folder \(or has one built for your host OS, not for the container's OS\). When you bind mount the project root into the container, the host directory's contents completely replace whatever was in that path inside the container — including the `node_modules` that was built during `docker build`.

Let's see this in action. Assume you've built an image called `hello-dock:dev` from the project's Dockerfile:

```text
docker image build --tag hello-dock:dev ./docker-handbook-projects/hello-dock/starter/
```

Now try to run it with a bind mount:

```text
docker container run \
    --rm \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd)/docker-handbook-projects/hello-dock/starter:/home/node/app \
    hello-dock:dev

# sh: 1: vite: not found
```

The container crashes because `vite` \(which lives inside `node_modules/.bin/`\) is not found. The bind mount wiped out the `node_modules` directory that was created during the image build. Your host directory took over, and since there is no `node_modules` on the host \(or it was built for a different platform\), the container can't find its dependencies.

This is a common source of confusion and frustration. Fortunately, there's a clean fix — **anonymous volumes**.

## Anonymous volumes

An **anonymous volume** is a volume that Docker creates and manages for you, but without a name you can easily reference later. The key trick here is that anonymous volumes can be used to protect specific directories inside the container from being overwritten by a bind mount.

The generic syntax for creating an anonymous volume is as follows:

```text
--volume <container directory path>
```

Notice that unlike a bind mount, you only specify the container path. No host path, no colon. Docker creates a directory somewhere on the host \(inside Docker's own storage area\) and maps it to that container path.

Here's the fix for the `node_modules` problem. You add an anonymous volume for the `node_modules` directory alongside your bind mount:

```text
docker container run \
    --rm \
    --detach \
    --publish 3000:3000 \
    --name hello-dock-dev \
    --volume $(pwd)/docker-handbook-projects/hello-dock/starter:/home/node/app \
    --volume /home/node/app/node_modules \
    hello-dock:dev
```

The second `--volume /home/node/app/node_modules` tells Docker: "for this specific path, use an anonymous volume instead of the bind mount." Because Docker evaluates more specific paths first, the `node_modules` directory is preserved from the image while everything else in `/home/node/app` comes from your host machine.

Check the logs to confirm the container started successfully:

```text
docker container logs hello-dock-dev

#   VITE v5.x.x  ready in xxx ms
#
#   ➜  Local:   http://localhost:3000/
```

As you can see, the container is running just fine now. You get the best of both worlds — live source code syncing from your host via the bind mount, and the container's own `node_modules` preserved via the anonymous volume.

Stop the container when you're done experimenting:

```text
docker container stop hello-dock-dev
```

The downside of anonymous volumes is that they are difficult to manage. They get random hash names, and if you remove the container with `--rm` or `docker container rm`, the anonymous volume is often left behind as an orphan. For cases where you need persistent, manageable storage, you want named volumes.

## Named volumes

A **named volume** is like an anonymous volume, but with a name you choose. This makes it easy to reference, reuse, and manage. Named volumes are the preferred mechanism for persisting data that needs to outlive a container, like database files, uploaded content, or application state.

To create a named volume, you can use the `volume create` command. The generic syntax is as follows:

```text
docker volume create <volume name>
```

Let's create a volume called `hello-dock-data`:

```text
docker volume create hello-dock-data

# hello-dock-data
```

You can list all volumes on your system using the `volume ls` command:

```text
docker volume ls

# DRIVER    VOLUME NAME
# local     hello-dock-data
```

To use this named volume in a container, you use the same `--volume` or `-v` option, but this time instead of a host path, you provide the volume name:

```text
--volume <volume name>:<container directory path>
```

Let's put this to use with a practical example. I'll use Postgres to show why named volumes matter for databases. Start a Postgres container with a named volume:

```text
docker volume create pg-data

docker container run \
    --rm \
    --detach \
    --publish 5432:5432 \
    --name pg-server \
    --env POSTGRES_PASSWORD=mysecretpassword \
    --volume pg-data:/var/lib/postgresql/data \
    postgres:16-alpine
```

The `--volume pg-data:/var/lib/postgresql/data` line mounts the named volume `pg-data` to `/var/lib/postgresql/data` inside the container, which is where Postgres stores its data files by default. The `--env` flag sets the required `POSTGRES_PASSWORD` environment variable.

Give the server a moment to initialize, then create a test database:

```text
docker container exec pg-server psql -U postgres -c "CREATE DATABASE testdb;"

# CREATE DATABASE
```

Verify it exists:

```text
docker container exec pg-server psql -U postgres -c "\l"

#                                                 List of databases
#    Name    |  Owner   | Encoding | ...
# -----------+----------+----------+-----
#  postgres  | postgres | UTF8     | ...
#  template0 | postgres | UTF8     | ...
#  template1 | postgres | UTF8     | ...
#  testdb    | postgres | UTF8     | ...
```

Now stop and remove the container:

```text
docker container stop pg-server
```

The container is gone \(we used `--rm`\), but the volume is still there:

```text
docker volume ls

# DRIVER    VOLUME NAME
# local     hello-dock-data
# local     pg-data
```

Start a brand new Postgres container using the same named volume:

```text
docker container run \
    --rm \
    --detach \
    --publish 5432:5432 \
    --name pg-server \
    --env POSTGRES_PASSWORD=mysecretpassword \
    --volume pg-data:/var/lib/postgresql/data \
    postgres:16-alpine
```

Check if the database survived:

```text
docker container exec pg-server psql -U postgres -c "\l"

#                                                 List of databases
#    Name    |  Owner   | Encoding | ...
# -----------+----------+----------+-----
#  postgres  | postgres | UTF8     | ...
#  template0 | postgres | UTF8     | ...
#  template1 | postgres | UTF8     | ...
#  testdb    | postgres | UTF8     | ...
```

The `testdb` database is still there. The container was destroyed and recreated, but the data persisted because it lived in the named volume, not inside the container's writable layer. This is exactly what you want for any stateful service.

Stop the container before moving on:

```text
docker container stop pg-server
```

## When to use what

At this point you've seen three different ways to handle data with containers — bind mounts, anonymous volumes, and named volumes. The natural question is: when should you use each one?

I prefer to think of it this way:

**Bind mounts** are for development. When you're actively writing code and want changes on your host machine to be reflected inside the container immediately, bind mounts are the way to go. They're perfect for source code syncing with a development server that supports hot reloading. I use them constantly when working on web applications.

**Named volumes** are for data persistence. When you need data to survive container restarts and removals, named volumes are the right choice. They're managed by Docker, which means you don't have to worry about file permissions or absolute paths on different host operating systems. I prefer a named volume in such scenarios over a bind mount because named volumes are portable and don't tie your setup to a specific directory on the host.

**Anonymous volumes** are for protecting container-internal directories from being overwritten by bind mounts. The `node_modules` trick you saw earlier is the classic use case. You rarely need anonymous volumes outside of that pattern, and I would suggest you avoid them for data persistence since they're hard to reference and manage.

Here's a quick mental model:

* Developing code? Bind mount your source directory.
* Storing data? Use a named volume.
* Bind mount clobbering something it shouldn't? Add an anonymous volume for that path.

## Volume cleanup

Just like containers and images, volumes take up disk space and should be cleaned up when you no longer need them. Docker provides a couple of commands for this.

To remove a specific named volume, the generic syntax is as follows:

```text
docker volume rm <volume name>
```

Let's remove the volumes we created earlier:

```text
docker volume rm hello-dock-data

# hello-dock-data

docker volume rm pg-data

# pg-data
```

Keep in mind that you can't remove a volume that's currently in use by a running container. You'll need to stop and remove the container first.

If you want to remove all unused volumes at once, you can use the `volume prune` command. This removes volumes that are not currently mounted in any container:

```text
docker volume prune

# WARNING! This will remove anonymous local volumes not used by at least one container.
# Are you sure you want to continue? [y/N] y
# Total reclaimed space: ...
```

This is especially handy for cleaning up orphaned anonymous volumes that pile up over time. I would suggest running this periodically to keep your system tidy.

You can verify everything is clean:

```text
docker volume ls

# DRIVER    VOLUME NAME
```

With a clean slate, you're ready to move on. In the next chapter, you'll learn about container networking, how to make containers talk to each other and to the outside world. That's where things start to get really interesting.
