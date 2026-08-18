import { ImportStatement } from "./types";

export function generateImportText(importItem: ImportStatement): string {
  const { source, kind, defaultImport, namespaceImport, namedImports } =
    importItem;

  if (importItem.hasNamedImportAlias) {
    return importItem.text;
  }

  // Side effect imports
  if (importItem.group === "sideEffect") {
    return `import "${source}";`;
  }

  const typePrefix = kind === "type" ? "type " : "";

  let importClause = "";

  // Namespace import
  if (namespaceImport) {
    importClause = `* as ${namespaceImport}`;
  }

  // Default + named import
  else if (defaultImport && namedImports?.length) {
    importClause = `${defaultImport}, { ${[...namedImports]
      .sort((a, b) => a.localeCompare(b))
      .join(", ")} }`;
  }

  // Default only
  else if (defaultImport) {
    importClause = defaultImport;
  }

  // Named only
  else if (namedImports?.length) {
    importClause = `{ ${[...namedImports]
      .sort((a, b) => a.localeCompare(b))
      .join(", ")} }`;
  }

  return `import ${typePrefix}${importClause} from "${source}";`;
}
