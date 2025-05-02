# Create Note with Date

This Obsidian plugin allows you to create a new note with today's date in the current directory. It's perfect for daily notes, journals, or any situation where you need to create date-based notes quickly.

## Features

-   Create a new note with today's date (YYYY-MM-DD format) in the current directory
-   Automatically opens the newly created note
-   Supports both English and Korean languages
-   Language automatically detected from your system settings

## Usage

1. Open any note in the directory where you want to create a new dated note
2. Use the command palette (Cmd/Ctrl + P) and search for "Create Note with Date in This Directory"
3. A new note will be created with today's date as the filename (e.g., `2025-04-15.md`)

## Installation

### From Obsidian

1. Open Settings in Obsidian
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Create Note with Date"
4. Install the plugin and enable it

### Manual Installation

1. Download the latest release from the releases page
2. Extract the files to your vault's `.obsidian/plugins/create-note-with-date/` directory
3. Reload Obsidian
4. Enable the plugin in Settings -> Community Plugins

## Language Support

The plugin automatically detects your system language and displays messages in either:

-   English (default)
-   Korean (한국어)
-   Japanese (日本語)
-   Spanish (Español)
-   Arabic (العربية)
-   Chinese (简体中文)
-   Chinese (繁體中文)

## Development

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to start compilation in watch mode

## Release Process

This project includes an automated release script that makes it easy to version and publish updates:

```bash
# Update patch version (e.g., 0.2.2 → 0.2.3)
npm run release

# Update minor version (e.g., 0.2.2 → 0.3.0)
npm run release:minor

# Update major version (e.g., 0.2.2 → 1.0.0)
npm run release:major
```

The release script automatically:
- Updates version numbers in package.json and manifest.json
- Builds the project
- Creates a Git commit with the version change
- Adds a version tag
- Pushes the compiled files (main.js, manifest.json, styles.css) to GitHub

## License

MIT
