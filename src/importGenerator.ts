import { ImportStatement } from "./types";

function generateNamedImports(names: string[], isMultiline: boolean): string {
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

  if (isMultiline) {
    return `{\n${sortedNames.map((name) => `  ${name},`).join("\n")}\n}`;
  }

  return `{ ${sortedNames.join(", ")} }`;
}

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
    importClause = `${defaultImport}, ${generateNamedImports(
      namedImports,
      importItem.isMultiline,
    )}`;
  }

  // Default only
  else if (defaultImport) {
    importClause = defaultImport;
  }

  // Named only
  else if (namedImports?.length) {
    importClause = generateNamedImports(namedImports, importItem.isMultiline);
  }

  return `import ${typePrefix}${importClause} from "${source}";`;
}
