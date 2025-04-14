import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, TAbstractFile } from 'obsidian';
import * as moment from 'moment';
// Import JSON files directly
import koTranslations from './i18n/ko.json';
import enTranslations from './i18n/en.json';

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
		const language = window.localStorage.getItem('language') || 'en';
		const translations = language === 'ko' ? koTranslations : enTranslations;
		
		const keys = key.split('.');
		let value: any = translations;
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