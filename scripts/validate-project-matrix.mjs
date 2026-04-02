import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const handbookRoot = resolve(__dirname, '..')
const projectsRoot = process.env.DOCKER_HANDBOOK_PROJECTS_PATH
  || resolve(handbookRoot, '..', 'docker-handbook-projects')

const matrixPath = resolve(handbookRoot, 'docs', 'project-matrix.md')
const errors = []

// Read and parse the matrix
const raw = readFileSync(matrixPath, 'utf8')
const lines = raw.split('\n').filter(l => l.startsWith('|'))

// Skip header and separator
const dataLines = lines.slice(2)

// Required columns
const requiredColumns = ['Order', 'Chapter file', 'Chapter title', 'Primary project', 'Variant', 'Supporting projects', 'Notes']

// Validate header
const headerCells = lines[0].split('|').map(c => c.trim()).filter(Boolean)
for (const col of requiredColumns) {
  if (!headerCells.includes(col)) {
    errors.push(`Missing required column: ${col}`)
  }
}

// Valid variants
const validVariants = ['starter', 'completed', 'both', '']

// Track referenced projects for inventory coverage
const referencedProjects = new Set()

// Required project inventory
const requiredProjects = [
  'hello-dock',
  'imgtool',
  'notes-api-node',
  'notes-api-go',
  'notes-api-python',
  'fullstack-notes-application',
  'llm-runtime-demo'
]

for (const line of dataLines) {
  const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length)
  if (cells.length < 7) {
    errors.push(`Row has fewer than 7 columns: ${line}`)
    continue
  }

  const [order, chapterFile, chapterTitle, primaryProject, variant, supportingProjects, notes] = cells

  // Strip backticks from file paths
  const cleanChapterFile = chapterFile.replace(/`/g, '')
  const cleanPrimaryProject = primaryProject.replace(/`/g, '')
  const cleanSupportingProjects = supportingProjects.replace(/`/g, '')

  // Check chapter file exists
  if (cleanChapterFile) {
    const chapterPath = resolve(handbookRoot, cleanChapterFile)
    if (!existsSync(chapterPath)) {
      errors.push(`Chapter file not found: ${cleanChapterFile}`)
    }
  }

  // Check primary project exists
  if (cleanPrimaryProject) {
    const projectPath = resolve(projectsRoot, cleanPrimaryProject)
    if (!existsSync(projectPath)) {
      errors.push(`Primary project path not found: ${cleanPrimaryProject} (looked in ${projectPath})`)
    }
    // Track the top-level project name
    const topProject = cleanPrimaryProject.split('/')[0]
    referencedProjects.add(topProject)
  }

  // Validate variant
  const cleanVariant = variant.replace(/`/g, '')
  if (cleanPrimaryProject && !validVariants.includes(cleanVariant)) {
    errors.push(`Invalid variant "${cleanVariant}" for chapter "${chapterTitle}" (must be starter, completed, or both)`)
  }
  if (cleanPrimaryProject && !cleanVariant) {
    errors.push(`Variant is required when Primary project is present: "${chapterTitle}"`)
  }

  // Check supporting projects
  if (cleanSupportingProjects) {
    for (const sp of cleanSupportingProjects.split(',').map(s => s.trim()).filter(Boolean)) {
      const spPath = resolve(projectsRoot, sp)
      if (!existsSync(spPath)) {
        errors.push(`Supporting project path not found: ${sp}`)
      }
      const topProject = sp.split('/')[0]
      referencedProjects.add(topProject)
    }
  }
}

// Check that every required project has at least one matrix reference
for (const proj of requiredProjects) {
  if (!referencedProjects.has(proj)) {
    errors.push(`Required project "${proj}" has no matrix reference`)
  }
}

if (errors.length > 0) {
  console.error('Project matrix validation FAILED:')
  for (const err of errors) {
    console.error(`  - ${err}`)
  }
  process.exit(1)
} else {
  console.log('Project matrix validation PASSED')
}
