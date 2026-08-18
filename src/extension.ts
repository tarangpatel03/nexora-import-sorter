import * as vscode from "vscode";

import { parseImports } from "./importParser";
import { buildSortedImports } from "./importSorter";
import { mergeDuplicateImports } from "./importMerger";

/**
 * Called by VS Code when our extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
  /**
   * Register the "Import Sorter: Sort Imports" command.
   *
   * The command ID must match the command registered in package.json.
   */

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

/**
 * Called by VS Code when the extension is deactivated.
 */
export function deactivate() {}

// Sort Function
async function sortImportsInDocument(
  document: vscode.TextDocument,
): Promise<void> {
  if (
    document.languageId !== "typescript" &&
    document.languageId !== "typescriptreact"
  ) {
    return;
  }

  const code = document.getText();

  const config = {
    absoluteAliases: vscode.workspace
      .getConfiguration("importSorter")
      .get<string[]>("absoluteAliases") ?? ["@/"],
  };

  const imports = parseImports(code, config);

  if (imports.length === 0) {
    return;
  }

  const firstImport = imports[0];
  const lastImport = imports[imports.length - 1];

  const start = document.positionAt(firstImport.start);
  const end = document.positionAt(lastImport.end);

  const mergedImports = mergeDuplicateImports(imports);

  const sortedImports = buildSortedImports(mergedImports);

  const edit = new vscode.WorkspaceEdit();

  edit.replace(document.uri, new vscode.Range(start, end), sortedImports);

  await vscode.workspace.applyEdit(edit);
}
