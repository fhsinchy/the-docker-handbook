# Utility containers with imgtool

Now that you've a solid understanding of bind mounts, volumes, and how containers interact with host files, it's time to learn about a slightly different way of using Docker. So far, most of the containers you've worked with have been long-running services -- web servers, APIs, databases. But Docker is also excellent for packaging up small tools that do a job and exit. These are called **utility containers**.

You'll build and run a utility container from a real Python CLI called `imgtool`. Along the way, you'll learn about the `ENTRYPOINT` instruction, how it differs from `CMD`, and how arguments flow from your `docker run` command all the way into the container's process.

## What are utility containers

A utility container is a container that runs a tool, performs a task, and then exits. It is not a web server waiting for requests. It is not a database sitting idle between queries. It runs, does its thing, and disappears.

You've actually seen this pattern before. When you ran `docker container run --rm busybox sh -c "echo -n my-secret | base64"` back in the container manipulation chapter, that was a utility container. It encoded a string and exited.

The idea is simple: instead of installing a tool on your host machine, you package it inside an image. Anyone with Docker can then use it without worrying about Python versions, dependencies, or operating system differences. The tool is frozen inside the image, ready to go.

I prefer this approach for small CLI tools that I don't want cluttering up my system. You build the image once, and from that point on, `docker run` is all anyone needs.

## The imgtool example

The project you'll be working with is called `imgtool`. It's a small Python CLI that inspects image files \(`.jpg`, `.png`, `.gif`, `.svg`, and so on\) inside a directory. It has two commands:

- `scan` -- lists every image file it finds, along with the file size.
- `report` -- prints a summary report grouped by file extension, including total counts, sizes, and which file is the smallest and largest.

The tool is read-only. It doesn't modify, move, or delete anything. It just looks at what's there and tells you about it.

You can find the project inside the `docker-handbook-projects/imgtool/` directory. There are two sub-directories:

- `starter/` -- contains the working Python CLI but has no Dockerfile. This is where you'll follow along and write the Dockerfile yourself.
- `completed/` -- contains the final version with everything working. If you get stuck, you can always peek at this one.

## Running imgtool locally

Before containerizing anything, let's see how the tool works on its own. If you have Python 3.12 or later on your system, you can install it locally by navigating to the `starter/` directory and running:

```text
pip install .
```

Once installed, you'll have the `imgtool` command available in your terminal. The `starter/` directory includes a `fixtures/` folder with a couple of test files. The generic syntax for the `scan` command is as follows:

```text
imgtool scan <directory-path>
```

And for the `report` command:

```text
imgtool report <directory-path>
```

If you point `scan` at the `fixtures/` directory, you should see something like this:

```text
imgtool scan ./fixtures

# Image files in ./fixtures
#
#   ./fixtures/square.svg  (368.0 B)
#
# 1 image(s) found.
```

The `report` command gives you a more detailed breakdown:

```text
imgtool report ./fixtures

# Image report for ./fixtures
# ==================================================
#
# Extension       Count    Total Size
# ------------    --------  --------------
# .svg                  1       368.0 B
#
# Total images : 1
# Total size   : 368.0 B
# Smallest     : ./fixtures/square.svg (368.0 B)
# Largest      : ./fixtures/square.svg (368.0 B)
```

As you can see, the tool found the `.svg` file in the fixtures directory and reported on it. The `notes.txt` file was ignored because `.txt` is not a recognized image extension.

Now the question is -- how do you package this up so that anyone can use it without installing Python, `pip`, or any of the dependencies? That's where the Dockerfile comes in.

## The Dockerfile with exec-form ENTRYPOINT

Create a new file called `Dockerfile` inside the `starter/` directory. The content of the file is as follows:

```text
FROM python:3.12-alpine
WORKDIR /app
COPY pyproject.toml .
COPY imgtool/ imgtool/
RUN pip install --no-cache-dir .
ENTRYPOINT ["imgtool"]
CMD ["report", "/workspace"]
```

You've seen most of these instructions before, but there are two that deserve a closer look: `ENTRYPOINT` and `CMD` used together.

The `ENTRYPOINT` instruction sets the main executable for the container. When you write `ENTRYPOINT ["imgtool"]`, you're telling Docker that every time this container starts, it should run the `imgtool` program. The square bracket syntax is called **exec form** -- it passes the command directly to the process without going through a shell. This is important for utility containers because it means arguments from `docker run` get passed cleanly to your program.

The `CMD` instruction provides **default arguments** to the entrypoint. In this case, `CMD ["report", "/workspace"]` means that if you run the container without specifying any arguments, it will execute `imgtool report /workspace` by default.

Here's the key distinction: when a user passes their own arguments to `docker run`, those arguments **replace** the `CMD` entirely, but the `ENTRYPOINT` stays. So if you run:

```text
docker run imgtool scan /workspace
```

Docker ignores the `CMD` and the container executes `imgtool scan /workspace` instead. The `ENTRYPOINT` \(`imgtool`\) remains unchanged -- only the default arguments from `CMD` get overridden.

I would suggest thinking of it this way: `ENTRYPOINT` is the program, `CMD` is the default arguments. Together they give you a container that behaves like a regular command-line tool.

Explanation for the rest of the Dockerfile is as follows:

- `FROM python:3.12-alpine` -- uses the lightweight Alpine-based Python 3.12 image as the base.
- `WORKDIR /app` -- sets the working directory inside the container to `/app`.
- `COPY pyproject.toml .` -- copies the project metadata file into the container.
- `COPY imgtool/ imgtool/` -- copies the Python package source code.
- `RUN pip install --no-cache-dir .` -- installs the package inside the container. The `--no-cache-dir` flag keeps the image small by not storing pip's download cache.

## Building and running as a container

With the Dockerfile in place, you can build the image. Navigate to the `starter/` directory and execute the following command:

```text
docker image build -t imgtool .

# [+] Building 12.3s (10/10) FINISHED
# ### LONG BUILD OUTPUT GOES HERE ###
# => exporting to image
# => => naming to docker.io/library/imgtool
```

The `-t imgtool` flag tags the image with the name `imgtool`. Now let's run it. Since this is a utility container that inspects files on your host machine, you need a bind mount to give it access to a directory. Let's point it at the `fixtures/` folder:

```text
docker container run --rm -v "$PWD/fixtures":/workspace imgtool

# Image report for /workspace
# ==================================================
#
# Extension       Count    Total Size
# ------------    --------  --------------
# .svg                  1       368.0 B
#
# Total images : 1
# Total size   : 368.0 B
# Smallest     : /workspace/square.svg (368.0 B)
# Largest      : /workspace/square.svg (368.0 B)
```

Notice that you didn't pass any arguments after the image name. Since you didn't override the `CMD`, the container ran with the defaults: `report /workspace`. The bind mount mapped your local `fixtures/` directory to `/workspace` inside the container, and the report command found the image files there.

Now try overriding the default by passing `scan /workspace` explicitly:

```text
docker container run --rm -v "$PWD/fixtures":/workspace imgtool scan /workspace

# Image files in /workspace
#
#   /workspace/square.svg  (368.0 B)
#
# 1 image(s) found.
```

This time you passed `scan /workspace` after the image name, which replaced the default `CMD` of `report /workspace`. The `ENTRYPOINT` remained `imgtool`, so the full command inside the container became `imgtool scan /workspace`.

You can point the bind mount at any directory on your host machine. If you have a folder full of photos somewhere, try mounting that instead:

```text
docker container run --rm -v "$HOME/Pictures":/workspace imgtool report /workspace
```

The `--rm` flag ensures the container is removed automatically after it exits. Since utility containers are meant to run once and disappear, I usually always include `--rm` when running them.

## How arguments flow through ENTRYPOINT

Let's take a step back and make sure the argument flow is clear, because this is the core mechanic that makes utility containers work.

When you execute:

```text
docker container run --rm -v "$PWD/fixtures":/workspace imgtool scan /workspace
```

Here is what happens step by step:

1. Docker sees that the image `imgtool` has `ENTRYPOINT ["imgtool"]`.
2. Everything after the image name in your `docker run` command \(`scan /workspace`\) becomes the arguments.
3. Docker combines the entrypoint with the arguments: `imgtool scan /workspace`.
4. The container starts and runs that command.

If you had not passed any arguments:

```text
docker container run --rm -v "$PWD/fixtures":/workspace imgtool
```

Then Docker would have fallen back to the `CMD` instruction and combined it with the entrypoint: `imgtool report /workspace`.

This is different from images that use only `CMD` without `ENTRYPOINT`. In those cases, whatever the user passes after the image name replaces the entire command, not just the arguments. With `ENTRYPOINT`, the base program is locked in -- users can only control what arguments it receives.

Keep in mind that there is also a shell form of `ENTRYPOINT` \(written without the square brackets\), but I would suggest always using exec form for utility containers. Shell form wraps your command in `sh -c`, which means signals don't propagate correctly and argument passing becomes unreliable.

## The starter and completed pattern

As I mentioned earlier, the `imgtool` project follows a pattern you'll see throughout this handbook. The `starter/` directory gives you the working application code but leaves the Dockerfile for you to write. The `completed/` directory has the fully working version.

I would suggest trying to write the Dockerfile from scratch using what you've learned in this section. If you get stuck or something doesn't work, compare your file with the completed version. The act of writing it yourself, making mistakes, and fixing them is far more valuable than copying a working file.

The `starter/` directory contains:

- `pyproject.toml` -- the Python project configuration that tells pip how to install the package.
- `imgtool/` -- the Python package with the CLI code in `cli.py`.
- `fixtures/` -- a small set of test files for verifying that everything works.

All you need to add is the `Dockerfile`.

## Cleaning up

Once you're done experimenting, you can remove the image to free up space:

```text
docker image rm imgtool

# Untagged: imgtool:latest
# Deleted: sha256:...
```

If you installed `imgtool` locally with pip earlier, you can uninstall it as well:

```text
pip uninstall imgtool
```

Now that you've a feel for how utility containers work and how `ENTRYPOINT` turns a Docker image into something that behaves like a regular command-line tool, you're ready to take on a bigger challenge. In the next chapter, you'll build your first Docker image from scratch for a real application, where the concepts of `ENTRYPOINT`, `CMD`, and everything else you've learned so far will come together.
