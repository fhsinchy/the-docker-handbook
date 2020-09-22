# Docker Architecture

Docker uses a client-server architecture. The engine consists of three major components:

1. **Docker Daemon:** The daemon \(`dockerd`\) is a process that keeps running in the background and waits for commands from the client. The daemon is capable of managing various Docker objects.
2. **Docker Client:** The client  \(`docker`\) is a command-line interface program mostly responsible for transporting commands issued by users.
3. **REST API:** The REST API acts as a bridge between the daemon and the client. Any command issued using the client passes through the API to finally reach the daemon.

There is a nice graphical representation of the architecture on Docker's official documentation:

![https://docs.docker.com/get-started/overview/\#docker-architecture](https://www.freecodecamp.org/news/content/images/2020/07/architecture-1.svg)

Don't worry if it looks confusing at the moment. Everything will become much clearer in the upcoming sub-sections.

