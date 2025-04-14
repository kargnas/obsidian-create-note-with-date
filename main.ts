import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, TAbstractFile } from 'obsidian';
import * as moment from 'moment';
// Import JSON files directly
// Import translations
import arCommand from './i18n/ar/command.json';
import arNotice from './i18n/ar/notice.json';
import enCommand from './i18n/en/command.json';
import enNotice from './i18n/en/notice.json';
import esCommand from './i18n/es-ES/command.json';
import esNotice from './i18n/es-ES/notice.json';
import jaCommand from './i18n/ja/command.json';
import jaNotice from './i18n/ja/notice.json';
import koCommand from './i18n/ko/command.json';
import koNotice from './i18n/ko/notice.json';
import zhCNCommand from './i18n/zh-CN/command.json';
import zhCNNotice from './i18n/zh-CN/notice.json';
import zhTWCommand from './i18n/zh-TW/command.json';
import zhTWNotice from './i18n/zh-TW/notice.json';

type TranslationData = {
	COMMANDS: typeof enCommand;
	NOTICES: typeof enNotice;
};

type TranslationsMap = {
	[key: string]: TranslationData;
};

// Language code mapping
const LANG_CODE_MAP: { [key: string]: string } = {
	'ar': 'ar',
	'en': 'en',
	'es-ES': 'es',
	'ja': 'ja',
	'ko': 'ko',
	'zh-CN': 'zh',
	'zh-TW': 'zh-TW'
};

const translations: TranslationsMap = {
	ar: {
		COMMANDS: arCommand,
		NOTICES: arNotice
	},
	en: {
		COMMANDS: enCommand,
		NOTICES: enNotice
	},
	es: {
		COMMANDS: esCommand,
		NOTICES: esNotice
	},
	ja: {
		COMMANDS: jaCommand,
		NOTICES: jaNotice
	},
	ko: {
		COMMANDS: koCommand,
		NOTICES: koNotice
	},
	zh: {
		COMMANDS: zhCNCommand,
		NOTICES: zhCNNotice
	},
	'zh-TW': {
		COMMANDS: zhTWCommand,
		NOTICES: zhTWNotice
	}
};

interface Translations {
	COMMANDS: {
		CREATE_TODAY_NOTE: string;
	};
	NOTICES: {
		FILE_EXISTS: string;
		FILE_CREATED: string;
		FOLDER_NOT_FOUND: string;
		ERROR_CREATING_FILE: string;
	};
}

export default class KarsPlugin extends Plugin {
	getText(key: string, vars: Record<string, string> = {}): string {
		// Get language setting from localStorage
		const rawLanguage = window.localStorage.getItem('language') || 'en';
		const language = LANG_CODE_MAP[rawLanguage] || rawLanguage;
		const currentTranslations = translations[language] || translations.en;
		
		const keys = key.split('.');
		let value: any = currentTranslations;
		for (const k of keys) {
			if (!value || !value[k]) return key;
			value = value[k];
		}

		if (typeof value !== 'string') return key;

		return value.replace(/{([^}]+)}/g, (_: string, name: string) => vars[name] || `{${name}}`);
	}

	async onload() {
		// Add command for creating today's note
		this.addCommand({
			id: 'create-today-note',
			name: this.getText('COMMANDS.CREATE_TODAY_NOTE'),
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					if (!checking) {
						this.createTodayNote(activeFile);
					}
					return true;
				}
				return false;
			}
		});
	}

	onunload() {
		// Cleanup when plugin is disabled
	}

	// Function to create a new note with today's date
	async createTodayNote(activeFile: TFile) {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		const formattedDate = `${year}-${month}-${day}`;

		// Get parent folder path of the current file
		const parentFolder = activeFile.parent;
		if (!parentFolder) {
			new Notice(this.getText('NOTICES.FOLDER_NOT_FOUND'));
			return;
		}

		// Create new file path
		const newFilePath = `${parentFolder.path}/${formattedDate}.md`;

		try {
			// Check if file already exists
			const existingFile = this.app.vault.getAbstractFileByPath(newFilePath);
			if (existingFile) {
				new Notice(this.getText('NOTICES.FILE_EXISTS', { filename: `${formattedDate}.md` }));
				return;
			}

			// Create new file
			await this.app.vault.create(newFilePath, '');
			new Notice(this.getText('NOTICES.FILE_CREATED', { filename: `${formattedDate}.md` }));

			// Open the newly created file
			const newFile = this.app.vault.getAbstractFileByPath(newFilePath);
			if (newFile instanceof TFile) {
				await this.app.workspace.getLeaf().openFile(newFile);
			}
		} catch (error) {
			new Notice(this.getText('NOTICES.ERROR_CREATING_FILE', { error: error.message }));
		}
	}
}