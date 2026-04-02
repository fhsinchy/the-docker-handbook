# Publishing Images and Basic Production-minded Practices

Now that you've seen how Docker can handle LLM workloads, it's time to shift gears. Throughout this book, you've been building images, running containers, and composing multi-service applications entirely on your own machine. But what happens when you want to share your work with someone else? Or deploy it somewhere beyond your laptop?

In this chapter, you'll learn how to publish your images to an online registry so anyone \(or just your team\) can pull and use them. After that, I'll walk you through a practical checklist of things you should keep in mind before taking your containers anywhere near a production environment.

## Sharing Images Online

The most common place to share Docker images is **Docker Hub**. You've already been pulling images from it throughout this book -- every time you ran something like `docker image pull postgres` or `docker container run nginx`, you were grabbing images from Docker Hub.

Docker Hub is a free, public registry hosted by Docker, Inc. Think of it as GitHub but for container images. You can store your images there, and other people can pull them. There are also private repositories if you don't want the whole world accessing your stuff.

To get started, you'll need an account. Head over to [https://hub.docker.com/](https://hub.docker.com/) and sign up. Pick a username you're comfortable with because it becomes part of your image naming convention going forward.

Once you have an account, you need to log in from your terminal. To do that, execute the following command:

```text
docker login

# Log in with your Docker ID or email address to push and pull images from Docker Hub.
# If you don't have a Docker ID, head over to https://hub.docker.com/ to create one.
# You can log in with your password or a Personal Access Token (PAT).
# Using a PAT is recommended for increased security.
#
# Username: fhsinchy
# Password:
# Login Succeeded
```

It'll ask for your username and password. Once it says "Login Succeeded" you're good to go. Keep in mind that the credentials are stored locally, so you only need to do this once per machine unless you explicitly log out with `docker logout`.

## Tagging for Publishing

Before you can push an image to Docker Hub, it has to follow a specific naming convention. The format is `username/repository:tag`. For example, if your Docker Hub username is `fhsinchy` and you have a local image called `notes-api:latest`, you can't just push it as is. You need to retag it first.

The generic syntax for tagging an image is as follows:

```text
docker image tag <local-image>:<tag> <username>/<repository>:<tag>
```

So if I wanted to tag my local `notes-api:latest` image for publishing, I'd execute the following command:

```text
docker image tag notes-api:latest fhsinchy/notes-api:1.0
```

This doesn't create a new image. It creates a new tag that points to the same image layers. You can verify this by listing your images:

```text
docker image ls

# REPOSITORY           TAG       IMAGE ID       CREATED        SIZE
# notes-api            latest    a1b2c3d4e5f6   2 hours ago    150MB
# fhsinchy/notes-api   1.0       a1b2c3d4e5f6   2 hours ago    150MB
```

As you can see, both entries share the same `IMAGE ID`. They're the same image with two different names.

A few things to keep in mind about tagging:

- The `username` part must match your Docker Hub username exactly.
- The `repository` name can be anything you want, but it usually matches the project name.
- The `tag` is optional. If you leave it off, Docker defaults to `latest`. But I'd suggest you always use explicit tags -- I'll explain why in the production checklist later in this chapter.

## Pushing Images

Once your image is properly tagged, pushing it to Docker Hub is straightforward. The generic syntax is as follows:

```text
docker image push <username>/<repository>:<tag>
```

To push the image I tagged in the previous section, I'd execute:

```text
docker image push fhsinchy/notes-api:1.0

# The push refers to repository [docker.io/fhsinchy/notes-api]
# 5f70bf18a086: Pushed
# a3ed95e8b4d1: Pushed
# d7c02b826f9e: Pushed
# 82ae8d409f28: Mounted from library/node
# 1.0: digest: sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 size: 1368
```

Docker pushes each layer individually. If some layers already exist on the registry \(like base image layers from `node` or `alpine`\), Docker is smart enough to skip those and only push the layers that are new. Hence the "Mounted from library/node" line in the output -- it means that layer already existed and didn't need to be uploaded again.

Once the push is complete, you can visit `https://hub.docker.com/r/fhsinchy/notes-api` and see your image sitting there. Anyone can now pull it.

## Pulling Images

You've been pulling images implicitly throughout this book every time you ran a container from an image that didn't exist locally. But you can also pull images explicitly using the `docker image pull` command.

The generic syntax is as follows:

```text
docker image pull <username>/<repository>:<tag>
```

So if someone else wanted to use my `notes-api` image, they'd execute:

```text
docker image pull fhsinchy/notes-api:1.0

# 1.0: Pulling from fhsinchy/notes-api
# a3ed95e8b4d1: Already exists
# d7c02b826f9e: Pull complete
# 5f70bf18a086: Pull complete
# Digest: sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
# Status: Downloaded newer image for fhsinchy/notes-api:1.0
```

Again, Docker only downloads the layers it doesn't already have locally. If you've pulled `node:20-alpine` before and the `notes-api` image is built on top of it, those base layers will already be cached on your machine.

If you omit the tag, Docker pulls the `latest` tag by default. But as I said -- relying on `latest` is a habit worth breaking.

## Private Registries

Docker Hub is convenient, but it's not the only option. If you need to keep your images private or want more control, there are several alternatives:

- **GitHub Container Registry** \(`ghcr.io`\) -- if you're already using GitHub for your source code, this is a natural fit. You push images with `docker image push ghcr.io/username/repo:tag` and authenticate using a personal access token.
- **Amazon Elastic Container Registry** \(ECR\), **Google Artifact Registry**, and **Azure Container Registry** -- these are the managed registry offerings from the big cloud providers. They integrate tightly with their respective cloud platforms.
- **Self-hosted registries** -- Docker provides an official `registry` image that you can run on your own server. It's literally `docker container run -d -p 5000:5000 registry` and you have your own private registry. This is useful for air-gapped environments or organizations that want full control.

The workflow is identical regardless of which registry you use. You log in, tag your image with the registry's prefix, and push. The commands stay the same -- only the image name prefix changes.

## A Production Checklist

Throughout this book, the focus has been on learning Docker concepts and developing locally. Production is a different beast. I'm not going to turn this into a full production guide -- that could be a book on its own -- but here's a practical checklist of things you should address before deploying containers to any environment that real users depend on.

### Use Specific Image Tags

Never use `:latest` in production. I can't stress this enough. The `latest` tag is mutable -- it points to whatever was pushed most recently. If you deploy with `image: myapp:latest` today, and someone pushes a new version tomorrow, the next time that container restarts it might pull a completely different image.

Instead, use explicit version tags:

```text
# Don't do this in production
image: fhsinchy/notes-api:latest

# Do this instead
image: fhsinchy/notes-api:1.0.3
```

This gives you reproducibility. You know exactly what's running, and you can roll back to a specific version if something breaks.

### Use Multi-stage Builds

If you've been following along since the earlier chapters, you already know about multi-stage builds. In production, they matter even more. A smaller image means faster pulls, faster deployments, and a smaller attack surface. There is no reason to ship compilers, build tools, and development dependencies into a production image.

### Run as a Non-root User

By default, containers run as `root`. That's fine for local development, but in production it's a real risk. If an attacker breaks out of the container, they land on the host as root. Always create a dedicated user in your Dockerfile and switch to it:

```text
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

You've seen this pattern in the earlier chapters on writing better Dockerfiles. Use it.

### Maintain a .dockerignore File

Your `.dockerignore` file keeps unnecessary files out of the build context. In production images, you don't want `node_modules`, `.git` directories, local `.env` files, test suites, or documentation ending up inside your image. A good `.dockerignore` reduces build time and keeps the image lean.

### Add Health Checks

A health check tells Docker \(and any orchestrator sitting on top of it\) whether your application is actually working, not just whether the process is running. You can add one directly in your Dockerfile:

```text
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
```

Or in your Compose file:

```text
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 5s
  retries: 3
```

Without a health check, Docker only knows if the process crashed. It has no idea if your app is stuck in an infinite loop or returning 500 errors on every request.

### Don't Store Secrets in Images or Compose Files

This one catches people more often than you'd think. Never bake passwords, API keys, or tokens into your Dockerfile or hardcode them in your `compose.yaml`. They end up in the image layers and anyone who pulls the image can extract them.

Use `.env` files for local development \(and make sure they're in your `.dockerignore` and `.gitignore`\). For production, use your platform's secret management solution -- Docker Swarm has built-in secrets, Kubernetes has secrets and config maps, and every major cloud provider has a secrets manager.

### Use Named Volumes for Persistent Data

If your application stores data that needs to survive container restarts -- databases, uploaded files, anything stateful -- use named volumes. You've worked with these throughout the book. Anonymous volumes and bind mounts are fine for development, but named volumes give you predictable, manageable storage that Docker tracks for you.

### Log to stdout and stderr

Your containerized application should write its logs to `stdout` and `stderr`, not to files inside the container. When you log to standard output, Docker captures it automatically and you can access it with `docker container logs`. Orchestrators and log aggregation tools \(like the ELK stack or Grafana Loki\) expect this pattern.

If your app writes logs to `/var/log/app.log` inside the container, those logs disappear when the container is removed. They're also invisible to `docker container logs`. Hence, always log to standard output.

## What Compose is NOT For

I want to be very clear about something. Docker Compose is a fantastic tool for local development. You've seen how it lets you define multi-service applications, spin them up with a single command, and tear them down just as easily. For development workflows, it's hard to beat.

But Compose is not a production orchestration tool. Using Compose on a production environment is not recommended at all.

Here's why. Compose runs everything on a single host. It doesn't handle:

- Distributing containers across multiple machines.
- Automatically restarting failed containers on a different node.
- Rolling updates with zero downtime.
- Load balancing across replicas.
- Scaling services up and down based on demand.

For production orchestration, you need tools built for that purpose. The two most common ones are:

- **Kubernetes** -- the industry standard for container orchestration. It's powerful, flexible, and has a huge ecosystem. It's also complex, so there's a real learning curve. But if you're running containers in production at any meaningful scale, you'll encounter Kubernetes sooner or later.
- **Docker Swarm** -- Docker's own orchestration solution built right into the Docker Engine. It's simpler than Kubernetes and uses the same Compose file format you're already familiar with. For smaller deployments or teams that want something straightforward, Swarm is a legitimate option.

There are other options too -- Nomad by HashiCorp, Amazon ECS, Google Cloud Run -- but the point is the same. Compose gets you through development. Production needs something more.

The good news is that everything you've learned in this book -- images, containers, volumes, networks, Compose files -- translates directly into these production tools. Kubernetes uses container images. Swarm uses Compose files. The fundamentals don't change. You're already better prepared than you think.
