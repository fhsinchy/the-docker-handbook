# Docker Handbook Progressive Reboot Design

## Overview

This design covers a progressive reboot of two repositories:

- `the-docker-handbook` - the editorial source for the handbook
- `docker-handbook-projects` - the canonical source for runnable example code

The reboot keeps the `The Docker Handbook` name and search equity intact while thoroughly modernizing the content, examples, project structure, and maintenance workflow. The current handbook remains the broad, practical entry point for learning Docker. A separate sequel or v2 book will later cover more ambitious and more opinionated topics without forcing that scope into the current handbook.

## Goals

- Preserve the handbook's brand, URL equity, and beginner-friendly promise.
- Modernize outdated Docker guidance, examples, and tooling across both repositories.
- Replace the JavaScript-only throughline with a broader but still teachable set of modern examples.
- Make the companion repository the single source of truth for meaningful code samples.
- Remove long-lived branch drift in the projects repository.
- Add enough structure and validation to keep docs and projects aligned over time.

## Non-Goals

- Renaming `The Docker Handbook`.
- Turning the current handbook into an advanced platform engineering or Kubernetes book.
- Letting AI/LLM material dominate the current handbook.
- Preserving old examples purely for nostalgia when they no longer teach Docker well.
- Replatforming the handbook away from Honkit as part of this reboot.

## Repository Roles

### `the-docker-handbook`

This repository remains the editorial home for the handbook:

- chapter narrative
- diagrams and screenshots
- command explanations
- learning path and table of contents
- references to runnable examples in the companion repository

Large code listings should be reduced. The book should explain concepts and reference source files from the companion repository rather than duplicating whole implementations inline.

### `docker-handbook-projects`

This repository becomes the canonical source of example code used by the book:

- starter and completed project states
- Dockerfiles and Compose files
- app source code and fixtures
- per-project README files and run instructions
- automated validation where practical

Every important code sample in the handbook should map to a real file in this repository.

## High-Level Architecture

The reboot has four coordinated workstreams:

1. Editorial architecture in `the-docker-handbook`
2. Example architecture in `docker-handbook-projects`
3. Chapter-to-project synchronization between the two repos
4. Validation and maintenance automation for both repos

These workstreams should progress in this order:

1. Redesign the handbook table of contents and chapter map
2. Redesign the project matrix and file structure in the companion repo
3. Align each chapter to specific starter/completed project paths
4. Rewrite content and rebuild projects incrementally
5. Add CI and validation to prevent future drift

## Frozen Planning Decisions

The following decisions are fixed for planning unless explicitly changed later:

- The handbook keeps the `The Docker Handbook` name.
- The current work is a progressive reboot, not a new v2 book.
- A separate sequel or v2 will be written later.
- The projects repo moves to a single default branch.
- Project layout is project-first, not difficulty-first.
- Each project uses `starter/` and `completed/` directories.
- Existing project names are kept when they still fit.
- `rmbyext` is retired and replaced by `imgtool`.
- `custom-nginx` is retired as a standalone legacy project and its useful teaching value is absorbed into newer image-extension or reverse-proxy material.
- The current handbook includes one focused LLM workload chapter, not a large AI application.
- The flagship full-stack app keeps the `fullstack-notes-application` identity unless implementation work reveals a strong reason to rename it.
- The recommended flagship backend baseline is Node.js for the current reboot because it best preserves continuity with the current handbook while still leaving room for Go and Python examples elsewhere.
- Honkit remains the book toolchain for this reboot to keep the modernization effort focused on content, projects, and validation rather than a docs-platform migration.

## Content Strategy

### Positioning

The current handbook becomes an evergreen, practical Docker guide for developers. It should teach modern Docker competence, not just Docker command memorization.

It should cover:

- Docker fundamentals
- image building and optimization
- local development with containers
- multi-container application workflows
- publishing and basic production-minded practices
- selective modern examples in multiple languages
- one focused chapter on running LLM workloads with Docker

The future sequel or v2 should cover material that is broader, deeper, or faster-moving, such as:

- larger AI application architectures
- advanced supply chain and image provenance topics
- deeper production deployment workflows
- orchestration handoff and adjacent platform topics

### Curriculum Shape

The new handbook should be organized roughly as follows:

#### Part 1: Foundations

- what containers are and are not
- images, containers, registries, tags
- basic CLI workflows
- ports, logs, exec, lifecycle commands
- bind mounts, volumes, and networks at a practical level

#### Part 2: Writing Dockerfiles Well

- base image selection
- `.dockerignore`
- layer caching
- BuildKit-aware workflows
- multi-stage builds
- non-root users
- healthchecks
- env vars, config boundaries, and secret handling principles

#### Part 3: Developing with Docker

- Compose v2
- service-to-service networking
- bind mounts and live reload
- dev vs prod Dockerfiles
- running databases and APIs together
- debugging in containers

#### Part 4: Shipping Real Applications

- frontend + API + database examples
- reverse proxies
- image publishing
- image size and reliability improvements
- basic vulnerability scanning and publishing hygiene
- multi-arch awareness where it fits naturally

#### Part 5: Modern Workloads

- focused chapter on running LLM workloads with Docker
- Python-based model-serving or inference-oriented example
- storage, runtime config, and CPU/GPU notes
- explicit boundary that larger AI applications belong in the sequel

### Scope Guardrails

The reboot is intentionally ambitious, so the implementation plan should treat the following as explicit scope guardrails:

- React, Node, the flagship full-stack app, `imgtool`, and core Docker chapter rewrites are tier-1 work.
- Go and Python service chapters are tier-2 work. They are included in the target design, but they are the first features to defer if schedule pressure threatens the core reboot.
- The current handbook should not expand beyond one focused LLM chapter and one compact supporting project.
- If tradeoffs are needed, preserve Docker fundamentals quality before adding breadth.

### Working Chapter Map

The implementation plan should treat the following as the default chapter map for the rebooted handbook:

1. Introduction to modern containerization and Docker
2. Installing Docker and verifying a current setup
3. Running your first containers
4. Understanding container lifecycle, logs, exec, and cleanup
5. Working with bind mounts, volumes, and host files
6. Utility containers with `imgtool`
7. Building your first Docker image
8. Writing better Dockerfiles with caching and `.dockerignore`
9. Multi-stage builds, non-root users, and smaller images
10. Container networking fundamentals
11. Compose v2 and multi-service development
12. Containerizing a modern frontend application
13. Containerizing a Node.js API with a database
14. Containerizing a Go service
15. Containerizing a Python service
16. Shipping a full-stack notes application
17. Running LLM workloads with Docker
18. Publishing images and basic production-minded practices
19. Conclusion and next steps toward the sequel

This chapter map may still be refined at the title level, but the scope and sequence should be treated as fixed enough for planning.

## Example Technology Strategy

The book should stop relying on a single aging JavaScript-only storyline.

Recommended example mix:

- React + Vite + TypeScript for the main frontend path
- Node.js for approachable API and full-stack examples
- Go for a compact compiled-service example
- Python for service examples and the focused LLM workload chapter

Selection criteria:

- in-demand and still teachable
- useful for demonstrating Docker concepts
- not included unless it improves the learning outcome

## Final Project Inventory

The planning baseline for `docker-handbook-projects` should be:

- `hello-dock` - modern frontend starter project
- `imgtool` - safe utility-container example replacing `rmbyext`
- `notes-api-node` - Node.js API example
- `notes-api-go` - Go service example
- `notes-api-python` - Python service example
- `fullstack-notes-application` - flagship multi-service app
- `llm-runtime-demo` - focused LLM workload example

Legacy directories should be evaluated against this inventory. If a legacy project survives, it should map cleanly to one of these roles.

Projects explicitly retired by this reboot:

- `rmbyext`
- `custom-nginx` as a legacy source-build exercise

## Companion Repository Structure

### Branch Strategy

The companion repository should move away from long-lived `master` and `completed` branches.

New strategy:

- one default branch
- examples organized by project
- each project contains its own `starter/` and `completed/` directories
- optional `shared/` directory only when needed to avoid noisy duplication

Recommended shape:

```text
docker-handbook-projects/
  hello-dock/
    starter/
    completed/
  imgtool/
    starter/
    completed/
  notes-api-node/
    starter/
    completed/
  notes-api-go/
    starter/
    completed/
  notes-api-python/
    starter/
    completed/
  fullstack-notes-application/
    starter/
    completed/
  llm-runtime-demo/
    starter/
    completed/
```

This gives readers a stable repository layout, easier navigation from the handbook, simpler CI, and much less long-term drift.

### Project Naming

Keep familiar project names when they still match the project's purpose.

- `hello-dock` can remain
- `fullstack-notes-application` can remain if it is still the flagship app
- rename legacy projects only when their old names no longer describe what they teach

### Canonical Project Template

Each project should follow this minimum structure unless there is a strong reason not to:

```text
<project>/
  README.md
  starter/
    README.md
    .env.example
    ...project files...
  completed/
    README.md
    .env.example
    ...project files...
```

Optional additions:

- `shared/` for assets or fixtures used by both variants
- `docs/` for project-specific diagrams or notes only when the root README is not enough

Rules:

- `starter/` must be runnable enough for the chapter checkpoint it supports
- `completed/` must be fully runnable for the scope it teaches
- each variant must contain its own Docker-related files when readers are expected to inspect or edit them
- `shared/` is allowed only for assets that are truly identical between `starter/` and `completed/`; Dockerfiles, Compose files, and app source that readers are meant to learn from should not be hidden there unless duplication would be actively misleading
- each project README must explain purpose, prerequisites, run commands, and where it appears in the handbook

## Project Portfolio

### Small Concept Projects

These teach one core concept each and should be quick to run.

- `hello-dock` - modern small frontend example
- `imgtool` - utility container chapter example

The old `custom-nginx` teaching material should be absorbed into newer handbook chapters and named projects where it fits best, such as:

- extending official images in Dockerfile-focused chapters
- static asset serving in frontend deployment examples
- reverse proxy configuration in `fullstack-notes-application`

### Focused Service Projects

These teach image building, local development, and service composition for specific stacks.

- Node API example
- Go service example
- Python service example

### Flagship Project

`fullstack-notes-application` becomes the main end-to-end project:

- React frontend
- modern API backend
- Postgres
- reverse proxy
- clean local development path
- production-minded container setup

This should become the primary example for multi-container architecture, development workflow, and shipping a realistic application.

### Focused AI Project

Add one compact Python-based project for the current handbook that teaches how to run an LLM-related workload with Docker.

This project should demonstrate:

- containerizing a Python AI-oriented service or runtime wrapper
- managing model files or runtime data with volumes
- environment-based configuration
- clear CPU-first behavior with optional GPU notes

It should not become a giant product or dominate the book.

The default scope for `llm-runtime-demo` is:

- CPU-first local usage
- optional GPU notes, not GPU-required design
- one small Python service or CLI wrapper around a local model runtime
- emphasis on volumes, runtime configuration, and image/container responsibilities
- no large product UI or document pipeline in the current handbook

Validation guidance for this project:

- CI should not depend on multi-GB model downloads
- default validation should use a tiny fixture, mocked runtime, or smoke-test mode
- any optional real-model workflow should be documented separately from required CI behavior

## Replacing `rmbyext`

The old `rmbyext` example should be retired.

Reasons:

- the project is effectively absent from the checked-out companion repo
- the current chapter explanation around executable images is partly inaccurate
- the example depends on installing from an external Git repository during build
- a destructive recursive delete tool is not the best long-term teaching example

### Replacement: `imgtool`

The executable-image chapter should be rewritten as a utility-container chapter centered on a safer project called `imgtool`.

`imgtool` should:

- operate on a bind-mounted directory
- perform safe file processing instead of destructive cleanup
- clearly demonstrate exec-form `ENTRYPOINT`
- optionally use `CMD` for defaults where helpful
- show how `docker run <image> args...` interacts with the entrypoint
- be built from local source in the companion repo, not installed from a Git URL during image build

This chapter should be reframed from "executable images" toward a clearer concept such as utility containers or CLI-style containers.

## Modernization Requirements

The reboot should update the following content throughout the handbook:

- `docker-compose` to `docker compose`
- outdated Compose file guidance and `version:` usage
- old installation flows and dated OS references
- old Docker build output examples that predate current BuildKit defaults
- loose base image guidance where a more modern recommendation is appropriate
- outdated package installation patterns in sample apps

The installation guidance should be modernized with a bias toward stable references over fragile screenshots:

- prefer links to official Docker install docs for platform-specific steps that change frequently
- keep screenshots only when they add lasting explanatory value
- avoid screenshot-heavy walkthroughs that quickly become stale

## Toolchain Decision

The reboot keeps Honkit for the current handbook.

Rationale:

- the primary problem is stale content and stale project examples, not an unusable docs platform
- moving to a new site generator at the same time would create a second large migration with little direct reader value
- CI and content structure improvements can be added without replatforming the book

The future sequel or a later follow-up can reevaluate mdBook, Docusaurus, Astro Starlight, or another toolchain without blocking this reboot.

The reboot should add missing modern practices where they fit naturally:

- multi-stage builds
- non-root images
- healthchecks
- smaller and more reproducible builds
- dev vs prod image patterns
- image publishing hygiene
- light-touch security and scanning guidance

## Data Flow Between Repos

The intended content flow is:

1. Example project files live in `docker-handbook-projects`
2. Handbook chapters reference those files and explain why they are written that way
3. Readers can choose `starter/` or `completed/` paths without switching branches
4. Validation tooling ensures the handbook references valid project paths and runnable examples

This reduces editorial drift and makes the projects repo the implementation source of truth.

### Cross-Repo Contract

The reboot should establish one explicit contract between the repos:

- the handbook owns chapter narrative and learning sequence
- the projects repo owns runnable implementation artifacts
- a chapter-to-project matrix lives in `the-docker-handbook/docs/project-matrix.md`
- every chapter that uses a companion project must reference exact repo-relative paths
- those references should use stable project-relative paths such as `hello-dock/starter/` or `fullstack-notes-application/completed/`
- validation should fail if a referenced project path does not exist

`docs/project-matrix.md` should become the editorial source of truth for:

- which chapters map to which projects
- whether a chapter references `starter/`, `completed/`, or both
- which project is considered the primary example for each chapter

## Error Handling and Risk Management

### Editorial Risks

- scope creep from trying to write the sequel inside the current handbook
- introducing too many stacks too quickly
- rewriting everything at once without a stable chapter map

Mitigation:

- keep the current reboot focused on teachable Docker workflows
- treat the sequel as a hard boundary for advanced expansion
- phase the work based on a chapter-to-project matrix

### Project Risks

- inconsistent project conventions across languages
- broken starter/completed parity
- docs referencing files that move or disappear
- migration from old branch-based links breaking existing references

Mitigation:

- define shared conventions for project layout and README structure
- validate starter/completed directories explicitly
- add link and path validation where practical
- stage the repo migration so old references can be updated in a controlled pass

## Testing and Verification Strategy

### `the-docker-handbook`

- Honkit build must pass
- chapter links should be checked
- chapter-to-project references should be validated
- editorial consistency pass for terminology and command syntax

### `docker-handbook-projects`

- each project should include minimal run instructions
- starter and completed variants should be verified independently
- language-specific tests should run when available
- Docker build checks should be automated for all completed projects and for starter projects once they reach a runnable checkpoint

### Cross-Repo Verification

- every major handbook example should point to a real path in the companion repo
- every highlighted companion example should be referenced from at least one handbook section

### Required CI Gates

The implementation plan should treat these as must-pass gates, not best-effort checks:

#### Handbook repo

- `honkit build` succeeds
- internal markdown links resolve
- all project paths referenced in `docs/project-matrix.md` exist
- all project paths referenced in chapter files exist

#### Projects repo

- every `completed/` project builds with its documented Docker command or Compose command
- every `starter/` project reaches the documented checkpoint for the chapter it supports
- project READMEs are present and non-empty
- language-specific tests run for projects that include them

#### Cross-repo

- every matrix entry resolves to both a handbook chapter and a valid project path
- deleted or renamed project paths are updated in handbook references before merge

## Implementation Phases

### Phase 1: Audit and Information Architecture

- classify existing chapters as keep, rewrite, merge, replace, or remove
- define the new handbook table of contents
- define the new companion project matrix

### Phase 2: Repository Restructure

- move the projects repo to a single-branch project-first layout
- establish `starter/` and `completed/` project conventions
- create placeholders and README scaffolding for the new project matrix

### Phase 2A: Branch Migration

The migration away from `master` and `completed` must happen in controlled steps:

1. inventory current project content from both old branches
2. define the new single-branch project map
3. copy or reconstruct starter states into per-project `starter/` directories
4. copy or reconstruct completed states into per-project `completed/` directories
5. update handbook references from branch URLs to stable project paths
6. add a top-level compatibility note in the projects repo README explaining the old two-branch model and the new single-branch layout
7. only remove old branch assumptions from docs after the new paths exist and are referenced everywhere

No implementation plan should assume a flag-day migration that leaves handbook links broken midstream.

### Phase 3: Core Content Modernization

- rewrite fundamentals and Dockerfile chapters
- rewrite Compose and local development sections
- replace outdated commands and examples globally

### Phase 4: Project Rebuilds

- rebuild `hello-dock`
- replace `rmbyext` with `imgtool`
- modernize or replace focused service examples

### Phase 5: Flagship Application Rebuild

- rebuild `fullstack-notes-application` as a dedicated phase
- treat frontend, backend, database, reverse proxy, and starter/completed parity as one coordinated workstream
- do not bury this project inside the general project-refresh bucket because it is the main schedule and integration risk

### Phase 6: New Content Additions

- add Go and Python companion examples where they best support existing chapters
- add the focused LLM workload chapter and project

### Phase 7: Maintenance Hardening

- add CI for handbook builds
- add validation for example projects
- add lightweight checks that catch drift between book and code

## Success Criteria

The reboot is successful when:

- the handbook remains recognizable as `The Docker Handbook`
- the content no longer reads like a 2020 snapshot with patched commands
- the projects repo is simpler to navigate and maintain than the old branch split
- the handbook covers modern Docker workflows clearly and accurately
- readers can follow starter and completed project states without switching branches
- the book includes modern examples in React, Node, Go, Python, and one focused LLM chapter without losing beginner accessibility
- `imgtool` fully replaces `rmbyext` as the utility-container teaching example
- both repos have enough automation to keep examples and docs aligned
