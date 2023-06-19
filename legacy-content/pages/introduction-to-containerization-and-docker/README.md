# Introduction to Containerization and Docker

Containerization is the process of encapsulating software code along with all of its dependencies inside a single package so that it can be run consistently anywhere.

Docker is an open source containerization platform. It provides the ability to run applications in an isolated environment known as a container.

Containers are like very lightweight virtual machines that can run directly on our host operating system's kernel without the need of a [hypervisor](https://www.redhat.com/en/topics/virtualization/what-is-a-hypervisor). As a result we can run multiple containers simultaneously.

![](../.gitbook/assets/simultaneously-running-containers.svg)

Each container contains an application along with all of its dependencies and is isolated from the other ones. Developers can exchange these containers as image\(s\) through a registry and can also deploy directly on servers.

