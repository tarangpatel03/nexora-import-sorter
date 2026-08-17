// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "import-sorter" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('import-sorter.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from Import Sorter!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from "vscode";

import { parseImports } from "./importParser";
import { buildSortedImports } from "./importSorter";

/**
 * Called by VS Code when our extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("Nexora Import Sorter activated");
  /**
   * Register the "Import Sorter: Sort Imports" command.
   *
   * The command ID must match the command registered in package.json.
   */
  const disposable = vscode.commands.registerCommand(
    "import-sorter.sortImports",
    async () => {
      console.log("Sort command executed");
      // Get the currently active editor.
      const editor = vscode.window.activeTextEditor;

      // Nothing to do if no editor is currently open.
      if (!editor) {
        return;
      }

      const document = editor.document;

      //! This extension only supports TypeScript and TSX files.
      if (
        document.languageId !== "typescript" &&
        document.languageId !== "typescriptreact"
      ) {
        vscode.window.showWarningMessage(
          "Import Sorter only supports TypeScript and TSX files.",
        );

        return;
      }

      // Get the complete source code of the current file.
      const code = document.getText();

      // Parse all static imports from the source code.
      const imports = parseImports(code);

      // Nothing to sort if the file doesn't contain imports.
      if (imports.length === 0) {
        return;
      }

      // Find the range occupied by all imports.
      const firstImport = imports[0];
      const lastImport = imports[imports.length - 1];

      const start = document.positionAt(firstImport.start);
      const end = document.positionAt(lastImport.end);

      // Group, sort, and format the imports.
      const sortedImports = buildSortedImports(imports);

      // Create a VS Code edit operation.
      const edit = new vscode.WorkspaceEdit();

      // Replace the original import block with the sorted version.
      edit.replace(document.uri, new vscode.Range(start, end), sortedImports);

      // Apply the change to the active document.
      await vscode.workspace.applyEdit(edit);
    },
  );

  // Make sure VS Code disposes the command when the extension is deactivated.
  context.subscriptions.push(disposable);
}

/**
 * Called by VS Code when the extension is deactivated.
 */
export function deactivate() {}
