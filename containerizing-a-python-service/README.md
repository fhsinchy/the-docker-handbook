# Containerizing a Python Service

Now that you've containerized a Go service using multi-stage builds in the previous chapter, it's time for you to work with another popular language. In this chapter, you'll containerize a Python HTTP service built with Flask. Unlike Go, Python is an interpreted language, so there's no compiled binary to extract. You still need the Python runtime in the final image. But that doesn't mean you can't optimize things. You'll learn about dependency caching, non-root users, and how to structure a Dockerfile that doesn't rebuild your entire dependency tree every time you change a line of application code.

## The Project

The project lives inside the `docker-handbook-projects/notes-api-python/` directory. It's a Flask HTTP service with a few simple endpoints:

- `GET /` -- returns a health check response.
- `GET /notes` -- returns all stored notes as JSON.
- `POST /notes` -- accepts a JSON body and creates a new note.

Just like the Go project, all data is stored in memory. No database, no persistence. Restart the container and the notes are gone.

The project structure is straightforward. There's a `main.py` file that contains the application code and a `requirements.txt` file that lists the Python dependencies. In this case, the only dependency is Flask.

## The Naive Dockerfile

Let's start with a Dockerfile that works but isn't particularly well thought out. Create a file named `Dockerfile` inside the `notes-api-python` directory with the following content:

```text
FROM python:3.12-alpine
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["python", "main.py"]
```

This is about as simple as it gets. You copy everything into the image, install the dependencies, and run the application. Let's build it and see what happens:

```text
docker image build -t notes-api-python:naive .

# [+] Building 8.2s (8/8) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/python:3.12-alpine
#  => [1/3] FROM docker.io/library/python:3.12-alpine
#  => [2/3] WORKDIR /app
#  => [3/3] COPY . .
#  => [4/4] RUN pip install -r requirements.txt
#  => exporting to image
```

It builds and it works. So what's the problem?

Well, the issue becomes apparent when you start making changes to your application code. Every time you modify `main.py` and rebuild the image, Docker has to reinstall all the dependencies from scratch. That's because the `COPY . .` instruction copies *everything* in one go, and any change to any file in the project invalidates that layer's cache. Since the `pip install` step comes after the copy, it also gets invalidated.

For a project with just Flask, this might take a few seconds. But for a real-world Python project with dozens of dependencies, you could be waiting minutes on every rebuild while pip downloads and installs packages that haven't changed at all.

## Dependency Caching

The fix is a pattern you've already seen with Node.js and its `package.json`. You copy the dependency file first, install the dependencies, and *then* copy the rest of the source code. This way, as long as `requirements.txt` hasn't changed, Docker reuses the cached layer with all the installed packages.

Here's what the updated Dockerfile looks like:

```text
FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "main.py"]
```

The key difference is the order of operations:

- `COPY requirements.txt .` -- copies only the requirements file first.
- `RUN pip install --no-cache-dir -r requirements.txt` -- installs the dependencies. The `--no-cache-dir` flag tells pip not to store its download cache inside the image, which saves some space.
- `COPY . .` -- copies the rest of the application code.

Now when you change `main.py` and rebuild, Docker sees that `requirements.txt` hasn't changed, reuses the cached layer with the installed dependencies, and only needs to re-copy the source files. The rebuild goes from several seconds to nearly instant.

Let's verify this. Build the image:

```text
docker image build -t notes-api-python:cached .

# [+] Building 6.5s (9/9) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/python:3.12-alpine
#  => [1/4] FROM docker.io/library/python:3.12-alpine
#  => [2/4] WORKDIR /app
#  => [3/4] COPY requirements.txt .
#  => [4/4] RUN pip install --no-cache-dir -r requirements.txt
#  => [5/5] COPY . .
#  => exporting to image
```

Now rebuild it without changing anything:

```text
docker image build -t notes-api-python:cached .

# [+] Building 0.3s (9/9) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/python:3.12-alpine
#  => CACHED [1/4] FROM docker.io/library/python:3.12-alpine
#  => CACHED [2/4] WORKDIR /app
#  => CACHED [3/4] COPY requirements.txt .
#  => CACHED [4/4] RUN pip install --no-cache-dir -r requirements.txt
#  => CACHED [5/5] COPY . .
#  => exporting to image
```

As you can see, every layer is cached and the build completes in under a second. If you were to change `main.py` and rebuild, only the `COPY . .` step would re-run. The `pip install` layer stays cached.

## Non-root User

You may have noticed in the Go chapter that I created a non-root user inside the container. The same practice applies here. By default, containers run as `root`, which is a security risk. If an attacker manages to break out of the application, they'd have root-level access inside the container. Running as a non-root user limits the blast radius.

Adding a non-root user in Alpine is done with the `adduser` command, the same as you saw in the Go chapter:

```text
RUN adduser -D -u 1001 appuser
```

The `-D` flag creates the user without a password prompt, and `-u 1001` assigns a specific user ID. Keep in mind that the `USER` instruction should come *after* any `RUN` commands that need root access \(like installing packages\) but *before* the `CMD` instruction.

## The Production-ready Dockerfile

Putting everything together -- dependency caching, non-root user, and the `--no-cache-dir` flag -- you get a clean, production-ready Dockerfile. Replace the content of your `Dockerfile` with the following:

```text
FROM python:3.12-alpine
RUN adduser -D -u 1001 appuser
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
USER appuser
EXPOSE 8080
CMD ["python", "main.py"]
```

Let me walk through the complete flow:

- `FROM python:3.12-alpine` -- uses the official Python image based on Alpine. Unlike the Go chapter, you can't do a multi-stage build that throws away the runtime, because Python needs the interpreter to run your code. The Alpine variant keeps the base image relatively small \(around 50MB\).
- `RUN adduser -D -u 1001 appuser` -- creates the non-root user early on, while you're still running as root.
- `WORKDIR /app` -- sets the working directory.
- `COPY requirements.txt .` -- copies the dependency file first for caching.
- `RUN pip install --no-cache-dir -r requirements.txt` -- installs dependencies without storing pip's cache.
- `COPY . .` -- copies the rest of the source code.
- `USER appuser` -- switches to the non-root user. Everything after this line, including the `CMD`, runs as `appuser`.
- `EXPOSE 8080` -- documents the port.
- `CMD ["python", "main.py"]` -- starts the Flask application.

Build the final image:

```text
docker image build -t notes-api-python .

# [+] Building 6.8s (10/10) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/python:3.12-alpine
#  => [1/5] FROM docker.io/library/python:3.12-alpine
#  => [2/5] RUN adduser -D -u 1001 appuser
#  => [3/5] WORKDIR /app
#  => [4/5] COPY requirements.txt .
#  => [5/5] RUN pip install --no-cache-dir -r requirements.txt
#  => [6/6] COPY . .
#  => exporting to image
```

Let's check the image size:

```text
docker image ls notes-api-python

# REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
# notes-api-python    latest    b2c3d4e5f6a7   5 seconds ago    65MB
# notes-api-python    cached    c3d4e5f6a7b8   2 minutes ago    65MB
# notes-api-python    naive     d4e5f6a7b8c9   4 minutes ago    65MB
```

The sizes are nearly identical across all three versions because you're using the same base image and the same dependencies. The difference isn't in image size here -- it's in build speed. The dependency caching approach makes rebuilds dramatically faster during development, and the non-root user adds a layer of security for production.

## Building, Running, and Verifying

Now let's run the container and make sure everything works. To run the container, execute the following command:

```text
docker container run \
    --rm \
    --detach \
    --publish 8080:8080 \
    --name notes-api-python \
    notes-api-python

# e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5
```

Let's verify the health endpoint:

```text
curl http://localhost:8080/

# {"status":"ok"}
```

Now create a note:

```text
curl -X POST http://localhost:8080/notes \
    -H "Content-Type: application/json" \
    -d '{"title":"Python in Docker","body":"Dependency caching saves time"}'

# {"id":1,"title":"Python in Docker","body":"Dependency caching saves time"}
```

And retrieve all notes:

```text
curl http://localhost:8080/notes

# [{"id":1,"title":"Python in Docker","body":"Dependency caching saves time"}]
```

Everything is working. Let's also check the container logs to make sure Flask started up properly:

```text
docker container logs notes-api-python

#  * Serving Flask app 'main'
#  * Running on all addresses (0.0.0.0)
#  * Running on http://127.0.0.1:8080
#  * Running on http://172.17.0.2:8080
```

As you can see, Flask is running and listening on port 8080. You can also verify that the container is running as the non-root user:

```text
docker container exec notes-api-python whoami

# appuser
```

The container is running as `appuser`, not `root`. That's exactly what you want.

## Cleanup

Before you move on, stop the running container:

```text
docker container stop notes-api-python

# notes-api-python
```

The `--rm` flag takes care of removing it automatically.

In this chapter you've containerized a Python Flask service with a Dockerfile that caches dependencies properly and runs as a non-root user. The patterns here -- copy the dependency manifest first, install dependencies, then copy the source code -- apply to virtually every interpreted language. The same trick works with Ruby, PHP, or any other language that uses a package manager. In the next chapter, you'll bring multiple services together into a full-stack application using Docker Compose.
