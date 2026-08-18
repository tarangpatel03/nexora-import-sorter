import { generateImportText } from "./importGenerator";
import { ImportStatement } from "./types";

/**
 * Sorts imports alphabetically by their module source.
 *
 * Example:
 *   react-native
 *   axios
 *   react
 *
 * becomes:
 *   axios
 *   react
 *   react-native
 *
 * `sensitivity: 'base'` makes the sorting case-insensitive.
 */
// function sortImports(imports: ImportStatement[]): ImportStatement[] {
//   return [...imports].sort((a, b) =>
//     a.source.localeCompare(b.source, undefined, {
//       sensitivity: "base",
//     }),
//   );
// }
function sortImports(imports: ImportStatement[]) {
  return imports.sort((a, b) => {
    if (a.hasNamedImportAlias || b.hasNamedImportAlias) {
      return a.start - b.start;
    }

    return a.source.localeCompare(b.source);
  });
}

/**
 * Formats one import group.
 *
 * Example:
 *
 * // Library Imports
 * import axios from 'axios';
 * import React from 'react';
 *
 * Empty groups are ignored so we don't generate unnecessary
 * section comments.
 */
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

/**
 * Groups, sorts, and formats all imports.
 *
 * Final structure:
 *
 * // Side Effect Imports
 * ...
 *
 * // Library Imports
 * ...
 *
 * // Absolute Imports
 * ...
 *
 * // Relative Imports
 * ...
 *
 * //! The order of these groups is intentional.
 * //! Do not change it unless the import hierarchy changes.
 */
export function buildSortedImports(imports: ImportStatement[]): string {
  // Separate imports into their four categories.

  /**
   * Side-effect imports must always appear first.
   */
  const sideEffectImports = imports.filter(
    (importItem) =>
      importItem.group === "sideEffect" && importItem.kind === "runtime",
  );

  /**
   * Normal npm/package imports.
   */
  const libraryImports = imports.filter(
    (importItem) =>
      importItem.group === "library" && importItem.kind === "runtime",
  );

  /**
   * Project absolute imports using the @/ alias.
   */
  const absoluteImports = imports.filter(
    (importItem) =>
      importItem.group === "absolute" && importItem.kind === "runtime",
  );

  /**
   * Relative imports using ./ or ../.
   */
  const relativeImports = imports.filter(
    (importItem) =>
      importItem.group === "relative" && importItem.kind === "runtime",
  );

  const typeImports = imports.filter(
    (importItem) => importItem.kind === "type",
  );

  /**
   * The order here defines the final import hierarchy.
   *
   * Side Effects → Libraries → Absolute → Relative
   */
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
