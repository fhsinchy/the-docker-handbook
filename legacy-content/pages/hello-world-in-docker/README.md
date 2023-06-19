# Hello World in Docker

Now that we have Docker ready to go on our machines, it's time for us to run our first container. Open up terminal \(command prompt in windows\) and run the following command:

```text
docker run hello-world
```

If everything goes fine you should see some output like the following:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-10.12.27-PM.png)

The [hello-world](https://hub.docker.com/_/hello-world) image is an example of minimal containerization with Docker. It has a single [hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c) file responsible for printing out the message you're seeing on your terminal.

Almost every image contains a default command. In case of the hello-world image, the default command is to execute the _hello_ binary compiled from the previously mentioned C code.

If you open up the dashboard again, you should find the hello-world container there:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-03-at-1.35.49-AM.png)

The status is `EXITED(0)` which indicates that the container has run and exited successfully. You can view the _Logs_, _Stats \(CPU/memory/disk/network usage\)_ or _Inspect \(environment/port mappings\)_.

To understand what just happened, you need to get familiar with the Docker Architecture, Images and Containers, and Registries.

