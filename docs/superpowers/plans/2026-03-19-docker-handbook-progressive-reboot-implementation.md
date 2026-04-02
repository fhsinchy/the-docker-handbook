# Docker Handbook Progressive Reboot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reboot `the-docker-handbook` and `docker-handbook-projects` into a modern, maintainable Docker learning system with an updated handbook, a single-branch companion repo, starter/completed project layouts, refreshed flagship examples, and validation that keeps docs and code aligned.

**Architecture:** The work is split across two repos with a strict contract: `the-docker-handbook` owns narrative, chapter sequence, and the chapter-to-project matrix; `docker-handbook-projects` owns runnable source artifacts. The implementation proceeds in dependency order: freeze information architecture, migrate the projects repo to the new single-branch structure, rebuild core examples, rewrite handbook chapters against those examples, then add CI gates that enforce the contract.

**Tech Stack:** Honkit, Markdown, Node.js, React + Vite + TypeScript, Node.js API, Go service, Python service, Docker, Docker Compose v2, NGINX, Postgres, GitHub Actions

---

## File Structure

### Repository Roots

- Handbook repo root: `/home/farhan/Project/personal/the-docker-handbook-workspace/the-docker-handbook`
- Projects repo root: `/home/farhan/Project/personal/the-docker-handbook-workspace/docker-handbook-projects`

### Handbook files to create or modify

- Keep as intro: `the-docker-handbook/README.md`
- Keep: `the-docker-handbook/introduction-to-containerization-and-docker.md`
- Keep and rewrite: `the-docker-handbook/installing-docker/README.md`
- Keep and rewrite: `the-docker-handbook/hello-world-in-docker/README.md`
- Create: `the-docker-handbook/container-lifecycle-and-debugging/README.md`
- Create: `the-docker-handbook/working-with-mounts-and-host-files/README.md`
- Create: `the-docker-handbook/utility-containers-with-imgtool/README.md`
- Create: `the-docker-handbook/building-your-first-docker-image/README.md`
- Create: `the-docker-handbook/writing-better-dockerfiles/README.md`
- Create: `the-docker-handbook/advanced-image-patterns/README.md`
- Create: `the-docker-handbook/container-networking-fundamentals/README.md`
- Create: `the-docker-handbook/compose-v2-and-multi-service-development/README.md`
- Create: `the-docker-handbook/containerizing-a-modern-frontend-application/README.md`
- Create: `the-docker-handbook/containerizing-a-nodejs-api-with-postgres/README.md`
- Create: `the-docker-handbook/containerizing-a-go-service/README.md`
- Create: `the-docker-handbook/containerizing-a-python-service/README.md`
- Create: `the-docker-handbook/shipping-a-fullstack-notes-application/README.md`
- Create: `the-docker-handbook/running-llm-workloads-with-docker/README.md`
- Create: `the-docker-handbook/publishing-images-and-production-practices/README.md`
- Keep and rewrite: `the-docker-handbook/conclusion.md`
- Create: `the-docker-handbook/docs/project-matrix.md`
- Modify: `the-docker-handbook/SUMMARY.md`
- Retire after migration: `the-docker-handbook/container-manipulation-basics/README.md`
- Retire after migration: `the-docker-handbook/image-manipulation-basics/README.md`
- Retire after migration: `the-docker-handbook/network-manipulation-basics.md`
- Retire after migration: `the-docker-handbook/containerizing-a-javascript-application/README.md`
- Retire after migration: `the-docker-handbook/containerizing-a-multi-container-javascript-application/README.md`
- Retire after migration: `the-docker-handbook/composing-projects-using-docker-compose/README.md`
- Modify: `the-docker-handbook/package.json`
- Modify: `the-docker-handbook/book.json`
- Create CI files under `the-docker-handbook/.github/workflows/`

### Projects repo files to create or modify

- Modify: `docker-handbook-projects/README.md`
- Create per-project directories:
  - `docker-handbook-projects/hello-dock/`
  - `docker-handbook-projects/imgtool/`
  - `docker-handbook-projects/notes-api-node/`
  - `docker-handbook-projects/notes-api-go/`
  - `docker-handbook-projects/notes-api-python/`
  - `docker-handbook-projects/fullstack-notes-application/`
  - `docker-handbook-projects/llm-runtime-demo/`
- Create within each project:
  - `README.md`
  - `starter/README.md`
  - `completed/README.md`
  - `starter/.env.example` when applicable
  - `completed/.env.example` when applicable
- Replace or retire legacy directories that do not map to the new inventory
- Create CI files under `docker-handbook-projects/.github/workflows/`

### Verification files

- Create: `the-docker-handbook/scripts/validate-project-matrix.mjs`
- Create: `the-docker-handbook/scripts/validate-project-links.mjs`
- Create: `the-docker-handbook/scripts/validate-markdown-links.mjs`
- Create: `docker-handbook-projects/scripts/verify-projects.mjs`
- Create project-level package/test/build files as needed per stack

### Naming and migration rules

- `docker-handbook-projects/notes-api/` content migrates into `docker-handbook-projects/notes-api-node/`
- `docker-handbook-projects/rmbyext/` is retired and replaced by `docker-handbook-projects/imgtool/`
- `docker-handbook-projects/custom-nginx/` is retired; useful content is absorbed into handbook chapters and the flagship app
- `docker-handbook-projects/fullstack-notes-application/` remains the flagship project name

## Exact Chapter-to-File Map

Use this map exactly during implementation:

| Order | Title | File |
| --- | --- | --- |
| Intro | The Docker Handbook | `README.md` |
| 1 | Introduction to modern containerization and Docker | `introduction-to-containerization-and-docker.md` |
| 2 | Installing Docker and verifying a current setup | `installing-docker/README.md` |
| 3 | Running your first containers | `hello-world-in-docker/README.md` |
| 4 | Understanding container lifecycle, logs, exec, and cleanup | `container-lifecycle-and-debugging/README.md` |
| 5 | Working with bind mounts, volumes, and host files | `working-with-mounts-and-host-files/README.md` |
| 6 | Utility containers with imgtool | `utility-containers-with-imgtool/README.md` |
| 7 | Building your first Docker image | `building-your-first-docker-image/README.md` |
| 8 | Writing better Dockerfiles with caching and .dockerignore | `writing-better-dockerfiles/README.md` |
| 9 | Multi-stage builds, non-root users, and smaller images | `advanced-image-patterns/README.md` |
| 10 | Container networking fundamentals | `container-networking-fundamentals/README.md` |
| 11 | Compose v2 and multi-service development | `compose-v2-and-multi-service-development/README.md` |
| 12 | Containerizing a modern frontend application | `containerizing-a-modern-frontend-application/README.md` |
| 13 | Containerizing a Node.js API with Postgres | `containerizing-a-nodejs-api-with-postgres/README.md` |
| 14 | Containerizing a Go service | `containerizing-a-go-service/README.md` |
| 15 | Containerizing a Python service | `containerizing-a-python-service/README.md` |
| 16 | Shipping a full-stack notes application | `shipping-a-fullstack-notes-application/README.md` |
| 17 | Running LLM workloads with Docker | `running-llm-workloads-with-docker/README.md` |
| 18 | Publishing images and basic production-minded practices | `publishing-images-and-production-practices/README.md` |
| 19 | Conclusion and next steps toward the sequel | `conclusion.md` |

## Project Matrix Schema

`the-docker-handbook/docs/project-matrix.md` must use this exact schema:

| Order | Chapter file | Chapter title | Primary project | Variant | Supporting projects | Notes |
| --- | --- | --- | --- | --- | --- | --- |

Rules:

- `Chapter file` must match the exact file path from the chapter map above
- `Primary project` may be blank only for conceptual chapters that do not directly depend on a companion project
- if `Primary project` is present, it must be a repo-relative path such as `imgtool/starter/`
- `Variant` must be `starter`, `completed`, or `both` when `Primary project` is present; otherwise it may be blank
- `Supporting projects` may be blank but, if present, must use repo-relative project paths
- every row must resolve to a real handbook file and real companion-repo path

## Cross-Repo Location Contract

Handbook-side validation scripts must locate the projects repo using this rule:

- first use `DOCKER_HANDBOOK_PROJECTS_PATH` if set
- otherwise default to `../docker-handbook-projects` relative to `the-docker-handbook/`

CI must check out `docker-handbook-projects` into that default sibling path or explicitly set `DOCKER_HANDBOOK_PROJECTS_PATH`.

### Plan-wide conventions

- Prefer repo-relative paths inside docs and READMEs
- Use `docker compose`, never `docker-compose`
- Keep handbook examples sourced from real project files
- Tier-1 scope: handbook core, React frontend path, Node path, `imgtool`, flagship app, CI contract
- Tier-2 scope: Go and Python service chapters if schedule pressure appears

## Task 1: Freeze the handbook information architecture

**Files:**
- Modify: `the-docker-handbook/SUMMARY.md`
- Create: `the-docker-handbook/docs/project-matrix.md`
- Test: `the-docker-handbook/package.json`

- [ ] **Step 1: Write the failing structure check notes**

Create `the-docker-handbook/docs/project-matrix.md` with the exact approved schema and one temporary TODO row per chapter.

```md
# Docker Handbook Project Matrix

| Order | Chapter file | Chapter title | Primary project | Variant | Supporting projects | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 6 | `utility-containers-with-imgtool/README.md` | Utility containers with imgtool | `imgtool/completed/` | `both` |  | TODO |
```

- [ ] **Step 2: Run handbook build to capture the current baseline**

Run: `npm install && npm run build`
Expected: build succeeds or surfaces current handbook issues before structural edits

- [ ] **Step 3: Rewrite `SUMMARY.md` to match the approved chapter map**

Replace the old 10-chapter ordering with the exact approved reboot structure:

```md
# Summary

- [Introduction](README.md)
- [Introduction to modern containerization and Docker](introduction-to-containerization-and-docker.md)
- [Installing Docker and verifying a current setup](installing-docker/README.md)
- [Running your first containers](hello-world-in-docker/README.md)
- [Understanding container lifecycle, logs, exec, and cleanup](container-lifecycle-and-debugging/README.md)
- [Working with bind mounts, volumes, and host files](working-with-mounts-and-host-files/README.md)
- [Utility containers with imgtool](utility-containers-with-imgtool/README.md)
- [Building your first Docker image](building-your-first-docker-image/README.md)
- [Writing better Dockerfiles with caching and .dockerignore](writing-better-dockerfiles/README.md)
- [Multi-stage builds, non-root users, and smaller images](advanced-image-patterns/README.md)
- [Container networking fundamentals](container-networking-fundamentals/README.md)
- [Compose v2 and multi-service development](compose-v2-and-multi-service-development/README.md)
- [Containerizing a modern frontend application](containerizing-a-modern-frontend-application/README.md)
- [Containerizing a Node.js API with Postgres](containerizing-a-nodejs-api-with-postgres/README.md)
- [Containerizing a Go service](containerizing-a-go-service/README.md)
- [Containerizing a Python service](containerizing-a-python-service/README.md)
- [Shipping a full-stack notes application](shipping-a-fullstack-notes-application/README.md)
- [Running LLM workloads with Docker](running-llm-workloads-with-docker/README.md)
- [Publishing images and basic production-minded practices](publishing-images-and-production-practices/README.md)
- [Conclusion and next steps toward the sequel](conclusion.md)
```

- [ ] **Step 4: Add the initial chapter-to-project matrix**

Populate `the-docker-handbook/docs/project-matrix.md` with every approved chapter, chapter file, primary project path, and variant.

- [ ] **Step 5: Create placeholder chapter files for any new paths in `SUMMARY.md`**

For each new chapter path, create a minimal placeholder file so Honkit can build while the real content is still pending.

```md
# <Chapter Title>

This chapter is being rewritten as part of the handbook reboot.
```

- [ ] **Step 6: Run the handbook build after the information architecture changes**

Run: `npm run build`
Expected: Honkit builds successfully with the new chapter map, even if chapter content is still placeholder or partially rewritten

- [ ] **Step 7: Commit**

```bash
git add SUMMARY.md docs/project-matrix.md installing-docker hello-world-in-docker container-lifecycle-and-debugging working-with-mounts-and-host-files utility-containers-with-imgtool building-your-first-docker-image writing-better-dockerfiles advanced-image-patterns container-networking-fundamentals compose-v2-and-multi-service-development containerizing-a-modern-frontend-application containerizing-a-nodejs-api-with-postgres containerizing-a-go-service containerizing-a-python-service shipping-a-fullstack-notes-application running-llm-workloads-with-docker publishing-images-and-production-practices conclusion.md
git commit -m "docs: define handbook reboot structure"
```

## Task 2: Migrate the projects repo from branch-based to project-first layout

**Files:**
- Modify: `docker-handbook-projects/README.md`
- Create: top-level project directories listed above
- Create: project `README.md` files and `starter/` + `completed/` scaffolding
- Test: `docker-handbook-projects/.git` state and new directory layout

- [ ] **Step 1: Inventory current `master` and `completed` branch content**

Run:

```bash
git branch -a
git ls-tree --name-only origin/master
git ls-tree --name-only origin/completed
```

Expected: clear list of current starter-era and completed-era content for migration mapping

- [ ] **Step 2: Write a migration mapping note in the projects repo root README draft**

Add a section that explains the move away from `master` and `completed` branches.

```md
## Repository Layout

This repository now uses a single branch.
Each project contains its own `starter/` and `completed/` directories.
Older references to the `completed` branch now map to project-local `completed/` paths.
During migration, handbook docs may still reference the old branch model until the new paths exist and all references are updated.
```

- [ ] **Step 3: Create the target top-level project directories**

Create:

```text
hello-dock/
imgtool/
notes-api-node/
notes-api-go/
notes-api-python/
fullstack-notes-application/
llm-runtime-demo/
```

- [ ] **Step 4: Scaffold the canonical project template in each directory**

Create in each project:

```text
README.md
starter/README.md
completed/README.md
```

Each root project `README.md` must include: purpose, prerequisites, documented run commands, and the chapter(s) where the project appears in the handbook.

- [ ] **Step 5: Move or copy existing content into the new named destinations**

Examples:

```text
origin/master:notes-api/ -> notes-api-node/starter/
origin/completed:notes-api/ -> notes-api-node/completed/
origin/master:hello-dock/ -> hello-dock/starter/
origin/completed:hello-dock/ -> hello-dock/completed/
origin/master:fullstack-notes-application/ -> fullstack-notes-application/starter/
origin/completed:fullstack-notes-application/ -> fullstack-notes-application/completed/
```

Where a legacy project exists only in one branch or is incomplete, reconstruct the missing `starter/` or `completed/` state immediately during this task so no approved project enters later handbook migration without both variants accounted for.

- [ ] **Step 6: Keep legacy paths available during migration**

Do not delete or rename legacy top-level paths yet if handbook references still depend on them. Preserve compatibility until Task 12 migrates handbook references to the new project-local paths.

- [ ] **Step 7: Add explicit retirement notes for `rmbyext` and `custom-nginx`**

Document that:

- `rmbyext` is superseded by `imgtool`
- `custom-nginx` no longer exists as a standalone project

- [ ] **Step 8: Verify the staged migration repo tree**

Run: `ls`
Expected: the new approved project inventory exists at the top level; legacy paths may still remain temporarily for compatibility until handbook references are migrated

- [ ] **Step 9: Commit**

```bash
git add README.md hello-dock imgtool notes-api-node notes-api-go notes-api-python fullstack-notes-application llm-runtime-demo
git commit -m "refactor: adopt single-branch project layout"
```

## Task 3: Add cross-repo contract validation

**Files:**
- Create: `the-docker-handbook/scripts/validate-project-matrix.mjs`
- Create: `the-docker-handbook/scripts/validate-project-links.mjs`
- Modify: `the-docker-handbook/package.json`
- Create: `docker-handbook-projects/scripts/verify-projects.mjs`
- Test: both repos' package scripts and CI entry points

- [ ] **Step 1: Write the failing matrix validator test or script skeleton**

Create a Node script in `the-docker-handbook/scripts/validate-project-matrix.mjs` that reads `docs/project-matrix.md`, validates the exact column schema, checks that every `Chapter file` exists, checks that every non-blank `Primary project` and `Supporting projects` path exists in the companion repo, verifies that `Variant` is `starter`, `completed`, or `both` whenever a `Primary project` is present, and fails if any approved project from the final inventory lacks at least one matrix reference.

```js
import { readFileSync, existsSync } from 'node:fs'

const matrix = readFileSync(new URL('../docs/project-matrix.md', import.meta.url), 'utf8')
// resolve the projects repo from DOCKER_HANDBOOK_PROJECTS_PATH or ../docker-handbook-projects
// validate matrix schema, chapter files, project paths, and full project inventory coverage
```

- [ ] **Step 2: Run the validator before implementation**

Run: `node scripts/validate-project-matrix.mjs`
Expected: FAIL until the matrix and repo layout are complete

- [ ] **Step 3: Add chapter link validation for project paths**

Create `the-docker-handbook/scripts/validate-project-links.mjs` to scan chapter Markdown files for companion-repo project paths and fail when they do not resolve, and fail when a chapter listed in the matrix has no matching file or no corresponding `SUMMARY.md` entry.

- [ ] **Step 4: Add internal markdown link validation**

Create `the-docker-handbook/scripts/validate-markdown-links.mjs` to verify internal markdown links between handbook files resolve correctly.

- [ ] **Step 5: Add npm scripts in the handbook repo**

Update `the-docker-handbook/package.json` with:

```json
{
  "scripts": {
    "build": "honkit build",
    "validate:matrix": "node scripts/validate-project-matrix.mjs",
    "validate:links": "node scripts/validate-project-links.mjs",
    "validate:markdown": "node scripts/validate-markdown-links.mjs",
    "check": "npm run build && npm run validate:matrix && npm run validate:links && npm run validate:markdown"
  }
}
```

- [ ] **Step 6: Add a projects repo verifier**

Create `docker-handbook-projects/scripts/verify-projects.mjs` to assert each project has required files and that each root `README.md` contains the required sections for purpose, prerequisites, run commands, and handbook placement.

```js
const required = ['README.md', 'starter/README.md', 'completed/README.md']
```

- [ ] **Step 6: Run both validation entry points**

Run:

```bash
npm run check
node scripts/verify-projects.mjs
```

Expected: PASS once the matrix and project structure exist

- [ ] **Step 7: Commit**

```bash
git add scripts package.json docs/project-matrix.md
git commit -m "build: validate handbook project references"
```

## Task 4: Rebuild `hello-dock` as the modern small frontend example

**Files:**
- Create or replace: `docker-handbook-projects/hello-dock/starter/package.json`
- Create or replace: `docker-handbook-projects/hello-dock/starter/src/*`
- Create or replace: `docker-handbook-projects/hello-dock/starter/Dockerfile`
- Create or replace: `docker-handbook-projects/hello-dock/starter/Dockerfile.dev`
- Mirror final versions in `docker-handbook-projects/hello-dock/completed/`
- Test: project build commands and Docker build commands

- [ ] **Step 1: Write the failing minimal frontend build**

Create a minimal React + Vite + TypeScript starter app with one visible screen and no Docker support yet.

```json
{
  "name": "hello-dock",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build"
  }
}
```

- [ ] **Step 2: Run the app build to capture the non-Docker baseline**

Run: `npm install && npm run build`
Expected: PASS in `hello-dock/starter/`

- [ ] **Step 3: Write the first failing Docker build**

Add a simple `Dockerfile` that copies the app and builds it, but expect at least one failure until `.dockerignore` and serving strategy are correct.

- [ ] **Step 4: Implement minimal Docker support**

Add:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

- [ ] **Step 5: Add a dev-oriented Dockerfile and README instructions**

Document how the chapter uses `starter/` and how `completed/` differs.

- [ ] **Step 6: Verify both starter and completed states**

Run:

```bash
npm run build
docker build -t hello-dock-starter .
```

Expected: PASS for both project states, using their own directories

- [ ] **Step 7: Commit**

```bash
git add hello-dock
git commit -m "feat: rebuild hello-dock with modern React"
```

## Task 5: Replace `rmbyext` with `imgtool`

**Files:**
- Create: `docker-handbook-projects/imgtool/README.md`
- Create: `docker-handbook-projects/imgtool/starter/*`
- Create: `docker-handbook-projects/imgtool/completed/*`
- Modify later handbook chapters that reference `rmbyext`
- Test: local CLI run, Docker build, bind-mount workflow

- [ ] **Step 1: Write the failing CLI spec for `imgtool`**

Document the command shape in `docker-handbook-projects/imgtool/README.md`.

```text
imgtool scan /workspace
imgtool report /workspace
```

- [ ] **Step 2: Write a minimal failing test or smoke script**

Create a script that expects `imgtool report /workspace` to enumerate safe fixture files in a mounted directory.

- [ ] **Step 3: Implement the minimal local CLI app**

Use Python for a compact file-processing tool that is safe by default.

```python
def main() -> int:
    # parse command and inspect a target directory
    return 0
```

- [ ] **Step 4: Add exec-form `ENTRYPOINT` Docker support**

Create a Dockerfile like:

```dockerfile
FROM python:3.12-alpine
WORKDIR /app
COPY . .
RUN pip install .
ENTRYPOINT ["imgtool"]
CMD ["report", "/workspace"]
```

- [ ] **Step 5: Add starter and completed learning checkpoints**

- `starter/` should leave one or two Dockerfile details for the reader to finish
- `completed/` should include the final utility-container workflow

- [ ] **Step 6: Verify bind-mount execution**

Run:

```bash
docker build -t imgtool-completed .
docker run --rm -v "$PWD/fixtures":/workspace imgtool-completed report /workspace
```

Expected: PASS with a safe report against fixture files

- [ ] **Step 7: Commit**

```bash
git add imgtool
git commit -m "feat: add imgtool utility-container example"
```

## Task 6: Rebuild the Node API example as `notes-api-node`

**Files:**
- Create or move: `docker-handbook-projects/notes-api-node/starter/*`
- Create or move: `docker-handbook-projects/notes-api-node/completed/*`
- Test: app tests, Docker build, Compose run

- [ ] **Step 1: Copy the current Node API into its new named project**

Move legacy `notes-api` content into `notes-api-node/` as the starting migration base.

- [ ] **Step 2: Run the legacy tests to capture the baseline**

Run: `npm install && npm test`
Expected: current failures or deprecation warnings are documented before modernization

- [ ] **Step 3: Upgrade the runtime and dependency baseline**

Refresh Node, test tooling, Dockerfiles, and package manager usage.

- [ ] **Step 4: Replace old Docker Compose patterns with Compose v2-friendly files**

Create a modern `compose.yaml` and remove Makefile assumptions tied to deleted files.

- [ ] **Step 5: Add starter and completed checkpoints**

- `starter/` should support the chapter checkpoint for containerizing a Node API with a database
- `completed/` should include the full working setup

- [ ] **Step 6: Verify tests and container workflows**

Run:

```bash
npm test
docker build -t notes-api-node .
docker compose up --build -d
```

Expected: PASS or documented chapter-appropriate state in each variant

- [ ] **Step 7: Commit**

```bash
git add notes-api-node
git commit -m "feat: modernize node api example"
```

## Task 7: Rebuild the flagship `fullstack-notes-application`

**Files:**
- Create or replace: `docker-handbook-projects/fullstack-notes-application/starter/client/*`
- Create or replace: `docker-handbook-projects/fullstack-notes-application/starter/api/*`
- Create or replace: `docker-handbook-projects/fullstack-notes-application/starter/nginx/*`
- Create or replace: `docker-handbook-projects/fullstack-notes-application/starter/compose.yaml`
- Mirror final versions in `docker-handbook-projects/fullstack-notes-application/completed/*`
- Test: frontend build, API test/build, Compose stack

- [ ] **Step 1: Write the failing system inventory note**

Document the target system in the project README:

- React frontend
- Node backend
- Postgres
- NGINX reverse proxy

- [ ] **Step 2: Create the starter frontend baseline**

Use React + Vite + TypeScript with minimal notes UI scaffolding.

- [ ] **Step 3: Create the starter backend baseline**

Use a modern Node API with one health route and one notes route.

- [ ] **Step 4: Add database integration and migrations**

Keep the schema intentionally small.

- [ ] **Step 5: Add NGINX and Compose v2 integration**

Create a local-dev `compose.yaml` that wires frontend, API, db, and reverse proxy together.

- [ ] **Step 6: Add production-minded Dockerfiles**

Use multi-stage builds, non-root defaults where appropriate, and healthchecks.

- [ ] **Step 7: Create the completed state**

Make the full stack runnable end to end with clear docs.

- [ ] **Step 8: Verify the whole stack**

Run:

```bash
docker compose up --build -d
docker compose ps
docker compose logs --no-color
```

Expected: all services are healthy and the app is reachable through the documented entry point

- [ ] **Step 9: Commit**

```bash
git add fullstack-notes-application
git commit -m "feat: rebuild flagship fullstack notes application"
```

## Task 8: Add Go and Python service examples

**Files:**
- Create: `docker-handbook-projects/notes-api-go/*`
- Create: `docker-handbook-projects/notes-api-python/*`
- Test: service tests, Docker builds, run commands

- [ ] **Step 1: Write the smallest useful service contracts**

Both services should expose a tiny HTTP API and teach Docker patterns, not domain complexity.

- [ ] **Step 2: Build the Go service starter**

Create a compact HTTP service with one or two endpoints and a simple Dockerfile.

- [ ] **Step 3: Build the Python service starter**

Create a compact HTTP service with one or two endpoints and a simple Dockerfile.

- [ ] **Step 4: Add completed variants with better Docker practices**

Examples:

- multi-stage Go build
- Python dependency install optimization
- healthchecks where useful

- [ ] **Step 5: Verify the services**

Run representative commands such as:

```bash
go test ./...
docker build -t notes-api-go .
pytest
docker build -t notes-api-python .
```

Expected: PASS for implemented service examples

- [ ] **Step 6: Commit**

```bash
git add notes-api-go notes-api-python
git commit -m "feat: add go and python service examples"
```

## Task 9: Add the focused `llm-runtime-demo` project

**Files:**
- Create: `docker-handbook-projects/llm-runtime-demo/*`
- Test: smoke validation mode, Docker build, documented runtime commands

- [ ] **Step 1: Define the smallest acceptable LLM demo scope**

Record in the project README that the project is CPU-first, small in scope, and validated in CI using a smoke-test mode or fixture rather than a large model download.

- [ ] **Step 2: Create the Python service or CLI wrapper starter**

Implement a tiny runtime shell around a local model-serving dependency or mock layer.

- [ ] **Step 3: Add Docker support with volume and env configuration**

Document model-path or runtime-data mounts explicitly.

- [ ] **Step 4: Add a completed walkthrough state**

Ensure the completed state demonstrates container responsibilities clearly without turning into a product app.

- [ ] **Step 5: Verify smoke mode and Docker build**

Run:

```bash
docker build -t llm-runtime-demo .
docker run --rm -e LLM_MODE=smoke llm-runtime-demo
```

Expected: PASS without downloading multi-GB artifacts in CI

- [ ] **Step 6: Commit**

```bash
git add llm-runtime-demo
git commit -m "feat: add focused llm runtime example"
```

## Task 10: Sync foundation and utility chapters as projects land

**Files:**
- Modify: `the-docker-handbook/installing-docker/README.md`
- Modify: `the-docker-handbook/hello-world-in-docker/README.md`
- Create: `the-docker-handbook/container-lifecycle-and-debugging/README.md`
- Create: `the-docker-handbook/working-with-mounts-and-host-files/README.md`
- Create: `the-docker-handbook/utility-containers-with-imgtool/README.md`
- Modify: `the-docker-handbook/docs/project-matrix.md`
- Test: `npm run check`

- [ ] **Step 1: Rewrite the installation and first-container chapters with current Docker language**

Use links to official install docs where platform screenshots would age quickly.

- [ ] **Step 2: Replace old lifecycle material with the new chapter file**

Move the keep-worthy parts of `container-manipulation-basics/README.md` into `container-lifecycle-and-debugging/README.md`.

- [ ] **Step 3: Split mount-related material into its own chapter**

Move bind-mount and host-file material into `working-with-mounts-and-host-files/README.md`.

- [ ] **Step 4: Replace `rmbyext` explanations with `imgtool`**

Write `utility-containers-with-imgtool/README.md` against the real `imgtool/` project paths.

- [ ] **Step 5: Update the project matrix for these chapters**

Mark the `hello-dock` and `imgtool` rows as real mappings instead of TODO placeholders.

- [ ] **Step 6: Run the handbook checks**

Run: `npm run check`
Expected: PASS for the updated chapter set and paths

- [ ] **Step 7: Commit**

```bash
git add installing-docker hello-world-in-docker container-lifecycle-and-debugging working-with-mounts-and-host-files utility-containers-with-imgtool docs/project-matrix.md SUMMARY.md
git commit -m "docs: sync foundation and utility chapters"
```

## Task 11: Sync image-building, networking, and Compose chapters

**Files:**
- Create: `the-docker-handbook/building-your-first-docker-image/README.md`
- Create: `the-docker-handbook/writing-better-dockerfiles/README.md`
- Create: `the-docker-handbook/advanced-image-patterns/README.md`
- Create: `the-docker-handbook/container-networking-fundamentals/README.md`
- Create: `the-docker-handbook/compose-v2-and-multi-service-development/README.md`
- Modify: `the-docker-handbook/docs/project-matrix.md`
- Test: `npm run check`

- [ ] **Step 1: Split old image-building content into focused chapters**

Cover Dockerfile basics, caching and `.dockerignore`, and advanced image patterns separately.

- [ ] **Step 2: Rewrite the networking chapter**

Move the keep-worthy parts of `network-manipulation-basics.md` into `container-networking-fundamentals/README.md`.

- [ ] **Step 3: Rewrite the Compose and multi-service foundations chapter**

Use `docker compose`, current Compose file guidance, and the new project paths.

- [ ] **Step 4: Update the matrix for these chapters**

Point image-building chapters to `hello-dock`, `imgtool`, and `notes-api-node` where appropriate.

- [ ] **Step 5: Run the full handbook checks for this chapter group**

Run: `npm run check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add building-your-first-docker-image writing-better-dockerfiles advanced-image-patterns container-networking-fundamentals compose-v2-and-multi-service-development docs/project-matrix.md SUMMARY.md
git commit -m "docs: sync image and compose chapters"
```

## Task 12: Sync application chapters and migrate handbook repo references

**Files:**
- Modify: `the-docker-handbook/README.md`
- Create: `the-docker-handbook/containerizing-a-modern-frontend-application/README.md`
- Create: `the-docker-handbook/containerizing-a-nodejs-api-with-postgres/README.md`
- Create: `the-docker-handbook/containerizing-a-go-service/README.md`
- Create: `the-docker-handbook/containerizing-a-python-service/README.md`
- Create: `the-docker-handbook/shipping-a-fullstack-notes-application/README.md`
- Create: `the-docker-handbook/running-llm-workloads-with-docker/README.md`
- Create: `the-docker-handbook/publishing-images-and-production-practices/README.md`
- Modify: `the-docker-handbook/conclusion.md`
- Modify: `the-docker-handbook/docs/project-matrix.md`
- Test: `npm run check`

- [ ] **Step 1: Add the app-specific chapters against completed project paths**

- React frontend containerization
- Node API with database
- Go service
- Python service
- flagship full-stack app
- focused LLM runtime chapter

- [ ] **Step 2: Update the matrix as each chapter becomes real**

Ensure `docs/project-matrix.md` reflects the actual chapter/project relationship after each rewrite.

- [ ] **Step 3: Update the handbook root `README.md` project-code section only now**

Replace the old branch-based wording after the new single-branch project paths exist and the chapter references have migrated.

- [ ] **Step 4: Retire legacy project-path assumptions in the projects repo**

Once handbook references and the matrix point only at the new layout, remove temporary compatibility paths and obsolete branch-era assumptions from the projects repo.

- [ ] **Step 5: Run the full handbook checks**

Run: `npm run check`
Expected: PASS with all links and project references resolved

- [ ] **Step 6: Commit**

```bash
git add README.md SUMMARY.md docs/project-matrix.md .
git commit -m "docs: rewrite handbook for progressive reboot"
```

## Task 13: Add CI and maintenance hardening

**Files:**
- Create: `the-docker-handbook/.github/workflows/ci.yml`
- Create: `docker-handbook-projects/.github/workflows/ci.yml`
- Modify: repo package scripts and verification scripts as needed
- Test: local dry-run equivalents of CI commands

- [ ] **Step 1: Create handbook CI**

Add a workflow that runs:

```bash
npm ci
npm run check
```

The workflow must also check out `docker-handbook-projects` into the default sibling path expected by the validators or set `DOCKER_HANDBOOK_PROJECTS_PATH` explicitly.

- [ ] **Step 2: Create projects repo CI**

Add a workflow that runs required structure checks, all `completed/` project builds with their documented commands, starter checkpoint verification for every project, and language-specific tests for any project that includes them.

- [ ] **Step 3: Add README maintenance notes**

Document which commands contributors should run locally before opening changes.

- [ ] **Step 4: Run the same commands locally**

Run handbook repo:

```bash
npm ci
npm run check
```

Run projects repo:

```bash
node scripts/verify-projects.mjs
```

Plus the documented build or test commands for every project variant that the spec marks as required.

- [ ] **Step 5: Commit**

```bash
git add .github package.json scripts README.md
git commit -m "ci: add reboot validation workflows"
```

## Task 14: Final verification and handoff

**Files:**
- Modify: any files needed to fix final verification failures
- Test: both repos end-to-end

- [ ] **Step 1: Run the handbook end-to-end verification**

Run:

```bash
npm ci
npm run check
```

Expected: PASS

- [ ] **Step 2: Run the projects repo end-to-end verification**

Run:

```bash
node scripts/verify-projects.mjs
```

Expected: PASS

- [ ] **Step 3: Run all required project verification commands**

Run documented verification commands for:

- `hello-dock/starter/` and `hello-dock/completed/`
- `imgtool/starter/` and `imgtool/completed/`
- `notes-api-node/starter/` and `notes-api-node/completed/`
- `notes-api-go/starter/` and `notes-api-go/completed/` if tier-2 work was implemented
- `notes-api-python/starter/` and `notes-api-python/completed/` if tier-2 work was implemented
- `fullstack-notes-application/starter/` and `fullstack-notes-application/completed/`
- `llm-runtime-demo/starter/` and `llm-runtime-demo/completed/` in smoke mode

- [ ] **Step 4: Fix any failures and re-run the failed commands**

No success claims until all required checks pass.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: finalize docker handbook reboot baseline"
```
