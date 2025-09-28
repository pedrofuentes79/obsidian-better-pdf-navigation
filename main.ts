import { Plugin, WorkspaceLeaf, View} from 'obsidian';

type PdfDirection = 'nextpage' | 'previouspage';
interface PdfViewer {
	eventBus?: {
		dispatch?: (command: PdfDirection) => void;
	}
}

interface PdfView extends View {
	// viewer can be null if the obsidian tab has not been "loaded" yet.
	// e.g: if you open obsidian, and it opens with the old tabs you had when closing it,
	// the viewer will be null for those leaves. When you switch to them, the viewer will be loaded.
	viewer: {
		child: {
			pdfViewer: PdfViewer;
		};
	} | null;
}

interface PdfLeaf extends WorkspaceLeaf {
	view: PdfView;
	// This is not declared, but it has it at runtime.
	containerEl: HTMLElement;
}


export default class BetterPdfNavigationPlugin extends Plugin {

	private getActivePdfViewer(): PdfViewer | undefined {
		const leaves = this.app.workspace.getLeavesOfType('pdf');
		const activeLeaf = leaves.find(l => (l as PdfLeaf).containerEl.classList?.contains('mod-active')) || leaves[0];
		const view = activeLeaf?.view as PdfView;
		// if there was no view, just return undefined
		return view?.viewer?.child?.pdfViewer;
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

	dispatchCommandToPdfViewer(directionCommand: PdfDirection) {
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
