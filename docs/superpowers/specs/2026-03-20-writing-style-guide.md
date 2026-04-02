# The Docker Handbook — Writing Style Guide

This document captures the exact writing style, voice, structure, and conventions used throughout the existing Docker Handbook. Any new or rewritten content **must** follow these patterns to remain cohesive with the original work.

---

## 1. Voice and Person

- **Second person throughout.** The reader is always "you." The author is always "I" or "me."
- The author speaks directly to the reader like a friend sitting next to them walking them through something on their laptop. Not a professor lecturing. Not a docs page listing facts.
- First person is used freely and without hesitation: "I would suggest you to install…", "In my opinion, the plan should be…", "I'll go through the steps briefly."
- The author's own setup, preferences, and habits show up naturally: "I'll be switching between my Ubuntu 20.10 and Fedora 33 workstations", "I prefer Linux over the others", "I prefer a named volume in such scenarios."

## 2. Tone

- **Casual but not sloppy.** The writing reads like a well-prepared workshop, not a textbook and not a Reddit comment.
- Confident without being arrogant. The author states opinions plainly: "Using Compose on a production environment is not recommended at all."
- Light humor appears occasionally and naturally, never forced:
  - "So without further ado, lets jump right in."
  - "Now the question is 'What role does Docker play here?'"
  - "Okay, enough talking."
  - Naming a network "skynet."
  - "and voilà!"
- Reassurance is offered often: "Don't worry though, you don't need to know JavaScript or vite in order to go through this sub-section."
- Empathy for the reader's experience: "getting started can seem a bit intimidating at first", "it's a painful task."

## 3. Sentence Structure and Rhythm

- Sentences are **short to medium length.** Long compound sentences are rare. When a sentence gets long, it's because it contains a technical explanation that can't be broken up without losing clarity.
- Paragraphs are typically **2–5 sentences.** Single-sentence paragraphs are common when making a standalone point or transitioning.
- The author alternates between:
  - Declarative statements: "Containers are isolated environments."
  - Direct instructions: "Open up the terminal and run the following command."
  - Rhetorical questions: "Does that mean you're out of danger now? Of course not."
  - Conversational asides: "Well theoretically this should be it. But practically there is some other stuff as well."

## 4. How Concepts Are Introduced

This is a critical pattern. New concepts always follow this sequence:

1. **Context from what was already covered.** "Now that you've a solid understanding of running containers…" or "In the previous sections, you've learned about…"
2. **Why this matters / what problem it solves.** The author almost never introduces a concept without first establishing the pain point. The networking chapter starts with a concrete scenario (two containers that can't talk to each other) and works through wrong solutions before arriving at the correct one.
3. **The concept itself**, explained in plain language, sometimes with a quote from official docs.
4. **A concrete example** the reader executes immediately.
5. **Explanation of what just happened**, walking through the output line by line or the steps that occurred behind the scenes.

The author almost never drops a concept on the reader cold. There's always a bridge from what they already know.

## 5. Explanation Style

- **Show first, explain after.** The pattern is: run a command → show the output → explain what each part means. Not the other way around.
- Explanations use **bullet points with inline code** for breaking down Dockerfile instructions, command options, or YAML keys. Each bullet starts with the element being explained in backticks, followed by a dash or description.
- When explaining multi-step processes (like what happens when `docker run hello-world` executes), **numbered lists** are used.
- Analogies are used sparingly but effectively: "They are like a frozen, read-only copy of a container."
- The author refers to official docs frequently but doesn't paste walls of documentation. Instead: a short explanation in their own words, then a link for the reader who wants more.

## 6. Code Blocks and Command Presentation

- Code blocks use the ` ```text ` fence. Not `bash`, not `shell`, not `dockerfile`. Always `text`.
- Commands and their output live in the **same code block**, with output lines prefixed by `#`:
  ```
  docker container ls

  # CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
  # 9f21cb777058   ...
  ```
- There is always **a blank line** between the command and the commented output within the code block.
- Long outputs are sometimes truncated with `### LONG INSTALLATION STUFF GOES HERE ###`.
- Multi-line commands use backslash continuation (`\`) with each option on its own line, indented by 4 spaces:
  ```
  docker container run \
      --rm \
      --detach \
      --publish 3000:3000 \
      --name hello-dock-dev \
      hello-dock:dev
  ```
- Inline code (backticks) is used for: command names, option flags, file names, directory paths, image names, container names, port numbers, environment variable names, and any literal text the reader would type or see in output.

## 7. Section and Chapter Structure

- Every chapter starts with an `# H1` heading that names the topic.
- The opening paragraph connects to what came before and previews what will be covered.
- Sub-sections use `## H2` headings. Sub-sub-sections are rare but use `###` when they appear (seen in the Dockerfile instruction reference).
- Chapters follow the progression: **context → concept → hands-on → explanation → next concept.** This loop repeats throughout each chapter.
- Chapters end by either:
  - Suggesting the reader clean up (stop containers, remove things) before moving on.
  - Previewing the next section.
  - Summarizing what was accomplished.
- There are no "key takeaways" boxes, no "summary" sections at chapter ends, no quizzes. The chapter just naturally wraps up.

## 8. Transitions Between Sections

The author has a distinctive set of transition patterns:

- **"Now that you've…"** — the single most common opener. "Now that you've a solid understanding of…", "Now that you have Docker up and running…", "Now that you've learned enough about networks…"
- **"In the previous section(s), you've learned…"** — used to ground the reader.
- **"So far in this article…"** — used when building on accumulated knowledge.
- **"As you've already learned…"** or **"As I've already explained…"** — used for callbacks.
- **"It's time for you to…"** — used to signal a shift to hands-on work.
- **"Let's"** — "Let's consider a real life scenario here", "Let's begin by listing…", "Let's have a closer look…"

## 9. How Problems and Solutions Are Presented

The author teaches by deliberately walking into problems:

1. Do something the naive way.
2. Watch it break or show its limitations.
3. Explain why it broke.
4. Present the correct approach.

Examples from the book:
- Bind mounts chapter: mount the volume → container crashes because node_modules got overwritten → explain why → introduce anonymous volumes to fix it.
- Networking chapter: try to connect containers via exposed port → doesn't work → try IP address → fragile → introduce user-defined bridge networks.

This "fail first, then fix" pattern is fundamental to the teaching approach. New content must preserve it.

## 10. Formatting Conventions

- **Bold** is used for emphasis on key terms when first introduced: "**User-defined bridges provide automatic DNS resolution between containers**"
- *Italics* are used for UI elements and download labels: "click the _Download for Mac (stable)_ button"
- Links use descriptive text, not bare URLs (except for repository links which appear as standalone lines).
- Images use `![](filename.png)` or `![](filename.svg)` with no alt text. They are placed on their own line, immediately after the paragraph that references them.
- Escaped parentheses appear throughout: `\(` and `\)` — this is a GitBook/HonKit convention.
- The word "sub-section" is used (not "subsection").

## 11. Technical Depth and Assumptions

- The reader is assumed to be comfortable with the terminal and basic programming concepts but is **not** assumed to know Docker.
- Every Docker concept is explained from scratch, but Linux/terminal basics are not.
- The author mentions alternative tools (Podman, Kaniko, rkt) but doesn't dwell on them. Docker is the focus.
- Version-specific details are stated plainly when relevant: "Prior to version 1.13, Docker had only the previously mentioned command syntax."
- The author distinguishes between the old command syntax (`docker run`) and the new syntax (`docker container run`) and teaches the new one, but acknowledges the old.

## 12. Content Density and Length

- Chapters are **substantial.** The container-manipulation-basics chapter covers 12 sub-sections. The image-manipulation chapter covers image creation, tagging, building NGINX from source, optimization, Alpine Linux, executable images, sharing online, and a full Dockerfile instruction reference.
- Each sub-section typically has **1–3 code blocks** with full command + output, interspersed with 2–5 paragraphs of explanation.
- The book does not rush. When a concept needs space, it gets space. The multi-container chapter walks through every single step: create network, run database, create volume, redo the database container with the volume, check logs, verify network attachment, write the Dockerfile, build the image, run the API container, run migrations, and write shell scripts.
- At the same time, the author doesn't pad. If something is straightforward, they say so and move on: "The command doesn't yield any output but you can verify that the changes have taken place."

## 13. Recurring Phrases and Speech Patterns

These phrases appear repeatedly and give the book its distinctive feel:

- "The generic syntax for [X] is as follows:"
- "To [verb], you can execute the following command:"
- "Explanation for this code is as follows:"
- "As you can see…" / "As can be seen…"
- "I hope that you remember…"
- "Keep in mind…"
- "To be honest…"
- "Well…" (used at the start of sentences as a conversational filler)
- "Hence…" (used frequently instead of "so" or "therefore")
- "Evident by the output…"
- "In order to…" (used more than "to" alone)
- "That's completely valid" / "This is a completely valid approach"
- "Congratulations!" (used sparingly after major milestones)
- "[X] is/are as follows:" (very frequent list introducer)

## 14. What the Writing Does NOT Do

Equally important for maintaining cohesion:

- **No emoji.** Zero, anywhere.
- **No exclamation marks** except "Congratulations!" at milestones.
- **No "In this section, you will learn:" bullet lists** at the start of chapters. The intro is always a flowing paragraph.
- **No callout boxes** (no tips, warnings, notes boxes). Information that would be a "warning" is stated inline: "Keep in mind though…"
- **No passive voice patterns like "It should be noted that…"** The author just says the thing.
- **No hedging language** like "perhaps", "might want to consider", "it could be argued." The author states things directly.
- **No jargon without explanation.** When a term like "entry-point" or "bind mount" appears, it gets explained the first time.
- **No promotional tone.** The writing doesn't sell Docker or hype anything.
- **No "let's dive in" or "deep dive."** The closest is "lets jump right in."
- **No filler conclusions** per section like "And that's how you create a container!" The writing moves on naturally.

## 15. The "Farhan Voice" — Distinguishing Characteristics

If you stripped the author name, you could still identify this writing by:

1. The frequent use of "Well…" to start explanatory sentences.
2. The "Now that you've…" chapter openers.
3. Stating personal preferences openly: "I prefer…", "I usually…", "I would suggest…"
4. The "fail first, then fix" teaching pattern.
5. Calling official documentation "the official docs" (lowercase, always with a link).
6. Using "sub-section" as two words with a hyphen.
7. The rhythm of: command → blank line → commented output (in the same code block).
8. Minor grammatical quirks that give the writing a non-native-English warmth: "you've a solid understanding" (dropping "got"), "lets" without apostrophe occasionally, "look like as follows."
9. Ending chapters with practical cleanup instructions rather than summaries.
10. The generous use of "hence" as a connector.

---

## Application Rules for New Content

When writing new chapters or rewriting existing ones:

1. **Open with a "Now that you've…" bridge** from the previous chapter's content.
2. **Introduce every concept through a problem first.** Ask what the reader might try naively, show why it fails, then present the solution.
3. **Use the same code block format:** ` ```text ` fence, commands followed by blank line then `#`-prefixed output.
4. **Keep the same explanation cadence:** show the command, show the output, walk through it with bullet points or numbered steps.
5. **Maintain the casual-but-informed tone.** Write like you're teaching a friend. Say "I" and "you." Share preferences. Be direct.
6. **Preserve the recurring phrases.** "The generic syntax is as follows:", "To [verb], execute the following command:", "As you can see…"
7. **No new formatting patterns.** No callout boxes, no emoji, no summary sections, no "what you'll learn" lists.
8. **Match the content density.** Each sub-section should have real commands with real output, not just descriptions of what commands exist.
9. **Preserve the minor grammatical quirks.** Don't over-correct into sterile perfect English. The slightly informal grammar is part of the voice.
10. **When in doubt, re-read a section of the original and match its cadence.**
