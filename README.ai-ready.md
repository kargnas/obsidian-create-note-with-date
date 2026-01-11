# AI Agent Development Setup Guide

> 📖 **Purpose**: This guide helps you (human coders) set up the development environment quickly for working with AI agents. It's designed to be straightforward, even if you're new to AI-assisted development.

---

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development
npm run dev
```

---

## 📋 Prerequisites

- **Node.js**: Version 16.x or higher
- **npm**: Comes with Node.js
- **Obsidian**: For testing the plugin

---

## 🏗️ Project Structure

```
obsidian-create-note-with-date/
├── main.ts              # Main plugin file (core logic)
├── i18n/               # Translations for 7 languages
│   ├── en/              # English
│   ├── ko/              # Korean
│   └── ...              # Other languages
├── manifest.json        # Obsidian plugin manifest (auto-generated)
├── package.json         # Dependencies and scripts
├── AGENTS.md           # AI agent instructions
└── README.ai-ready.md   # This file
```

---

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development mode with watch |
| `npm run build` | Build for production |
| `npx eslint main.ts` | Lint code |
| `npm run release` | Patch version release |

---

## 🧪 Testing the Plugin

Since there's no automated test suite yet:

1. **Build the plugin**: `npm run build`
2. **Load in Obsidian**:
   ```
   cp main.js manifest.json styles.css ~/.obsidian/plugins/obsidian-create-note-with-date/
   ```
3. **Enable plugin** in Obsidian Settings → Community Plugins

---

## 🤖 Working with AI Agents

### When an AI Agent Makes Changes

1. **Review the changes**: Check `git diff` to see what was modified
2. **Run build**: `npm run build` (mandatory)
3. **Lint check**: `npx eslint main.ts` (mandatory)
4. **Test manually**: Try the plugin in Obsidian

### Common AI Agent Workflows

| Task | AI Agent Action | Your Action |
|------|-----------------|-------------|
| Fix bug | Modifies `main.ts` | Run `npm run build`, test in Obsidian |
| Add feature | Adds code + i18n strings | Review, build, test |
| Refactor | Restructures code | Review thoroughly, build, test |

---

## 📝 Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript support
- **Build**: Must pass `npm run build` before commit
- **Comments**: Use descriptive variable names instead of excessive comments

---

## 🌍 Adding New Translations

To add a new language:

1. Create directory: `i18n/{lang}/`
2. Add `command.json` and `notice.json`
3. Import in `main.ts`
4. Add to `translations` map and `LANG_CODE_MAP`

Example structure:
```json
// i18n/fr/command.json
{
  "CREATE_TODAY_NOTE": "Create note with today's date"
}

// i18n/fr/notice.json
{
  "FILE_CREATED": "File {filename} created"
}
```

---

## 🐛 Debugging

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check TypeScript errors, fix imports |
| Plugin not loading | Check manifest.json matches package.json version |
| Translation missing | Check `i18n/{lang}/` files exist and are imported |

### Debug Mode

Open Obsidian Developer Console (Ctrl+Shift+I / Cmd+Option+I) to see:
- Plugin load errors
- Runtime errors
- Console logs (if any)

---

## 📚 Useful Resources

- [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [esbuild Documentation](https://esbuild.github.io/)

---

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes
3. Run `npm run build` and `npx eslint main.ts`
4. Test in Obsidian
5. Commit with conventional format: `feat: description`
6. Create PR (preferred) or commit directly to main

---

## ⚙️ Environment Variables

**None required** - This is a client-side Obsidian plugin with:
- ✅ No database connections
- ✅ No external API calls
- ✅ No authentication needed
- ✅ No sensitive data handling

---

## 📄 License

MIT License - See LICENSE.md for details.

---

## ❓ Quick FAQ

**Q: Do I need to install anything else?**
A: No, just Node.js and npm. Obsidian is needed only for testing.

**Q: Can I use this with Codex Cloud?**
A: Yes! This plugin is perfect for AI agent workflows - no external dependencies.

**Q: How do I release a new version?**
A: Run `npm run release` for patch, `npm run release:minor` for minor update.

---

**Need help?** Check AGENTS.md for AI agent-specific instructions.
