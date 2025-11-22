import { describe, it, expect } from 'vitest'
import minimist from 'minimist'
import { normalizeProjectType, formatTargetDir, isValidPackageName, toValidPackageName, pkgFromUserAgent, parseArg, minimistOptions, getTemplateName } from '../src/index.js'

describe('parseArg', () => {
  it('should parse ionic flag', () => {
    const argv = minimist(['--ionic'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isIonic: true, targetDir: undefined })
  })

  it('should parse ionic short flag', () => {
    const argv = minimist(['-i'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isIonic: true, targetDir: undefined })
  })

  it('should parse no-ionic flag', () => {
    const argv = minimist(['--no-ionic'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isIonic: false, targetDir: undefined })
  })

  it('should parse no-ionic short flag', () => {
    const argv = minimist(['--noi'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isIonic: false, targetDir: undefined })
  })

  it('should parse devcontainer flag', () => {
    const argv = minimist(['--devcontainer'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isDevContainer: true, targetDir: undefined })
  })

  it('should parse devcontainer short flag', () => {
    const argv = minimist(['--dc'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isDevContainer: true, targetDir: undefined })
  })

  it('should parse no-devcontainer flag', () => {
    const argv = minimist(['--no-devcontainer'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isDevContainer: false, targetDir: undefined })
  })

  it('should parse no-devcontainer short flag', () => {
    const argv = minimist(['--nodc'], minimistOptions)
    expect(parseArg(argv)).toEqual({ isDevContainer: false, targetDir: undefined })
  })

  it('should parse typescript flag', () => {
    const argv = minimist(['--typescript'], minimistOptions)
    expect(parseArg(argv)).toEqual({ language: 'typescript', targetDir: undefined })
  })

  it('should parse typescript short flag', () => {
    const argv = minimist(['--ts'], minimistOptions)
    expect(parseArg(argv)).toEqual({ language: 'typescript', targetDir: undefined })
  })

  it('should parse javascript flag', () => {
    const argv = minimist(['--javascript'], minimistOptions)
    expect(parseArg(argv)).toEqual({ language: 'javascript', targetDir: undefined })
  })

  it('should parse javascript short flag', () => {
    const argv = minimist(['--js'], minimistOptions)
    expect(parseArg(argv)).toEqual({ language: 'javascript', targetDir: undefined })
  })

  it('should parse standard flag', () => {
    const argv = minimist(['--standard'], minimistOptions)
    expect(parseArg(argv)).toEqual({ projectType: 'standard', targetDir: undefined })
  })

  it('should parse standard short flag', () => {
    const argv = minimist(['--std'], minimistOptions)
    expect(parseArg(argv)).toEqual({ projectType: 'standard', targetDir: undefined })
  })

  it('should parse jsx flag', () => {
    const argv = minimist(['--jsx'], minimistOptions)
    expect(parseArg(argv)).toEqual({ projectType: 'jsx', targetDir: undefined })
  })

  it('should parse target directory', () => {
    const argv = minimist(['my-app'], minimistOptions)
    expect(parseArg(argv)).toEqual({ targetDir: 'my-app' })
  })

  it('should parse multiple flags', () => {
    const argv = minimist(['my-app', '--ts', '--ionic', '--std'], minimistOptions)
    expect(parseArg(argv)).toEqual({
      targetDir: 'my-app',
      language: 'typescript',
      isIonic: true,
      projectType: 'standard'
    })
  })
})

describe('normalizeProjectType', () => {
  it('should return "standard" for "standard"', () => {
    expect(normalizeProjectType('standard')).toBe('standard')
  })

  it('should return "jsx" for "jsx"', () => {
    expect(normalizeProjectType('jsx')).toBe('jsx')
  })

  it('should return null for invalid types', () => {
    expect(normalizeProjectType('invalid')).toBe(null)
    expect(normalizeProjectType('')).toBe(null)
    expect(normalizeProjectType(null)).toBe(null)
  })

  it('should be case insensitive', () => {
    expect(normalizeProjectType('Standard')).toBe('standard')
    expect(normalizeProjectType('JSX')).toBe('jsx')
  })
})

describe('formatTargetDir', () => {
  it('should trim whitespace', () => {
    expect(formatTargetDir('  my-app  ')).toBe('my-app')
  })

  it('should remove trailing slashes', () => {
    expect(formatTargetDir('my-app/')).toBe('my-app')
    expect(formatTargetDir('my-app//')).toBe('my-app')
  })

  it('should handle undefined/null', () => {
    expect(formatTargetDir(undefined)).toBe(undefined)
  })
})

describe('isValidPackageName', () => {
  it('should return true for valid package names', () => {
    expect(isValidPackageName('my-app')).toBe(true)
    expect(isValidPackageName('@scope/my-app')).toBe(true)
    expect(isValidPackageName('my_app')).toBe(true)
  })

  it('should return false for invalid package names', () => {
    expect(isValidPackageName(' My App ')).toBe(false)
    expect(isValidPackageName('.my-app')).toBe(false)
    expect(isValidPackageName('_my-app')).toBe(false)
  })
})

describe('toValidPackageName', () => {
  it('should convert to valid package name', () => {
    expect(toValidPackageName('My App')).toBe('my-app')
    expect(toValidPackageName('  My App  ')).toBe('my-app')
    expect(toValidPackageName('.my-app')).toBe('my-app')
    expect(toValidPackageName('_my-app')).toBe('my-app')
    expect(toValidPackageName('my@app')).toBe('my-app')
  })
})

describe('pkgFromUserAgent', () => {
  it('should parse npm user agent', () => {
    const ua = 'npm/8.1.0 node/v16.13.0 linux x64'
    expect(pkgFromUserAgent(ua)).toEqual({ name: 'npm', version: '8.1.0' })
  })

  it('should parse yarn user agent', () => {
    const ua = 'yarn/1.22.15 npm/? node/v16.13.0 linux x64'
    expect(pkgFromUserAgent(ua)).toEqual({ name: 'yarn', version: '1.22.15' })
  })

  it('should parse pnpm user agent', () => {
    const ua = 'pnpm/6.20.3 npm/? node/v16.13.0 linux x64'
    expect(pkgFromUserAgent(ua)).toEqual({ name: 'pnpm', version: '6.20.3' })
  })

  it('should return undefined if no user agent', () => {
    expect(pkgFromUserAgent(undefined)).toBe(undefined)
  })
})

describe('getTemplateName', () => {
  it('should return standard template', () => {
    expect(getTemplateName({ projectType: 'standard', isIonic: false, language: 'javascript' })).toBe('standard')
  })

  it('should return standard-ts template', () => {
    expect(getTemplateName({ projectType: 'standard', isIonic: false, language: 'typescript' })).toBe('standard-ts')
  })

  it('should return standard-ionic template', () => {
    expect(getTemplateName({ projectType: 'standard', isIonic: true, language: 'javascript' })).toBe('standard-ionic')
  })

  it('should return standard-ionic-ts template', () => {
    expect(getTemplateName({ projectType: 'standard', isIonic: true, language: 'typescript' })).toBe('standard-ionic-ts')
  })

  it('should return jsx template', () => {
    expect(getTemplateName({ projectType: 'jsx', isIonic: false, language: 'javascript' })).toBe('jsx')
  })

  it('should return jsx-ts template', () => {
    expect(getTemplateName({ projectType: 'jsx', isIonic: false, language: 'typescript' })).toBe('jsx-ts')
  })

  it('should return jsx-ionic template', () => {
    expect(getTemplateName({ projectType: 'jsx', isIonic: true, language: 'javascript' })).toBe('jsx-ionic')
  })

  it('should return jsx-ionic-ts template', () => {
    expect(getTemplateName({ projectType: 'jsx', isIonic: true, language: 'typescript' })).toBe('jsx-ionic-ts')
  })
})
