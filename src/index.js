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

const renameFiles = {
  _gitignore: '.gitignore',
}

const partialFiles = ['README.md', 'vitest.config.js']

const adjustPartialFileExtension = (fileName, language) => {
  if (language !== 'typescript') return fileName
  if (fileName.endsWith('.jsx')) return fileName.replace(/\.jsx$/, '.tsx')
  if (fileName.endsWith('.js')) return fileName.replace(/\.js$/, '.ts')
  return fileName
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
  }
  if (argv.javascript === true) {
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

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function getTemplateName({ projectType, isIonic, language }) {
  return `${projectType}${isIonic ? '-ionic' : ''}${language === 'typescript' ? '-ts' : ''}`
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

  console.log(`\nScaffolding ${projectType} Vitriol project ${installIonic ? 'with Ionic Framework ' : ''}using ${language === 'typescript' ? 'TypeScript' : 'JavaScript'} in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template/${getTemplateName({ projectType, isIonic: installIonic, language })}`,
  )

  const write = (file, content) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }
  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  )

  pkg.name = packageName || getProjectName()

  write('package.json', JSON.stringify(pkg, null, 2) + '\n')

  const cdProjectName = path.relative(cwd, root)

  // copy all file and folder from commun folder
  const commonTemplateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template/commun`,
  )
  if (fs.existsSync(commonTemplateDir)) {
    const commonFiles = fs.readdirSync(commonTemplateDir)
    for (const file of commonFiles) {
      const targetPath = path.join(root, renameFiles[file] ?? file)
      copy(path.join(commonTemplateDir, file), targetPath)
    }
  }

  // update partial files
  const variables = {
    projectName: getProjectName(),
    packageName: packageName || getProjectName(),
    projectType,
    language,
    installIonic
  }

  for (const file of partialFiles) {
    const originalFilePath = path.join(root, file)
    if (fs.existsSync(originalFilePath)) {
      let content = fs.readFileSync(originalFilePath, 'utf-8')
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value)
      }

      const conditionalRegex = /([ \t]*)\/\/ if\s+(.+?)\s*[\r\n]+([\s\S]*?)(?:[ \t]*)\/\/ end\s+\2\s*(?:\r?\n)?/g
      const evaluateConditionalBlocks = (input) => {
        const evaluateBlock = (match, _indent, condition, blockContent) => {
          try {
            const check = new Function('projectType', 'installIonic', 'language', `return ${condition}`)
            return check(projectType, installIonic, language) ? blockContent : ''
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

      content = evaluateConditionalBlocks(content)
      const adjustedFile = adjustPartialFileExtension(file, language)
      const adjustedFilePath = path.join(root, adjustedFile)
      if (adjustedFilePath !== originalFilePath) {
        fs.renameSync(originalFilePath, adjustedFilePath)
      }

      fs.writeFileSync(adjustedFilePath, content)
    }
  }

  if (copyDevContainer) {
    copy(path.resolve(fileURLToPath(import.meta.url), '../../template/.devcontainer'), path.join(root, '.devcontainer'))
    const dcFile = JSON.parse(
      fs.readFileSync(path.join(root, '.devcontainer/devcontainer.json'), 'utf-8'),
    )
    dcFile.name = packageName || getProjectName()
    write('.devcontainer/devcontainer.json', JSON.stringify(dcFile, null, 2) + '\n')
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

export { formatTargetDir, isValidPackageName, toValidPackageName, pkgFromUserAgent, parseArg, minimistOptions, getTemplateName, init }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  init().catch((e) => {
    console.error(e)
  })
}