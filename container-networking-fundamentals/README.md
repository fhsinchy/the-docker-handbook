# Container networking fundamentals

Now that you've learned how to write efficient Dockerfiles with multi-stage builds, run as non-root users, and produce smaller images, it's time to tackle a new kind of challenge. So far in this book, you've only worked with single container setups. But in real life, most projects involve more than one container. And when you have multiple containers that need to talk to each other, things get interesting.

Let's consider a real life scenario here. Imagine you have a `notes-api` application powered by [Express.js](https://expressjs.com/) and a [PostgreSQL](https://www.postgresql.org/) database server. The API runs in one container, and the database runs in another. These two containers are completely isolated from each other and are oblivious about each other's existence.

So how do you connect the two? You might think of a couple of approaches right away:

- Accessing the database server using an exposed port.
- Accessing the database server using its IP address and default port.

Both of these seem reasonable. Let's walk through each one and see what happens.

## Wrong approach 1: connecting through an exposed port

Let's say you've started the `postgres` container and exposed port `5432` to the host. Now from inside the `notes-api` container, you try to connect to `127.0.0.1:5432` expecting to reach the database.

It doesn't work. The `notes-api` container can't find the database server at all.

The reason is that when you say `127.0.0.1` inside the `notes-api` container, you're referring to the `localhost` of that container and that container only. The `postgres` server simply doesn't exist there. Exposed ports are accessible from the host machine, not from inside other containers. Hence the connection fails.

## Wrong approach 2: connecting through an IP address

The second approach you might think of is finding the exact IP address of the `postgres` container using the `container inspect` command and using that with the port. Assuming the name of the `postgres` container is `notes-api-db-server`, you can get the IP address by executing the following command:

```text
docker container inspect \
    --format='{{range .NetworkSettings.Networks}} {{.IPAddress}} {{end}}' \
    notes-api-db-server

#  172.17.0.2
```

Now given the default port for `postgres` is `5432`, you could connect to `172.17.0.2:5432` from the `notes-api` container and it would actually work.

But there are problems with this approach as well. Using IP addresses to refer to a container is not recommended. If the container gets destroyed and recreated, the IP address may change. Keeping track of these changing IP addresses can be a painful task, especially when you have multiple containers in play.

## The correct answer: user-defined bridge networks

Now that I've dismissed the possible wrong answers to the original question, the correct answer is — **you connect them by putting them under a user-defined bridge network**.

A **user-defined bridge network** is a virtual network you create yourself in Docker. When two or more containers are attached to the same user-defined bridge, they can communicate with each other using container names instead of IP addresses. Docker handles the DNS resolution behind the scenes.

This is a big deal. It means your `notes-api` container can connect to the database by simply using the container name \(say `notes-db`\) as the hostname. No hardcoded IPs, no fragile workarounds. If the database container gets recreated, as long as it has the same name and is on the same network, the API container will find it.

Before you start creating your own networks though, let's take a look at what Docker already provides out of the box.

## Network basics

A network in Docker is another logical object like a container or an image. Just like those two, there is a bunch of commands under the `docker network` group for manipulating networks. To list out the networks in your system, execute the following command:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

You should see three networks in your system. Now look at the `DRIVER` column of the table here. These drivers can be treated as the type of network. By default, Docker has five networking drivers. They are as follows:

- `bridge` — The default networking driver in Docker. This can be used when multiple containers are running in standard mode and need to communicate with each other.
- `host` — Removes the network isolation completely. Any container running under a `host` network is basically attached to the network of the host system.
- `none` — This driver disables networking for containers altogether. I haven't found any use-case for this yet.
- `overlay` — This is used for connecting multiple Docker daemons across computers and is out of the scope of this book.
- `macvlan` — Allows assignment of MAC addresses to containers, making them function like physical devices in a network.

There are also third-party plugins that allow you to integrate Docker with specialized network stacks. Out of the five mentioned above, you'll only work with the `bridge` networking driver in this book.

Every container you run without specifying a network gets automatically attached to the default `bridge` network. You can verify this by running a container and inspecting the network:

```text
docker container run \
    --rm \
    --detach \
    --name hello-dock \
    --publish 8080:80 \
    fhsinchy/hello-dock

# a37f723dad3ae793ce40f97eb6bb236761baa92d72a2c27c24fc7fda0756657d

docker network inspect \
    --format='{{range .Containers}}{{.Name}}{{end}}' bridge

# hello-dock
```

As you can see, the `hello-dock` container is attached to the default `bridge` network even though you didn't ask for it. Containers attached to the default bridge network can communicate with each other using IP addresses, which I have already discouraged in the previous sub-sections.

A user-defined bridge however has some extra features over the default one. According to the official [docs](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge) on this topic, some notable extras are as follows:

- **User-defined bridges provide automatic DNS resolution between containers.** This means containers attached to the same network can communicate with each other using the container name. So if you have two containers named `notes-api` and `notes-db`, the API container will be able to connect to the database container using the `notes-db` name.
- **User-defined bridges provide better isolation.** All containers are attached to the default bridge network by default which can cause conflicts among them. Attaching containers to a user-defined bridge can ensure better isolation.
- **Containers can be attached and detached from user-defined networks on the fly.** During a container's lifetime, you can connect or disconnect it from user-defined networks without stopping the container. To remove a container from the default bridge network, you need to stop the container and recreate it with different network options.

Now that you've learned quite a lot about user-defined networks, it's time to create one for yourself.

## Creating a user-defined bridge

A network can be created using the `network create` command. The generic syntax for the command is as follows:

```text
docker network create <network name>
```

To create a network with the name `skynet`, execute the following command:

```text
docker network create skynet

# 7bd5f351aa892ac6ec15fed8619fc3bbb95a7dcdd58980c28304627c8f7eb070
```

You can verify that the network was created by listing all networks again:

```text
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# be0cab667c4b   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
# 7bd5f351aa89   skynet    bridge    local
```

As you can see, a new network has been created with the given name. The driver is `bridge` by default. No container is currently attached to this network. In the next sub-section, you'll learn about attaching containers to a network.

## Attaching containers to a network

There are mostly two ways of attaching a container to a network. The first is the `network connect` command, which lets you attach an already running container to a network. The generic syntax for the command is as follows:

```text
docker network connect <network identifier> <container identifier>
```

To connect the `hello-dock` container \(which should still be running from the previous sub-section\) to the `skynet` network, you can execute the following command:

```text
docker network connect skynet hello-dock
```

The command doesn't yield any output, but you can verify that it worked by inspecting both networks:

```text
docker network inspect \
    --format='{{range .Containers}} {{.Name}} {{end}}' skynet

#  hello-dock

docker network inspect \
    --format='{{range .Containers}} {{.Name}} {{end}}' bridge

#  hello-dock
```

As you can see from the outputs of the two `network inspect` commands, the `hello-dock` container is now attached to both the `skynet` and the default `bridge` network. A container can belong to multiple networks at the same time.

The second way of attaching a container to a network is by using the `--network` option for the `container run` or `container create` commands. The generic syntax for the option is as follows:

```text
--network <network identifier>
```

To demonstrate DNS resolution in action, let's run an `alpine` container attached to the `skynet` network in interactive mode:

```text
docker container run \
    --network skynet \
    --rm \
    --name alpine-box \
    --interactive \
    --tty \
    alpine sh

# lands you into the alpine linux shell

/ # ping hello-dock

# PING hello-dock (172.18.0.2): 56 data bytes
# 64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.191 ms
# 64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.103 ms
# 64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.139 ms
# 64 bytes from 172.18.0.2: seq=3 ttl=64 time=0.142 ms
# 64 bytes from 172.18.0.2: seq=4 ttl=64 time=0.146 ms
# 64 bytes from 172.18.0.2: seq=5 ttl=64 time=0.095 ms
# 64 bytes from 172.18.0.2: seq=6 ttl=64 time=0.181 ms
# 64 bytes from 172.18.0.2: seq=7 ttl=64 time=0.138 ms
#
# --- hello-dock ping statistics ---
# 8 packets transmitted, 8 packets received, 0% packet loss
# round-trip min/avg/max = 0.095/0.142/0.191 ms
```

As you can see, running `ping hello-dock` from inside the `alpine-box` container works because both of the containers are under the same user-defined bridge network and automatic DNS resolution is working. Docker resolved the name `hello-dock` to the correct IP address behind the scenes.

Keep in mind though, in order for the automatic DNS resolution to work you must assign custom names to the containers. Using the randomly generated names will not work.

Exit out of the `alpine-box` container by typing `exit` or pressing `ctrl + d`. The container will be removed automatically because of the `--rm` flag.

## Detaching containers from a network

You've learned about attaching containers to a network. Now let's learn about how to detach them. The `network disconnect` command can be used for this task. The generic syntax for the command is as follows:

```text
docker network disconnect <network identifier> <container identifier>
```

To detach the `hello-dock` container from the `skynet` network, you can execute the following command:

```text
docker network disconnect skynet hello-dock
```

Just like the `network connect` command, the `network disconnect` command doesn't give any output either. You can verify the detachment by inspecting the `skynet` network:

```text
docker network inspect \
    --format='{{range .Containers}} {{.Name}} {{end}}' skynet

#
```

As you can see, the output is empty now, meaning no containers are attached to `skynet` anymore. The `hello-dock` container is still running and still attached to the default `bridge` network.

## Removing networks

Just like the other logical objects in Docker, networks can be removed using the `network rm` command. The generic syntax for the command is as follows:

```text
docker network rm <network identifier>
```

To remove the `skynet` network from your system, you can execute the following command:

```text
docker network rm skynet

# skynet
```

You can also use the `network prune` command to remove all unused networks from your system in one go:

```text
docker network prune

# WARNING! This will remove all custom networks not used by at least one container.
# Are you sure you want to continue? [y/N] y
```

The command also supports the `-f` or `--force` option to skip the confirmation prompt.

Before moving on to the next chapter, let's clean up. Stop the `hello-dock` container if it's still running:

```text
docker container stop hello-dock
```

Now that you've a solid understanding of how container networking works in Docker, you're ready to put it all together. In the next chapter, you'll learn about Docker Compose and how it makes working with multi-container setups far less tedious.
