# Obsidian Better PDF Navigation

A minimal Obsidian plugin for keyboard shortcuts to navigate PDF pages.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the plugin:
   ```bash
   npm run build
   ```

3. Copy the plugin files to your Obsidian vault:
   - Copy `main.js` and `manifest.json` to `.obsidian/plugins/obsidian-better-pdf-navigation/`

4. Enable the plugin in Obsidian settings.

## Debugging the Obsidian API

This plugin includes extensive debugging capabilities to explore the Obsidian API. Here's how to use them:

### 1. Open Developer Console

In Obsidian:
- Press `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open the developer console
- Go to the Console tab

### 2. Use the Debug Commands

The plugin adds several commands you can access via the command palette (`Ctrl+P`):

- **"Debug Obsidian API"**: Logs the main app structure and available components
- **"Debug Current View"**: Logs information about the currently active view (especially useful when viewing a PDF)
- **"PDF: Next Page"** / **"PDF: Previous Page"**: Test PDF navigation (with debug logs)

### 3. What You'll See in Console Logs

When you run the debug commands, look for:

#### App Structure
```
App structure: {
  vault: Vault {...},
  workspace: Workspace {...},
  metadataCache: MetadataCache {...},
  fileManager: FileManager {...}
}
```

#### PDF-Related Information
- Available workspace leaves
- PDF viewer methods and properties
- File manager details

#### PDF View Methods
When viewing a PDF, the plugin will log available methods like:
- `nextPage()`
- `previousPage()`
- `goToPage()`
- `getCurrentPage()`
- `getPageCount()`

### 4. Manual Exploration

You can also manually explore in the console:

```javascript
// Get the app instance
app = require('obsidian').app;

// Check current view
activeLeaf = app.workspace.activeLeaf;
console.log('Active leaf:', activeLeaf);

// If it's a PDF view, explore its methods
if (activeLeaf && activeLeaf.view && activeLeaf.view.getViewType() === 'pdf') {
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(activeLeaf.view)));
}
```

### 5. Finding PDF Navigation Methods

The key is to find the PDF viewer's API. Common patterns:

1. **Direct Methods**: `nextPage()`, `previousPage()`
2. **Document Access**: `pdfDocument.nextPage()`, `viewer.nextPage()`
3. **Event Dispatch**: `dispatchEvent(new Event('nextpage'))`

### 6. Hotkey Setup

Once you find the working methods, you can add hotkeys in Obsidian settings or directly in the plugin:

```typescript
this.addCommand({
  id: 'pdf-next-page',
  name: 'PDF: Next Page',
  hotkeys: [{ modifiers: ['Ctrl'], key: 'PageDown' }],
  callback: () => {
    // Your working navigation code here
  }
});
```

## Development Tips

- Use the console to experiment with different method calls
- Check the Obsidian API documentation: https://github.com/obsidianmd/obsidian-api
- Look at existing PDF plugins for inspiration
- The PDF viewer might be using PDF.js under the hood

## Troubleshooting

- Make sure you're viewing a PDF file when testing navigation
- Check console for errors when methods are called
- Some methods might be on nested objects (e.g., `view.pdfViewer.nextPage()`)
