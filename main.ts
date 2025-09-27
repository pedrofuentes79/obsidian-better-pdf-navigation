import { Plugin } from 'obsidian';

export default class BetterPdfNavigationPlugin extends Plugin {

	private getActivePdfViewer(): any | null {
		const leaves = this.app.workspace.getLeavesOfType('pdf');
		const leaf = leaves.find(l => (l as any).containerEl?.classList?.contains('mod-active')) || leaves[0];
		const view = (leaf?.view as any) || null;
		return view ? (view.viewer?.child?.pdfViewer ?? view.pdfViewer ?? view.viewer ?? null) : null;
	}

	async onload() {
		console.log('Loading Better PDF Navigation plugin');

		this.addCommand({
			id: 'pdf-next-page',
			name: 'PDF: Next Page',
			hotkeys: [{ modifiers: [], key: 'j' }],
			callback: () => {
				this.dispatchCommandToPdfViewer('nextpage');
			}
		});

		this.addCommand({
			id: 'pdf-prev-page',
			name: 'PDF: Previous Page',
			hotkeys: [{ modifiers: [], key: 'k' }],
			callback: () => {
				this.dispatchCommandToPdfViewer('previouspage');
			}
		});

	}

	dispatchCommandToPdfViewer(directionCommand: 'nextpage' | 'previouspage') {
		const pdfViewer = this.getActivePdfViewer();
		if (!pdfViewer) {
			console.log('No active PDF view');
			return;
		}
		try {
			pdfViewer.eventBus?.dispatch?.(directionCommand);
		} catch (error) {
			console.error('Error calling PDF navigation method:', error);
		}
	}

	onunload() {
		console.log('Unloading Better PDF Navigation plugin');
	}
}
