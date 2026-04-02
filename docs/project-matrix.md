# Docker Handbook Project Matrix

| Order | Chapter file | Chapter title | Primary project | Variant | Supporting projects | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Intro | `README.md` | The Docker Handbook |  |  |  | Landing page |
| 1 | `introduction-to-containerization-and-docker.md` | Introduction to modern containerization and Docker |  |  |  | Conceptual |
| 2 | `installing-docker/README.md` | Installing Docker and verifying a current setup |  |  |  | Setup only |
| 3 | `hello-world-in-docker/README.md` | Running your first containers | `hello-dock/starter/` | `both` |  | First hands-on |
| 4 | `container-lifecycle-and-debugging/README.md` | Understanding container lifecycle, logs, exec, and cleanup |  |  |  | Uses hello-world and misc images |
| 5 | `working-with-mounts-and-host-files/README.md` | Working with bind mounts, volumes, and host files | `hello-dock/starter/` | `both` |  | Bind mounts and volumes |
| 6 | `utility-containers-with-imgtool/README.md` | Utility containers with imgtool | `imgtool/starter/` | `both` |  | Exec-form ENTRYPOINT |
| 7 | `building-your-first-docker-image/README.md` | Building your first Docker image | `hello-dock/starter/` | `both` |  | First Dockerfile |
| 8 | `writing-better-dockerfiles/README.md` | Writing better Dockerfiles with caching and .dockerignore | `hello-dock/completed/` | `completed` |  | Layer caching |
| 9 | `advanced-image-patterns/README.md` | Multi-stage builds, non-root users, and smaller images | `hello-dock/completed/` | `completed` | `notes-api-node/completed/` | Multi-stage |
| 10 | `container-networking-fundamentals/README.md` | Container networking fundamentals |  |  |  | Bridge networks |
| 11 | `compose-v2-and-multi-service-development/README.md` | Compose v2 and multi-service development | `notes-api-node/completed/` | `both` |  | Compose basics |
| 12 | `containerizing-a-modern-frontend-application/README.md` | Containerizing a modern frontend application | `hello-dock/completed/` | `both` |  | Production frontend |
| 13 | `containerizing-a-nodejs-api-with-postgres/README.md` | Containerizing a Node.js API with Postgres | `notes-api-node/starter/` | `both` |  | Node + DB |
| 14 | `containerizing-a-go-service/README.md` | Containerizing a Go service | `notes-api-go/starter/` | `both` |  | Go containerization |
| 15 | `containerizing-a-python-service/README.md` | Containerizing a Python service | `notes-api-python/starter/` | `both` |  | Python containerization |
| 16 | `shipping-a-fullstack-notes-application/README.md` | Shipping a full-stack notes application | `fullstack-notes-application/starter/` | `both` |  | Flagship project |
| 17 | `running-llm-workloads-with-docker/README.md` | Running LLM workloads with Docker | `llm-runtime-demo/starter/` | `both` |  | LLM runtime |
| 18 | `publishing-images-and-production-practices/README.md` | Publishing images and basic production-minded practices |  |  |  | Registry and best practices |
| 19 | `conclusion.md` | Conclusion and next steps toward the sequel |  |  |  | Wrap-up |
