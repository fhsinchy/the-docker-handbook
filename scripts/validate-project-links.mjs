import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const handbookRoot = resolve(__dirname, '..')
const projectsRoot = process.env.DOCKER_HANDBOOK_PROJECTS_PATH
  || resolve(handbookRoot, '..', 'docker-handbook-projects')

const summaryPath = resolve(handbookRoot, 'SUMMARY.md')
const matrixPath = resolve(handbookRoot, 'docs', 'project-matrix.md')

const errors = []

// Read SUMMARY.md to get all chapter files
const summaryContent = readFileSync(summaryPath, 'utf8')
const chapterFileRegex = /\[.*?\]\((.*?)\)/g
const summaryFiles = new Set()
let match
while ((match = chapterFileRegex.exec(summaryContent)) !== null) {
  summaryFiles.add(match[1])
}

// Read project matrix to get chapter-to-file mappings
const matrixContent = readFileSync(matrixPath, 'utf8')
const matrixLines = matrixContent.split('\n').filter(l => l.startsWith('|')).slice(2)

const matrixChapterFiles = new Set()
for (const line of matrixLines) {
  const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length)
  if (cells.length >= 2) {
    const chapterFile = cells[1].replace(/`/g, '')
    matrixChapterFiles.add(chapterFile)
  }
}

// Check that every matrix chapter file has a SUMMARY.md entry
for (const cf of matrixChapterFiles) {
  if (!summaryFiles.has(cf)) {
    errors.push(`Matrix chapter file "${cf}" has no SUMMARY.md entry`)
  }
}

// Check that every SUMMARY.md entry has a matrix row
for (const sf of summaryFiles) {
  if (!matrixChapterFiles.has(sf)) {
    errors.push(`SUMMARY.md file "${sf}" has no project matrix row`)
  }
}

// Scan chapter markdown files for project repo path references
function getChapterFiles () {
  const files = []
  for (const sf of summaryFiles) {
    const fullPath = resolve(handbookRoot, sf)
    if (existsSync(fullPath)) {
      files.push({ relative: sf, full: fullPath })
    }
  }
  return files
}

const projectPathRegex = /(?:docker-handbook-projects|companion[- ]repo)[\/\\]([a-z0-9_-]+(?:\/[a-z0-9_-]+)*)/gi

for (const { relative, full } of getChapterFiles()) {
  const content = readFileSync(full, 'utf8')
  // Process line by line so we can skip lines containing URLs
  for (const line of content.split('\n')) {
    // Skip lines that contain GitHub URLs or other http links referencing the projects repo
    if (/https?:\/\//.test(line)) continue
    let pathMatch
    projectPathRegex.lastIndex = 0
    while ((pathMatch = projectPathRegex.exec(line)) !== null) {
      const referencedPath = pathMatch[1]
      const resolvedPath = resolve(projectsRoot, referencedPath)
      if (!existsSync(resolvedPath)) {
        errors.push(`Chapter "${relative}" references project path "${referencedPath}" which does not exist`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Project link validation FAILED:')
  for (const err of errors) {
    console.error(`  - ${err}`)
  }
  process.exit(1)
} else {
  console.log('Project link validation PASSED')
}
