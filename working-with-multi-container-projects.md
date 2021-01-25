# Working With Multi-Container Projects

So far in this article, you've only worked with single container projects. But in real life, majority of the projects that you'll have to work with will have at least more than one container and to be honest, working with a bunch of containers can be a little difficult if you don't understand the nuances of container isolation. So in this section of the article you'll get familiar with basic networking with Docker and will work hands on with a small multi-container project.

Well you've already learned in the previous section that containers are isolated environments. Now consider a scenario where you have a `notes-api` application powered by [Express.js](https://expressjs.com/) and a [PostgreSQL](https://www.postgresql.org/) database server running in two separate containers.

These two containers are completely isolated from each other and oblivious about each other's existence. **So how do you connect the two? Ain't that a challenge?**

You may think of two possible solution to this problem. They are as follows:

* Accessing the database server using an exposed port.
* Accessing the database server using it's IP address and default port.

The first one is exposing a port from the `postgres` container and the `notes-api` will connect through that. Assuming that the exposed port from the `postgres` container is 5432. Now if you try to connect to `127.0.0.1:5432` from inside the `notes-api` container, you'll find that the `notes-api` can't find the database server at all.

The reason is that when you're saying `127.0.0.1` inside the `notes-api` container, you're simply referring to the `localhost` of that container and that container only. The `postgres` server simply doesn't exist there. As a result the `notes-api` application failed to connect.

The second solution you may think is finding the exact IP address of the `postgres` container using `container inspect` command and use that with the port. Assuming the name of the `postgres` container is `notes-api-db-server` you can easily get the IP address by executing the following command:

```text
docker container inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' notes-api-db-server

# 172.17.0.2
```

Now given the default port for `postgres` is `5432`, you can very easily access the database server by connecting to `172.17.0.2:5432` from the `notes-api` container.

There are problems in this approach as well. Using IP addresses to refer to a container is not recommended. Also if the container gets destroyed and recreated, the IP address may change. Keeping track of these changing IP addresses can be pretty hectic.

Now that I've dismissed the possible wrong answers to the original question, the correct answer is, **you connect them by putting them under the same network.**

## **Network Basics**

Network in Docker is another logical object like container and image. Just like the other two, there is a plethora of commands under the `docker network` group for manipulating networks. To list out the networks in your system, execute the following command:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

You should see three networks in your system. Now look at the `DRIVER` column of the table here. These drivers are can be treated as the type of network. By default Docker has five networking drivers. They are as follows:

* `bridge` - The default networking driver in Docker. This can e used when multiple containers are running in standard mode and needs to communicate with each other.
* `host` - Removes the network isolation completely. Any container running under a `host` network is basically attached to the network of the host system.
* `none` - This driver disables networking for containers altogether. I haven't' found any use-case for this yet.
* `overlay` - This is used for connecting multiple Docker daemons across computers and is out of the scope of this article.
* `macvlan` - Allows assignment of MAC addresses to containers making them function like physical devices in a network.

There are also third-party plugins that allow you to integrate Docker with specialized network stacks. Out of the five mentioned above, you'll only work with `bridge` networking driver in this article.

## Creating a User-Defined Bridge

Before you start creating your own bridge, I would like to take some time to discuss the default bridge network that comes with Docker. Let's begin by listing all the networks on your system:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

As you can see, Docker comes with a default bridge network named `bridge`. Any container you run will be automatically attached to this bridge network:

```text
docker container run --rm --detach --name hello-dock --publish 8080:80 fhsinchy/hello-dock
# a37f723dad3ae793ce40f97eb6bb236761baa92d72a2c27c24fc7fda0756657d

docker network inspect --format='{{range .Containers}}{{.Name}}{{end}}' bridge
# hello-dock
```

