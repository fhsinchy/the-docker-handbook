# Demonstration of Container Isolation

From the moment that I introduced you to the concept of a container, I've been saying that containers are isolated environments. When I say isolated, I not only mean from the host system but also from other containers.

In this section, we'll do a little experiment to understand this isolation stuff. Open up two terminal windows and execute and run two Ubuntu container instances using the following command:

```text
docker run -it ubuntu
```

If you open up the dashboard you should see two Ubuntu containers running:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-4.13.30-PM.png)

Now on the upper window, execute following command:

```text
mkdir hello-world
```

The `mkdir` command creates a new directory. Now to see the list of directories in both containers execute the `ls` command inside both of them:

![](https://www.freecodecamp.org/news/content/images/2020/07/Screenshot-2020-07-05-at-4.19.36-PM.png)

As you can see, the `hello-world` directory exists inside the container open on the upper terminal window and not on the lower one. It goes to prove that the containers although created from the same image are isolated from each other.

This is something important to understand. Assume a scenario where you've been working inside a container for a while. Then you `stop` the container and on the next day you execute `docker run -it ubuntu` once again. You'll see all your works have been lost.

I hope you remember from a previous sub-section, the `run` command creates and starts a new container every time. So remember to start previously created containers using the `start` command and not the `run` command.

