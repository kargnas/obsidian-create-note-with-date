# Environment
You are an AI coding agent helping with Obsidian plugin development. You have access to specialized tools for file operations, code analysis, and project management.

# Language
- Default conversation language: Korean

# Rules

## Policy
- NEVER say "I found the problem!" unless the problem is 99% solved
- NEVER use sequential thinking MCP in the Plan mode
- NEVER `git checkout` without the user's confirmation. Ask to the user before do that

## Code Quality

### Before Committing
- Before you commit to the git, or after you finish a task, you must follow the guidelines below:
- You need to watch the `git status`, and make sure if there is no more unnecessary code, and see if strictly followed my prompts. Change your persona as critical code-reviewer, and blame code if there is some code that doesn't need. Then tell to the user which code is unnecessary and removable at the summary.
- ALWAYS write human-readable code which is easy to understand and maintain even after a year when you look back. You can use any method to achieve this, such as using descriptive variable names, commenting your code, and writing modular code.
- You can easily delete code, functions or files if you are sure that it is not needed anymore. We have git, so you never need to worry about losing code.

### Build Verification
- Make sure run and build success
- For JavaScript/TypeScript edits, you must ALWAYS run `npm run build` to make sure there is no error when build. If you find an error, you must fix it and run build again.

### Linting
- Run ESLint before committing: `npx eslint main.ts` (or relevant source files)
- Fix all linting errors before committing
- Follow the project's ESLint configuration in `.eslintrc`

### Testing
- This project does not have automated tests yet. If you add tests, you must run them and make sure they pass.

## Concise
- Keep your response detailed, including your intention, purpose and goals after coding done. I need to understand your private thoughts too.
- Use emoji and Markdown to make more readable. Only for readability since you can't draw image in the chat.

## UI Writing Style
- UI messages should be in Korean
- Follow the existing i18n structure in `i18n/` directory
- All user-facing strings should be in the JSON files under `i18n/{lang}/`

## Coding Standards

### Localization
- Use sentence case for command names (e.g., `Create new note (Today's date)`) instead of Title Case
- All UI strings must be defined in i18n JSON files

### Naming Conventions
- Use kebab-case for file names (e.g., `my-component.ts`)
- Use camelCase for variables and function names (e.g., `myVariable`, `myFunction()`)
- Use UpperCamelCase (PascalCase) for classes, types, and interfaces (e.g., `MyClass`, `MyInterface`)
- Use ALL_CAPS for constants and enum values (e.g., `MAX_COUNT`, `Color.RED`)

### File Organization
- Group related functionality into modules
- Use index files to simplify imports
- Keep main plugin logic in `main.ts`
- Store translations in `i18n/{lang}/` directory with JSON files

### Code Style
- Prefer `const` over `let` when variables won't be reassigned
- Use arrow functions for better lexical scoping and concise syntax
- Utilize TypeScript's type system fully: use types over interfaces, and use generics where appropriate
- Implement error handling with proper error types
- Write pure functions where possible to improve testability and reduce side effects
- Avoid using `any` type - use `unknown` or specific types instead

### Best Practices
- Follow the Single Responsibility Principle
- Use dependency injection to improve testability and flexibility
- Implement proper error handling and logging
- Use async/await for asynchronous operations instead of callbacks or raw promises
- Leverage TypeScript's strict mode for enhanced type checking

### Documentation
- Use JSDoc comments for functions, classes, and complex types
- Include examples in documentation where appropriate
- Keep README files up-to-date with setup instructions, usage examples, and contribution guidelines

## Project Specifics

### Obsidian Plugin Development
- This is an Obsidian plugin that creates a new note with today's date
- Plugin extends the base `Plugin` class from `obsidian` package
- Use the Obsidian API for file operations, workspace management, and UI interactions
- Plugin commands are registered in the `onload()` method
- Plugin cleanup should be done in the `onunload()` method

### i18n System
- Translations are stored in `i18n/{lang}/` directory
- Each language has `command.json` for UI commands and `notice.json` for user notifications
- Language detection uses `window.localStorage.getItem('language')`
- Fallback to English if translation is not available
- Use `getText(key: string, vars: Record<string, string> = {})` method to retrieve translated strings
- Supported languages: Arabic (ar), English (en), Spanish (es-ES), Japanese (ja), Korean (ko), Chinese Simplified (zh-CN), Chinese Traditional (zh-TW)

### Build System
- Use `npm run dev` for development mode with watch
- Use `npm run build` for production build
- Build process: TypeScript compilation with `tsc` + esbuild bundling
- Configuration files: `tsconfig.json`, `esbuild.config.mjs`

### Release Process
- Automated release script: `npm run release` (patch), `npm run release:minor`, `npm run release:major`
- Release script updates: package.json, manifest.json, versions.json
- Creates git commit and tags version
- Pushes compiled files (main.js, manifest.json, styles.css) to GitHub
- Version bump script: `version-bump.mjs`
- **GitHub Actions Auto-Release**: 
  - Automatically triggered 10 minutes after a push to the `main` branch.
  - If a new push occurs within the 10-minute window, the previous release task is cancelled.
  - Can be manually triggered via GitHub Actions `workflow_dispatch`.
  - Skips execution if the commit message already contains `chore: release`.

### Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript 4.7.4
- **Package Manager**: npm
- **Build Tool**: esbuild 0.17.3
- **Linter**: ESLint with TypeScript support
- **Dependencies**: moment (for date handling, currently unused)

### Directory Structure
```
.
├── i18n/                 # Internationalization files
│   ├── ar/              # Arabic
│   ├── en/              # English
│   ├── es-ES/           # Spanish
│   ├── ja/              # Japanese
│   ├── ko/              # Korean
│   ├── zh-CN/           # Chinese Simplified
│   └── zh-TW/           # Chinese Traditional
├── main.ts              # Main plugin file
├── manifest.json        # Obsidian plugin manifest
├── package.json          # Project dependencies and scripts
├── esbuild.config.mjs   # Build configuration
├── tsconfig.json        # TypeScript configuration
└── styles.css           # Plugin styles
```

### Git Workflow
- Main branch is the production branch
- Create feature branches from main for new features
- Use conventional commit messages
- PRs are preferred over direct commits to main
- Recent history shows automated releases with version tags

### Restrictions & Avoid
- DO NOT use `any` type - use `unknown` or specific types
- DO NOT use `moment` library - use native Date API (moment is deprecated and unused)
- DO NOT ignore ESLint errors
- DO NOT commit code without running `npm run build` first
- DO NOT add external dependencies without necessity
- DO NOT modify manifest.json manually - use the release script
- DO NOT hardcode strings - use the i18n system

### Mandatory Actions
- ALWAYS run `npm run build` after any TypeScript changes
- ALWAYS run `npx eslint main.ts` before committing
- ALWAYS update i18n files when adding new user-facing strings
- ALWAYS test in Obsidian before releasing
- ALWAYS use the automated release script for version updates
- MUST update existing AGENTS.md when you have done every task

### Development Environment Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development mode with watch
4. Build for production: `npm run build`
5. For linting: `npx eslint main.ts`
6. Load plugin in Obsidian: Copy built files to `.obsidian/plugins/obsidian-create-note-with-date/`

### Codebase Understanding
Run `tree` command to explore the full directory structure and understand file organization better.

## Git Commit Rules
- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`
- Recent examples:
  - `chore: release 0.2.5`
  - `Remove 'v' prefix from version strings in release script`
  - `Add automated release script and documentation for version management`
- Attach credit to commits:
  - `> Co-authored-by: opencode (oMo, vibe-kanban) <no-reply@opencode.ai>`
