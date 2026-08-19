import * as vscode from "vscode";

import { mergeDuplicateImports } from "./importMerger";
import { parseImports } from "./importParser";
import { buildSortedImports } from "./importSorter";

// Entry Point.
export function activate(context: vscode.ExtensionContext) {
  // Register Command same as `package.json`
  const disposable = vscode.commands.registerCommand(
    "import-sorter.sortImports",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      await sortImportsInDocument(editor.document);
    },
  );

  const saveListener = vscode.workspace.onWillSaveTextDocument((event) => {
    const enabled = vscode.workspace
      .getConfiguration("importSorter")
      .get<boolean>("sortOnSave");

    if (!enabled) {
      return;
    }

    event.waitUntil(sortImportsInDocument(event.document));
  });

  // Make sure VS Code disposes the command when the extension is deactivated.
  context.subscriptions.push(disposable, saveListener);
}

// Deactivate Extension
export function deactivate() {}

// Sort Function
async function sortImportsInDocument(
  document: vscode.TextDocument,
): Promise<void> {
  // Only For TypeScript
  if (
    document.languageId !== "typescript" &&
    document.languageId !== "typescriptreact"
  ) {
    return;
  }

  const code = document.getText();

  // Gets Configurations from VS Code Settings
  const config = {
    absoluteAliases: vscode.workspace
      .getConfiguration("importSorter")
      .get<string[]>("absoluteAliases") ?? ["@/"],
  };

  // Parse all imports
  const imports = parseImports(code, config);

  if (imports.length === 0) {
    return;
  }

  const firstImport = imports[0];
  const lastImport = imports[imports.length - 1];

  const start = document.positionAt(firstImport.start);
  const end = document.positionAt(lastImport.end);

  // Merge import with same import paths
  const mergedImports = mergeDuplicateImports(imports);

  // Sort all inputs
  const sortedImports = buildSortedImports(mergedImports);

  // Update imports inside Editor
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, new vscode.Range(start, end), sortedImports);
  await vscode.workspace.applyEdit(edit);
}
