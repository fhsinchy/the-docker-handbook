# Images and Containers

Images are multi-layered self-contained files that act as the template for creating Docker containers. Images can be exchanged through registries. We can use any image built by others or can also modify them by adding new instructions.

Images can be created from [scratch](https://hub.docker.com/_/scratch) as well. The base layer of an image is read-only. When we edit a Dockerfile and rebuild it, only the modified part is rebuilt in the top layer.

Containers are images in running state. When we pull an image like hello-world and run them, they create an isolated environment suitable for running the program included in the image. This isolated environment is a container.

