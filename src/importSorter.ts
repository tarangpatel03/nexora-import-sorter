import { generateImportText } from "./importGenerator";
import { ImportStatement } from "./types";

// Sort import
function sortImports(imports: ImportStatement[]) {
  return imports.sort((a, b) => {
    if (a.hasNamedImportAlias || b.hasNamedImportAlias) {
      return a.start - b.start;
    }

    return a.source.localeCompare(b.source);
  });
}

// Group them
function formatGroup(title: string, imports: ImportStatement[]): string {
  // Don't create an empty section.
  if (imports.length === 0) {
    return "";
  }

  // Sort imports within this group alphabetically.
  const sortedImports = sortImports(imports);

  return [
    ...sortedImports.map((importItem) => generateImportText(importItem)),
  ].join("\n");
}

//! The order of these groups is intentional.
//! Do not change it unless the import hierarchy changes.
export function buildSortedImports(imports: ImportStatement[]): string {
  // Separate imports into their four categories.

  const sideEffectImports = imports.filter(
    (importItem) =>
      importItem.group === "sideEffect" && importItem.kind === "runtime",
  );

  const libraryImports = imports.filter(
    (importItem) =>
      importItem.group === "library" && importItem.kind === "runtime",
  );

  const absoluteImports = imports.filter(
    (importItem) =>
      importItem.group === "absolute" && importItem.kind === "runtime",
  );

  const relativeImports = imports.filter(
    (importItem) =>
      importItem.group === "relative" && importItem.kind === "runtime",
  );

  const typeImports = imports.filter(
    (importItem) => importItem.kind === "type",
  );

  const groups = [
    formatGroup("Side Effect Imports", sideEffectImports),
    formatGroup("Library Imports", libraryImports),
    formatGroup("Absolute Imports", absoluteImports),
    formatGroup("Relative Imports", relativeImports),
    formatGroup("Type Imports", typeImports),
  ].filter(Boolean);

  // Add one blank line between each populated group.
  return groups.join("\n\n");
}
