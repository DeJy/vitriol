import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLI_PATH = path.join(__dirname, '../src/index.js')
const TEST_DIR = path.join(__dirname, 'temp-integration')

const templates = [
  { name: 'standard', args: ['--standard', '--js', '--no-ionic', '--no-devcontainer'] },
  { name: 'standard-ts', args: ['--standard', '--ts', '--no-ionic', '--no-devcontainer'] },
  { name: 'standard-ionic', args: ['--standard', '--js', '--ionic', '--no-devcontainer'] },
  { name: 'standard-ionic-ts', args: ['--standard', '--ts', '--ionic', '--no-devcontainer'] },
  { name: 'jsx', args: ['--jsx', '--js', '--no-ionic', '--no-devcontainer'] },
  { name: 'jsx-ts', args: ['--jsx', '--ts', '--no-ionic', '--no-devcontainer'] },
  { name: 'jsx-ionic', args: ['--jsx', '--js', '--ionic', '--no-devcontainer'] },
  { name: 'jsx-ionic-ts', args: ['--jsx', '--ts', '--ionic', '--no-devcontainer'] },
]

describe('Integration Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR)
    }
  })

  afterAll(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true })
    }
  })

  templates.forEach(({ name, args }) => {
    it(`should create and build ${name} template`, () => {
      const projectDir = path.join(TEST_DIR, name)
      
      // Clean up if exists
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true, force: true })
      }

      // Run CLI
      console.log(`Generating ${name}...`)
      execSync(`node ${CLI_PATH} ${name} ${args.join(' ')}`, {
        stdio: 'inherit',
        cwd: TEST_DIR // Run inside temp dir so targetDir is just the name
      })

      expect(fs.existsSync(projectDir)).toBe(true)
      expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true)
      expect(fs.existsSync(path.join(projectDir, 'vite.config.js')) || fs.existsSync(path.join(projectDir, 'vite.config.ts'))).toBe(true)

      // Install dependencies
      console.log(`Installing dependencies for ${name}...`)
      execSync('npm install', {
        cwd: projectDir,
        stdio: 'ignore' // Suppress output to keep logs clean
      })

      // Run tests
      console.log(`Running tests for ${name}...`)
      execSync('npm run test -- run', {
        cwd: projectDir,
        stdio: 'inherit'
      })

      // Build
      console.log(`Building ${name}...`)
      execSync('npm run build', {
        cwd: projectDir,
        stdio: 'ignore'
      })

      expect(fs.existsSync(path.join(projectDir, 'dist'))).toBe(true)
      expect(fs.existsSync(path.join(projectDir, 'dist/index.html'))).toBe(true)
    }, 300000) // 5 minutes timeout per test
  })
})
