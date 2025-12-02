import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import prompts from 'prompts'
import { red, reset } from 'kolorist'

const minimistOptions = {
  alias: {
    ts: 'typescript',
    js: 'javascript',
    i: 'ionic',
    noi: 'no-ionic',
    dc: 'devcontainer',
    nodc: 'no-devcontainer',
    std: 'standard',
  },
  boolean: ['typescript', 'javascript', 'ionic', 'no-ionic', 'devcontainer', 'no-devcontainer', 'standard', 'jsx'],
  default: {
    ionic: null,
    devcontainer: null,
    typescript: null,
    javascript: null,
    standard: null,
    jsx: null
  }
}

const argv = minimist(process.argv.slice(2), minimistOptions)

const defaultIsIonic = false;
const defaultIsDevContainer = false;
const defaultTargetDir = 'vitriol-project'
const defaultProjectType = 'standard'
const defaultLanguage = 'javascript'
const cwd = process.cwd()
const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../..')

const renameFiles = {
  _gitignore: '.gitignore',
}
const skippedDirectories = new Set(['node_modules', '.git'])
const conditionalRegex = /([ \t]*)\/\/ if\s+(.+?)[ \t]*[\r\n]+([\s\S]*?)(?:[ \t]*)?(?:\/\/ else\s+\2[ \t]*[\r\n]+([\s\S]*?))?[ \t]*\/\/ end\s+\2[ \t]*(?:\r?\n)?/g

const dynamicExtensionResolvers = {
  view: ({ projectType, language }) => {
    if (projectType === 'jsx') {
      return language === 'typescript' ? '.tsx' : '.jsx'
    }
    return language === 'typescript' ? '.ts' : '.js'
  },
}

const resolveDynamicExtension = (fileName, variables) => {
  const match = fileName.match(/(\.?)\[([a-z0-9_-]+)\]$/i)
  if (!match) {
    return null
  }
  const [, hasDot, token] = match
  const resolver = dynamicExtensionResolvers[token]
  if (!resolver) {
    return fileName.replace(match[0], '')
  }
  const base = fileName.slice(0, match.index ?? fileName.length - match[0].length)
  const extension = resolver({
    projectType: variables.projectType,
    language: variables.language,
  })
  return base + extension
}


const adjustPartialFileExtension = (fileName, variables, convertJsForTypescript = true) => {
  let sanitized = fileName.replace(/\.vitriol$/, '')
  const dynamicResult = resolveDynamicExtension(sanitized, variables)
  if (dynamicResult !== null) {
    return dynamicResult
  }

  const language = variables.language || 'javascript'
  const normalizedPath = sanitized.replace(/\\/g, '/')
  const normalizedNoLeading = normalizedPath.replace(/^\.\/?/, '')
  const isTestFile = normalizedNoLeading.startsWith('test/') || normalizedNoLeading.includes('/test/')
  const shouldConvert = convertJsForTypescript && !isTestFile

  if (!shouldConvert || language !== 'typescript') {
    return sanitized
  }
  if (sanitized.endsWith('.jsx')) return sanitized.replace(/\.jsx$/, '.tsx')
  if (sanitized.endsWith('.js')) return sanitized.replace(/\.js$/, '.ts')
  return sanitized
}

const replaceVariablesInContent = (content, variables) => {
  let updated = content
  for (const [key, value] of Object.entries(variables)) {
    updated = updated.replace(new RegExp(`\\§\\{${key}\\}`, 'g'), String(value))
  }
  return updated
}

const evaluateConditionalBlocks = (input, variables) => {
  const evaluateBlock = (match, _indent, condition, trueContent, falseContent = '') => {
    try {
      const check = new Function('projectType', 'language', 'isJs', 'isTs', 'isJSX', 'isStd', 'isIon', 'ext', `return ${condition}`)
      return check(variables.projectType, variables.language, variables.isJs, variables.isTs, variables.isJSX, variables.isStd, variables.isIon, variables.ext)
        ? trueContent
        : falseContent
    } catch (err) {
      return match
    }
  }

  let previous
  let next = input
  do {
    previous = next
    next = next.replace(conditionalRegex, evaluateBlock)
  } while (next !== previous)
  return next
}

const processTsComments = (content, variables) => {
  const tsCommentRegex = /\/\*@ts\s+([\s\S]*?)\s*\*\//g
  return content.replace(tsCommentRegex, (match, typeContent) => {
    return variables.language === 'typescript' ? typeContent : ''
  })
}

const transformTemplatedFile = ({ originalPath, relativePath }, rootDir, variables) => {
  let content = fs.readFileSync(originalPath, 'utf-8')
  content = replaceVariablesInContent(content, variables)
  content = evaluateConditionalBlocks(content, variables)
  content = processTsComments(content, variables)

  const finalRelativePath = adjustPartialFileExtension(relativePath, variables)
  const finalPath = path.join(rootDir, finalRelativePath)

  if (content.trim().length === 0) {
    fs.rmSync(originalPath, { force: true })
    if (finalPath !== originalPath && fs.existsSync(finalPath)) {
      fs.rmSync(finalPath, { force: true })
    }
    return
  }

  if (finalPath !== originalPath) {
    fs.rmSync(originalPath, { force: true })
    if (fs.existsSync(finalPath)) {
      fs.rmSync(finalPath, { force: true })
    }
  }

  fs.mkdirSync(path.dirname(finalPath), { recursive: true })
  fs.writeFileSync(finalPath, content)
}

const processTemplatedFiles = (rootDir, variables, relativeVitriolPaths = []) => {
  if (!relativeVitriolPaths.length) {
    return
  }

  for (const relativePath of relativeVitriolPaths) {
    const originalPath = path.join(rootDir, relativePath)
    if (!fs.existsSync(originalPath)) {
      continue
    }
    transformTemplatedFile({ originalPath, relativePath }, rootDir, variables)
  }
}

function parseArg(argv) {
  const argOut = {}
  if (argv.ionic === true) {
    argOut.isIonic = true
  } else if (argv.ionic === false || argv['no-ionic'] === true) {
    argOut.isIonic = false
  }

  if (argv.devcontainer === true) {
    argOut.isDevContainer = true
  } else if (argv.devcontainer === false || argv['no-devcontainer'] === true) {
    argOut.isDevContainer = false
  }

  if (argv.typescript === true) {
    argOut.language = 'typescript'
  } else if (argv.javascript === true) {
    argOut.language = 'javascript'
  }

  if (argv.jsx === true) {
    argOut.projectType = 'jsx'
  } else if (argv.standard === true) {
    argOut.projectType = 'standard'
  }

  argOut.targetDir = argv._[0]

  return argOut
}

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function isEmpty(path) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

const recordTemplatedFile = (list, relativePath) => {
  if (relativePath.endsWith('.vitriol')) {
    list.push(relativePath)
  }
}

const copyDirWithTracking = (srcDir, destDir, vitriolFiles, relativeBase) => {
  fs.mkdirSync(destDir, { recursive: true })
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    const relativePath = path.join(relativeBase, entry.name)
    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name)) {
        continue
      }
      copyDirWithTracking(srcPath, destPath, vitriolFiles, relativePath)
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
      recordTemplatedFile(vitriolFiles, relativePath)
    }
  }
}

const copyTemplateContents = (templateRootDir, targetDir) => {
  if (!fs.existsSync(templateRootDir)) {
    return []
  }

  const vitriolFiles = []
  const ignoredRootEntries = new Set(['tutorials', '.devcontainer'])
  const rootEntries = fs.readdirSync(templateRootDir, { withFileTypes: true })

  for (const entry of rootEntries) {
    if (ignoredRootEntries.has(entry.name)) {
      continue
    }

    const srcPath = path.join(templateRootDir, entry.name)
    const destName = renameFiles[entry.name] ?? entry.name
    const destPath = path.join(targetDir, destName)

    if (entry.isDirectory()) {
      copyDirWithTracking(srcPath, destPath, vitriolFiles, destName)
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
      recordTemplatedFile(vitriolFiles, destName)
    }
  }

  return vitriolFiles
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function getTutorialFileName({ projectType, installIonic, language }) {
  const parts = [projectType]
  if (installIonic) {
    parts.push('ionic')
  }
  parts.push(language === 'typescript' ? 'ts' : 'js')
  return `${parts.join('-')}.md`
}

async function init() {
  const argOut = parseArg(argv);

  const argTargetDir = formatTargetDir(argOut.targetDir)
  let targetDir = argTargetDir || defaultTargetDir

  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result;
  try {

    result = await prompts(
      [{
        type: argTargetDir ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir
        },
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () =>
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`) +
          ` is not empty. Remove existing files and continue?`,
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled')
          }
          return null
        },
        name: 'overwriteChecker',
      },
      {
        type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
        name: 'packageName',
        message: reset('Package name:'),
        initial: () => toValidPackageName(getProjectName()),
        validate: (dir) =>
          isValidPackageName(dir) || 'Invalid package.json name',
      },
      {
        type: argOut.projectType ? null : 'select',
        name: 'projectType',
        message: reset('Select a project type:'),
        initial: 0,
        choices: [
          { title: 'Standard', value: 'standard' },
          { title: 'JSX', value: 'jsx' },
        ],
      },
      {
        type: argOut.language ? null : 'select',
        name: 'language',
        message: reset('Select a language:'),
        initial: 0,
        choices: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
        ],
      },
      {
        type: () =>
          argOut.isIonic !== undefined ? null : 'confirm',
        name: 'isIonic',
        initial: defaultIsIonic,
        message: () =>
          `Do you want to include Ionic Framework?`,
      },
      {
        type: () =>
          argOut.isDevContainer !== undefined ? null : 'confirm',
        name: 'isDevContainer',
        initial: defaultIsDevContainer,
        message: () =>
          `Do you want to include devcontainer.json configuration?`,
      },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        },
      },
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  const { overwrite, packageName, isIonic, isDevContainer, language: promptLanguage, projectType: promptProjectType } = result

  const language = argOut.language || promptLanguage || defaultLanguage
  const projectType = argOut.projectType || promptProjectType || defaultProjectType

  const installIonic = argOut.isIonic !== undefined ? argOut.isIonic : isIonic;

  const copyDevContainer = argOut.isDevContainer !== undefined ? argOut.isDevContainer : isDevContainer;

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  console.log(`\nScaffolding ${projectType=='jsx'?'JSX':'Standard'} Vitriol project ${installIonic ? 'with Ionic Framework ' : ''}using ${language === 'typescript' ? 'TypeScript' : 'JavaScript'} in ${root}...`)

  const cdProjectName = path.relative(cwd, root)

  const templateRootDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    'template',
  )
  const templateVitriolFiles = copyTemplateContents(templateRootDir, root)

  const tutorialsDir = path.join(templateRootDir, 'tutorials')
  const tutorialFileName = getTutorialFileName({ projectType, installIonic, language })
  const tutorialSourcePath = path.join(tutorialsDir, tutorialFileName)
  if (fs.existsSync(tutorialSourcePath)) {
    fs.copyFileSync(tutorialSourcePath, path.join(root, 'tutorial.md'))
  }

  const variables = {
    projectName: getProjectName(),
    packageName: packageName || getProjectName(),
    projectType,
    language,
    isIon: installIonic,
    isTs: language === 'typescript',
    isJs: language === 'javascript',
    isJSX: projectType === 'jsx',
    isStd: projectType === 'standard',
    ext: language === 'typescript' ? (projectType === 'jsx' ? 'tsx' : 'ts') : (projectType === 'jsx' ? 'jsx' : 'js')
  }

  processTemplatedFiles(root, variables, templateVitriolFiles)

  if (copyDevContainer) {
    copy(path.resolve(fileURLToPath(import.meta.url), '../../template/.devcontainer'), path.join(root, '.devcontainer'))
    const dcFile = JSON.parse(
      fs.readFileSync(path.join(root, '.devcontainer/devcontainer.json'), 'utf-8'),
    )
    dcFile.name = packageName || getProjectName()
    fs.writeFileSync(path.join(root, '.devcontainer/devcontainer.json'), JSON.stringify(dcFile, null, 2) + '\n')
  }

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(
      `  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

export { formatTargetDir, isValidPackageName, toValidPackageName, pkgFromUserAgent, parseArg, minimistOptions, init }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  init().catch((e) => {
    console.error(e)
  })
}