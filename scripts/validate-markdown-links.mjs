import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const handbookRoot = resolve(__dirname, '..')
const summaryPath = resolve(handbookRoot, 'SUMMARY.md')

const errors = []

// Read SUMMARY.md to get all chapter files
const summaryContent = readFileSync(summaryPath, 'utf8')
const chapterFileRegex = /\[.*?\]\(([^#)]+)/g
const summaryFiles = new Set()
let match
while ((match = chapterFileRegex.exec(summaryContent)) !== null) {
  summaryFiles.add(match[1])
}

// For each chapter file, scan for internal markdown links
for (const sf of summaryFiles) {
  const fullPath = resolve(handbookRoot, sf)
  if (!existsSync(fullPath)) {
    errors.push(`SUMMARY.md references "${sf}" but the file does not exist`)
    continue
  }

  const content = readFileSync(fullPath, 'utf8')
  const chapterDir = dirname(fullPath)

  // Match markdown links: [text](path) but skip external URLs and anchors
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
  let linkMatch
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const linkTarget = linkMatch[2]

    // Skip external URLs
    if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('mailto:')) {
      continue
    }

    // Skip pure anchors
    if (linkTarget.startsWith('#')) {
      continue
    }

    // Strip anchor from path
    const pathPart = linkTarget.split('#')[0]
    if (!pathPart) continue

    // Resolve relative to the chapter file's directory
    const resolvedLink = resolve(chapterDir, pathPart)
    if (!existsSync(resolvedLink)) {
      errors.push(`"${sf}" contains broken link to "${pathPart}"`)
    }
  }
}

if (errors.length > 0) {
  console.error('Markdown link validation FAILED:')
  for (const err of errors) {
    console.error(`  - ${err}`)
  }
  process.exit(1)
} else {
  console.log('Markdown link validation PASSED')
}
