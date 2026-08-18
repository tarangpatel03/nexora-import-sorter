/**
 * Defines the four import categories supported by the sorter.
 *
 * Priority:
 * 1. sideEffect
 * 2. library
 * 3. absolute
 * 4. relative
 * 5. Types
 */
export type ImportGroup = "sideEffect" | "library" | "absolute" | "relative";
export type ImportKind = "runtime" | "type";

// It will break down import to sort them
export interface ImportStatement {
  text: string; // import React from 'react';
  source: string; // react
  group: ImportGroup; // library
  kind: ImportKind; // Type or normal import

  defaultImport?: string;
  namespaceImport?: string;
  namedImports?: string[];
  hasNamedImportAlias?: boolean;

  isMultiline: boolean;

  start: number; // position where import starts
  end: number; // position where import ends
}

// Config type from VS Code Settings
export interface ImportSorterConfig {
  absoluteAliases: string[];
}
