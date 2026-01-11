# Create Note with Date

An Obsidian plugin that helps you quickly create daily notes with today's date. Perfect for daily journals, meeting notes, or any date-based note-taking workflow.

## ✨ Features

- **One-click note creation**: Create a new note with today's date (YYYY-MM-DD format) in the current directory
- **Automatic opening**: Newly created notes open automatically for immediate editing
- **Multi-language support**: Available in 7 languages (English, Korean, Japanese, Spanish, Arabic, Chinese Simplified/Traditional)
- **Smart language detection**: Automatically detects your system language
- **Lightweight**: No external dependencies or database required

## 🚀 Installation

### From Obsidian Community Plugins (Recommended)

1. Open **Settings** → **Community Plugins**
2. Disable **Safe Mode**
3. Click **Browse** and search for "Create Note with Date"
4. Click **Install**
5. Enable the plugin

### Manual Installation

1. Download the latest [release](../../releases)
2. Extract files to your vault's `.obsidian/plugins/obsidian-create-note-with-date/` directory
3. Reload Obsidian (Ctrl+R / Cmd+R)
4. Enable the plugin in **Settings** → **Community Plugins**

## 📖 Usage

1. Open any note in the directory where you want to create a dated note
2. Press `Cmd/Ctrl + P` to open the **Command Palette**
3. Search for "Create note with today's date in this directory"
4. Press Enter

A new note named `YYYY-MM-DD.md` will be created in the same directory.

## 🌍 Supported Languages

- 🇺🇸 **English** (default)
- 🇰🇷 **Korean** (한국어)
- 🇯🇵 **Japanese** (日本語)
- 🇪🇸 **Spanish** (Español)
- 🇸🇦 **Arabic** (العربية)
- 🇨🇳 **Chinese Simplified** (简体中文)
- 🇹🇼 **Chinese Traditional** (繁體中文)

The plugin automatically detects your system's language preference from Obsidian settings.

## 🛠️ Development

### Prerequisites

- Node.js 16.x or higher
- npm (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd obsidian-create-note-with-date

# Install dependencies
npm install

# Start development mode with watch
npm run dev
```

### Build & Test

```bash
# Build for production
npm run build

# Lint code
npx eslint main.ts

# Load plugin in Obsidian for testing
# Copy built files to your vault's plugin directory
cp main.js manifest.json styles.css ~/.obsidian/plugins/obsidian-create-note-with-date/
```

### Project Structure

```
obsidian-create-note-with-date/
├── i18n/              # Internationalization files
│   ├── en/             # English translations
│   ├── ko/             # Korean translations
│   └── ...             # Other languages
├── main.ts             # Main plugin logic
├── manifest.json       # Obsidian plugin manifest (auto-generated)
├── package.json        # Dependencies and scripts
├── esbuild.config.mjs # Build configuration
└── tsconfig.json      # TypeScript configuration
```

The plugin follows standard Obsidian plugin conventions with no complex custom architecture.

## 📦 Release Process

Automated version management scripts are included:

```bash
# Patch version (e.g., 0.2.2 → 0.2.3)
npm run release

# Minor version (e.g., 0.2.2 → 0.3.0)
npm run release:minor

# Major version (e.g., 0.2.2 → 1.0.0)
npm run release:major
```

The release script automatically:
- Updates version numbers in `package.json` and `manifest.json`
- Builds the project
- Creates a Git commit with version change
- Adds a version tag
- Pushes compiled files to GitHub releases

### 🤖 Automated Release (GitHub Actions)

A GitHub Action is configured to automate this process:
- **Trigger**: Any push to the `main` branch
- **Delay**: 10 minutes (to allow for quick fixes or additional commits)
- **Cancellation**: If a new push occurs during the 10-minute wait, the previous release job is cancelled and a new one starts
- **Manual Trigger**: Can be executed manually via the "Actions" tab in GitHub

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository (optional, you can also create a branch directly)
2. **Create a new branch**: `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Test thoroughly**:
   - Run `npm run build` to ensure no build errors
   - Run `npx eslint main.ts` to check code quality
   - Test in Obsidian with actual usage
5. **Commit** with conventional format: `feat: add new feature` or `fix: resolve bug`
6. **Create a Pull Request** (preferred) or commit directly to main

### Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `style:` - Code style changes (formatting, etc.)
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

Example:
```
feat: add support for custom date format

> Co-authored-by: opencode (oMo, vibe-kanban) <no-reply@opencode.ai>
```

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - AI agent coding instructions and project guidelines
- **[README.ai-ready.md](README.ai-ready.md)** - Quick setup guide for AI agent development
- **[Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)** - Official Obsidian documentation

## 📄 License

MIT License - See [LICENSE.md](LICENSE.md) for details.

## ⚠️ Note

This is an OP.GG internal project. If you leave OP.GG, please delete this repository from your computer.

## 🐛 Troubleshooting

**Plugin not appearing after installation?**
- Make sure **Safe Mode** is disabled
- Try reloading Obsidian (Ctrl+R / Cmd+R)
- Check the Developer Console (Ctrl+Shift+I / Cmd+Option+I) for errors

**Date format is wrong?**
- The plugin uses your system's date format settings
- Ensure your system language is set correctly

**Want to add a new language?**
- Create a new directory in `i18n/` with language code
- Add `command.json` and `notice.json` files
- Import and register in `main.ts`
- Submit a PR with your translation!

---

**Made with ❤️ by OP.GG**
