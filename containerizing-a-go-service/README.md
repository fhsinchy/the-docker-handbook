# Containerizing a Go Service

Now that you've containerized a Node.js API with a Postgres database in the previous chapter, it's time for you to apply similar concepts to a different language. In this chapter, you'll containerize a small Go HTTP service. The interesting part here is that Go compiles to a single static binary, which means the final container doesn't need the Go toolchain at all. This makes Go a perfect candidate for **multi-stage builds**, and by the end of this chapter, you'll see just how small a Go container can be.

Don't worry though, you don't need to be a Go developer to follow along. The application code is minimal and I'll explain everything you need to know.

## The Project

The project lives inside the `docker-handbook-projects/notes-api-go/` directory. It's a compact HTTP service built using nothing but Go's standard library \(`net/http`\). No frameworks, no external dependencies. The service exposes a few endpoints:

- `GET /` -- returns a simple health check response.
- `GET /notes` -- returns all stored notes as JSON.
- `POST /notes` -- accepts a JSON body and creates a new note.

All data is stored in memory, so there is no database to worry about. Every time you restart the container, the notes start fresh. This keeps things simple and lets you focus entirely on the Docker side of things.

If you open the project directory, you'll find a `main.go` file containing all the application code. There is also a `go.mod` file which declares the module name. Since the project uses only the standard library, there is no `go.sum` file and no external dependencies to download.

## The Starter Dockerfile

Let's start with a straightforward Dockerfile. This is the kind of Dockerfile you might write if you just wanted to get things running without thinking too much about optimization. Create a file named `Dockerfile` inside the `notes-api-go` directory with the following content:

```text
FROM golang:1.22-alpine
WORKDIR /app
COPY go.mod ./
COPY *.go ./
RUN go build -o server .
EXPOSE 8080
CMD ["./server"]
```

Explanation for this code is as follows:

- `FROM golang:1.22-alpine` -- uses the official Go image based on Alpine Linux as the base.
- `WORKDIR /app` -- sets the working directory inside the container.
- `COPY go.mod ./` -- copies the module file first.
- `COPY *.go ./` -- copies all Go source files.
- `RUN go build -o server .` -- compiles the application into a binary named `server`.
- `EXPOSE 8080` -- documents that the service listens on port 8080.
- `CMD ["./server"]` -- runs the compiled binary when the container starts.

Let's build and check the image size. To build the image, execute the following command from inside the project directory:

```text
docker image build -t notes-api-go:starter .

# [+] Building 12.4s (9/9) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/golang:1.22-alpine
#  => [1/4] FROM docker.io/library/golang:1.22-alpine
#  => [2/4] WORKDIR /app
#  => [3/4] COPY go.mod ./
#  => [4/4] COPY *.go ./
#  => [5/5] RUN go build -o server .
#  => exporting to image
```

Now check how big the image is:

```text
docker image ls notes-api-go:starter

# REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
# notes-api-go   starter   a1b2c3d4e5f6   10 seconds ago   270MB
```

270 megabytes for a tiny HTTP service that compiles to a binary of a few megabytes. That's quite wasteful.

## Why the Image Is So Big

The `golang:1.22-alpine` image weighs in at around 250MB on its own. It includes the entire Go toolchain -- the compiler, the linker, standard library sources, and all the supporting tools. You need all of that to *build* the application, but once the binary is compiled, none of it is needed at runtime.

This is a problem you didn't have with Node.js because Node needs its runtime to execute JavaScript. Go is different. A Go binary is self-contained. It doesn't need anything from the Go image to run. Hence, shipping the entire Go toolchain alongside a 5MB binary is like shipping the entire lumber mill along with a wooden chair.

This is exactly the kind of situation where multi-stage builds shine.

## Multi-stage Build

As I've already explained in earlier chapters, a **multi-stage build** lets you use one image for building and a different \(much smaller\) image for running the application. You compile the binary in a "build" stage using the full Go image, then copy just the binary into a minimal Alpine image for the final stage.

Replace the content of your `Dockerfile` with the following:

```text
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod ./
COPY *.go ./
RUN CGO_ENABLED=0 go build -o server .

FROM alpine:3.19
RUN adduser -D -u 1001 appuser
WORKDIR /app
COPY --from=build /app/server .
USER appuser
EXPOSE 8080
CMD ["./server"]
```

Let me walk you through what's happening here:

- `FROM golang:1.22-alpine AS build` -- this starts the first stage and names it `build`. The name is important because you'll reference it later.
- `RUN CGO_ENABLED=0 go build -o server .` -- compiles the binary with CGO disabled. The `CGO_ENABLED=0` flag ensures the binary is fully statically linked with no dependency on C libraries. This is important because the final Alpine image might not have the same C libraries available.
- `FROM alpine:3.19` -- this starts the second stage using a bare Alpine Linux image, which is only about 7MB.
- `RUN adduser -D -u 1001 appuser` -- creates a non-root user. Running containers as root is a bad habit, even inside a container. The `-D` flag means no password and no home directory setup, and `-u 1001` assigns a specific user ID.
- `COPY --from=build /app/server .` -- this is the key line. It copies the compiled binary from the `build` stage into the current stage. Everything else from the build stage -- the Go toolchain, the source code, the intermediate files -- gets thrown away.
- `USER appuser` -- switches to the non-root user for all subsequent commands and for the running container.

Now build this version:

```text
docker image build -t notes-api-go:multi .

# [+] Building 11.8s (13/13) FINISHED
#  => [internal] load build definition from Dockerfile
#  => [internal] load .dockerignore
#  => [internal] load metadata for docker.io/library/golang:1.22-alpine
#  => [internal] load metadata for docker.io/library/alpine:3.19
#  => [build 1/4] FROM docker.io/library/golang:1.22-alpine
#  => [stage-1 1/3] FROM docker.io/library/alpine:3.19
#  => [build 2/4] WORKDIR /app
#  => [build 3/4] COPY go.mod ./
#  => [build 4/4] COPY *.go ./
#  => [build 5/5] RUN CGO_ENABLED=0 go build -o server .
#  => [stage-1 2/3] RUN adduser -D -u 1001 appuser
#  => [stage-1 3/3] COPY --from=build /app/server .
#  => exporting to image
```

As you can see, Docker runs the two stages in parallel where possible. The `build` stage and `stage-1` base image pull happen at the same time.

## Image Size Comparison

Now let's compare the two images side by side:

```text
docker image ls notes-api-go

# REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
# notes-api-go   multi     f6e5d4c3b2a1   5 seconds ago    15MB
# notes-api-go   starter   a1b2c3d4e5f6   3 minutes ago    270MB
```

From 270MB down to 15MB. That's a reduction of over 94%. The final image contains nothing but Alpine Linux and your compiled Go binary. No Go toolchain, no source code, no build artifacts.

This is one of the biggest advantages of working with compiled languages like Go in Docker. You get to enjoy tiny, fast, secure images with very little effort.

## Adding a Healthcheck

Docker has a built-in mechanism for checking whether a container is healthy. The `HEALTHCHECK` instruction in a Dockerfile tells Docker how to test the container to see if it's still working. If the health check fails repeatedly, Docker marks the container as `unhealthy`, and orchestration tools like Docker Compose or Kubernetes can take action based on that.

Update your `Dockerfile` to include a health check:

```text
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod ./
COPY *.go ./
RUN CGO_ENABLED=0 go build -o server .

FROM alpine:3.19
RUN adduser -D -u 1001 appuser
WORKDIR /app
COPY --from=build /app/server .
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/ || exit 1
CMD ["./server"]
```

The `HEALTHCHECK` instruction options are as follows:

- `--interval=30s` -- run the check every 30 seconds.
- `--timeout=3s` -- if the check doesn't complete within 3 seconds, consider it failed.
- `--start-period=5s` -- give the container 5 seconds to start up before counting failures.
- `--retries=3` -- mark the container as unhealthy after 3 consecutive failures.
- `CMD wget -qO- http://localhost:8080/ || exit 1` -- the actual check. It uses `wget` \(available in Alpine\) to hit the health endpoint. If the request fails, `exit 1` tells Docker the check failed.

Keep in mind that Alpine doesn't include `curl` by default, which is why I'm using `wget` here. You could install `curl` if you prefer, but `wget` is already there and does the job just fine.

Rebuild the image with the health check included:

```text
docker image build -t notes-api-go .

# [+] Building 0.8s (13/13) FINISHED
# ### BUILD OUTPUT ###
```

## Building, Running, and Verifying

Now let's run the container and verify that everything works. To run the container, execute the following command:

```text
docker container run \
    --rm \
    --detach \
    --publish 8080:8080 \
    --name notes-api-go \
    notes-api-go

# a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4
```

The container is now running in detached mode with port 8080 on your host mapped to port 8080 inside the container. Let's verify it's working by hitting the health endpoint:

```text
curl http://localhost:8080/

# {"status":"ok"}
```

The service is up. Now let's create a note:

```text
curl -X POST http://localhost:8080/notes \
    -H "Content-Type: application/json" \
    -d '{"title":"Docker is great","body":"Multi-stage builds are awesome"}'

# {"id":1,"title":"Docker is great","body":"Multi-stage builds are awesome"}
```

And retrieve all notes:

```text
curl http://localhost:8080/notes

# [{"id":1,"title":"Docker is great","body":"Multi-stage builds are awesome"}]
```

Everything is working as expected. Let's also check the health status of the container. Give it about 30 seconds for the first health check to run, then inspect the container:

```text
docker container inspect --format '{{.State.Health.Status}}' notes-api-go

# healthy
```

The container is marked as `healthy`. If you want to see the log of health check results, you can inspect the full health object:

```text
docker container inspect --format '{{json .State.Health}}' notes-api-go

# {"Status":"healthy","FailingStreak":0,"Log":[{"Start":"2026-03-20T10:45:30Z","End":"2026-03-20T10:45:30Z","ExitCode":0,"Output":"..."}]}
```

Evident by the output, the health check is passing with an exit code of `0` and zero consecutive failures.

## Cleanup

Before you move on to the next chapter, stop and remove the running container:

```text
docker container stop notes-api-go

# notes-api-go
```

Since you used the `--rm` flag, the container is automatically removed when it stops.

In this chapter you've taken a simple Go HTTP service and containerized it using a multi-stage build. You went from a 270MB image to a 15MB image by separating the build environment from the runtime environment. You also added a health check so Docker can monitor whether the service is actually responding. In the next chapter, you'll do something similar with a Python service, where the dynamics are a bit different since Python is an interpreted language.
