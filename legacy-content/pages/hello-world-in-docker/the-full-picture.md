# The Full Picture

Now that you're familiar with the architecture, images, containers, and registries, you're ready to understand what happened when we executed the `docker run hello-world` command. A graphical representation of the process is as follows:

![](https://www.freecodecamp.org/news/content/images/2020/07/docker-run-hello-world.svg)

The entire process happens in five steps:

1. We execute the `docker run hello-world` command.
2. Docker client tells the daemon that we want to run a container using the hello-world image.
3. Docker daemon pulls the latest version of the image from the registry.
4. Creates a container from the image.
5. Runs the newly created container.

It's the default behavior of Docker daemon to look for images in the hub, that are not present locally. But once an image has been fetched, it'll stay in the local cache. So if you execute the command again, you won't see the following lines in the output:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete
Digest: sha256:d58e752213a51785838f9eed2b7a498ffa1cb3aa7f946dda11af39286c3db9a9
Status: Downloaded newer image for hello-world:latest
```

If there is a newer version of the image available, the daemon will fetch the image again. That `:latest` is a tag. Images usually have meaningful tags to indicate versions or builds. You'll learn about this in more detail in a later section.

