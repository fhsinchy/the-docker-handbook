# Running LLM Workloads with Docker

Now that you've shipped a full-stack application with multiple services, networks, and volumes, let's turn to a different kind of workload that's become increasingly common -- running large language model \(LLM\) and AI services inside Docker containers.

This chapter isn't going to teach you machine learning. What it will teach you is how the Docker patterns you already know -- images, volumes, environment variables, health checks -- apply just as well to AI workloads. The challenges are different \(massive model files, GPU access, long startup times\), but the solutions are built from the same building blocks.

## Why Docker for LLM Workloads

If you've ever tried setting up an ML environment on a bare machine, you know the pain. Python version conflicts, CUDA driver mismatches, pip packages that refuse to coexist -- it's a mess. Every team member ends up with a slightly different setup, and "it works on my machine" becomes the default state of affairs.

Docker solves this in the same way it solves every other dependency problem: by packaging the runtime, the dependencies, and the configuration into a single, reproducible image. But for LLM workloads specifically, there are a few additional reasons Docker shines:

- **Reproducibility.** The exact Python version, the exact library versions, the exact system dependencies -- all locked into the image. If it runs on your laptop, it'll run in CI, on a colleague's machine, and in production.
- **Dependency isolation.** ML projects tend to have heavy, conflicting dependency trees. One project needs PyTorch 2.0, another needs 1.13, and both need different versions of NumPy. Containers keep these isolated without resorting to virtual environments or conda.
- **Model file management.** LLM model files are often gigabytes in size. You don't want to bake them into the image -- that would make your image enormous and your builds painfully slow. Instead, you mount them as volumes. The image stays lean, and the model files live on the host where they can be shared across containers.

## The Project

The project you'll work with lives in `docker-handbook-projects/llm-runtime-demo/`. Navigate to the `completed` directory to see the finished version.

It's a simple Python Flask service that wraps model inference behind an HTTP API. The service has two modes of operation:

- **Smoke mode** -- the default. The service starts up and responds to requests with a canned response. No model files are loaded, no heavy dependencies are needed. This mode exists purely for testing that the container builds and runs correctly.
- **Full mode** -- the service expects a model to be available at a given path. In a real deployment, this is where you'd load a model and run actual inference. For this demo, it simulates that behavior.

The idea behind this two-mode approach is practical. In a CI pipeline, you want to validate that your container builds, starts, and responds to health checks -- without downloading a 7 GB model file every time. Smoke mode gives you that.

## The Application Code

The `main.py` file is straightforward:

```text
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

LLM_MODE = os.environ.get("LLM_MODE", "smoke")
LLM_MODEL_PATH = os.environ.get("LLM_MODEL_PATH", "/models")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "mode": LLM_MODE})


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(force=True)
    prompt = data.get("prompt", "")

    if LLM_MODE == "smoke":
        response_text = "This is a smoke test response."
    else:
        response_text = (
            f"[full mode] Received prompt: '{prompt}'. "
            "In a real deployment, a model loaded from "
            f"'{LLM_MODEL_PATH}' would generate a response here."
        )

    return jsonify({"response": response_text})


if __name__ == "__main__":
    print(f"Starting LLM runtime demo in '{LLM_MODE}' mode")
    print(f"Model path: {LLM_MODEL_PATH}")
    app.run(host="0.0.0.0", port=8080)
```

Two endpoints: `/health` for checking if the service is alive, and `/generate` for sending prompts. The behavior of `/generate` changes depending on which mode the service is running in.

The two environment variables that control everything are:

- `LLM_MODE` -- set to `smoke` or `full`. Defaults to `smoke`.
- `LLM_MODEL_PATH` -- the path inside the container where model files are expected. Defaults to `/models`.

The `requirements.txt` file contains a single dependency:

```text
flask
```

In a real project, this is where you'd list things like `torch`, `transformers`, `accelerate`, and whatever else your model stack requires.

## The Dockerfile

Here's the Dockerfile for this project:

```text
FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV LLM_MODE=smoke
ENV LLM_MODEL_PATH=/models
RUN mkdir -p /models
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["python", "main.py"]
```

Let me walk through this line by line:

- `FROM python:3.12-alpine` -- starts from a lightweight Alpine-based Python image. For a smoke-mode service with just Flask, this keeps the image small. In a real ML project with PyTorch and CUDA, you'd swap this for something like `nvidia/cuda` or `pytorch/pytorch` as the base.
- `WORKDIR /app` -- sets the working directory inside the container.
- `COPY requirements.txt .` followed by `RUN pip install --no-cache-dir -r requirements.txt` -- installs dependencies before copying the rest of the code. As you've learned in earlier chapters, this ordering takes advantage of Docker's layer caching. Your dependencies only get reinstalled when `requirements.txt` changes, not every time you edit your Python code.
- `COPY . .` -- copies the application code into the container.
- `ENV LLM_MODE=smoke` and `ENV LLM_MODEL_PATH=/models` -- sets the default values for the two configuration variables. These can be overridden at runtime with the `-e` flag.
- `RUN mkdir -p /models` -- creates the model directory inside the image. Even in smoke mode, the directory should exist so that code referencing it doesn't fail.
- `EXPOSE 8080` -- documents that the service listens on port 8080.
- `HEALTHCHECK` -- tells Docker how to check if the container is healthy. Every 30 seconds, it hits the `/health` endpoint. If it doesn't get a response within 3 seconds, the container is marked unhealthy. This is especially useful for LLM containers that might take a long time to load a model on startup.
- `CMD ["python", "main.py"]` -- starts the Flask server.

## Building the Image

Build the image by executing the following command from the `completed` directory:

```text
docker image build --tag llm-runtime-demo .

# [+] Building 8.2s (10/10) FINISHED
#  => [1/5] FROM python:3.12-alpine
#  => [2/5] WORKDIR /app
#  => [3/5] COPY requirements.txt .
#  => [4/5] RUN pip install --no-cache-dir -r requirements.txt
#  => [5/5] COPY . .
#  => exporting to image
#  => => naming to docker.io/library/llm-runtime-demo
```

Nothing surprising here. The image builds quickly because the only dependency is Flask.

## Running in Smoke Mode

To run the container in smoke mode, execute the following command:

```text
docker container run \
    --rm \
    --detach \
    --name llm-smoke \
    --publish 8080:8080 \
    llm-runtime-demo

# a3b7c9d1e4f6...
```

Since `LLM_MODE` defaults to `smoke` in the Dockerfile, you don't need to pass it explicitly. The container starts, and you can verify it's working by hitting the health endpoint:

```text
curl http://localhost:8080/health

# {"mode":"smoke","status":"ok"}
```

Now try sending a prompt to the generate endpoint:

```text
curl -X POST http://localhost:8080/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Explain Docker volumes"}'

# {"response":"This is a smoke test response."}
```

As you can see, the service is alive and responding, but it's not doing any real inference. It just returns a canned response. That's the whole point of smoke mode -- you've validated that the container builds, starts, passes its health check, and responds to HTTP requests. All without needing a model file.

Stop the container before moving on:

```text
docker container stop llm-smoke
```

## Running with a Model Volume

In full mode, the service expects model files to be available at the path specified by `LLM_MODEL_PATH`. Instead of baking model files into the image -- which would make it enormous -- you mount them from the host using a **volume**.

This is the same bind mount pattern you learned in the mounts chapter, but applied to a different problem. The generic approach for mounting models is as follows:

```text
docker container run \
    --rm \
    --detach \
    --name llm-full \
    --publish 8080:8080 \
    --volume ./models:/models \
    --env LLM_MODE=full \
    llm-runtime-demo

# b8c2d4e6f1a3...
```

The `--volume ./models:/models` flag mounts a local `models` directory into the container at `/models`. The `--env LLM_MODE=full` flag overrides the default smoke mode.

Keep in mind that the `./models` directory needs to exist on your host. For this demo, you can create an empty one -- the service won't actually load any model files, it just simulates the behavior. In a real deployment, this directory would contain your model weights, tokenizer files, and configuration.

Let's verify it's running in full mode:

```text
curl http://localhost:8080/health

# {"mode":"full","status":"ok"}
```

And send a prompt:

```text
curl -X POST http://localhost:8080/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Explain Docker volumes"}'

# {"response":"[full mode] Received prompt: 'Explain Docker volumes'. In a real deployment, a model loaded from '/models' would generate a response here."}
```

The response now reflects that the service is running in full mode and knows where to find the model files. In a production setup, this is where actual model inference would happen.

Stop the container when you're done:

```text
docker container stop llm-full
```

## Why This Pattern Matters for CI

The two-mode approach is not just a convenience for local development. It's a pattern that makes your LLM containers **CI-friendly**.

A typical CI pipeline for an LLM service might look like this:

1. Build the Docker image.
2. Run the container in smoke mode.
3. Hit the health check endpoint to verify the container starts correctly.
4. Run a few integration tests against the API.
5. Push the image to a registry.

None of these steps require downloading or loading a multi-gigabyte model. The smoke mode lets you test the full container lifecycle -- build, start, health check, respond to requests -- in seconds rather than minutes. The actual model loading and inference testing can happen in a separate stage, on a machine with the right hardware and the model files already cached.

This separation of concerns is a Docker pattern worth remembering. Keep your image lean, mount the heavy stuff at runtime, and provide a lightweight mode for validation. It applies far beyond LLM workloads -- anywhere you have large data files, trained models, or hardware-specific dependencies, this same approach works.

## Wrapping Up

This was a short chapter by design. The Docker concepts here -- environment variables, volume mounts, health checks, lean images -- are all things you've seen before. What's new is the context they're applied in. AI workloads have unique characteristics \(huge model files, long startup times, GPU dependencies\), but Docker handles them with the same building blocks you've been using throughout this book.

In the next chapter, you'll learn about publishing your images and some production-minded practices that will help you ship with confidence.
